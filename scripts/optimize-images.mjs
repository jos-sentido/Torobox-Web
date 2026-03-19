/**
 * Optimizes all images in public/images/sucursales/
 * - Converts to WebP (quality 80)
 * - Resizes to max 1920px wide (preserves aspect ratio)
 * - Renames files to clean kebab-case names
 * - Removes originals after conversion
 *
 * Run: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { readdir, rename, unlink, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const BASE = 'public/images/sucursales';
const MAX_WIDTH = 1920;
const QUALITY = 80;

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/whatsapp image /gi, '')
    .replace(/\s*-\s*copia/gi, '')
    .replace(/[()]/g, '')
    .replace(/\s+at\s+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_.]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function optimizeFolder(folder) {
  const dir = join(BASE, folder);
  const files = await readdir(dir);
  const imageFiles = files.filter(f =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  );

  let saved = 0;
  let count = 0;

  for (const file of imageFiles) {
    const src = join(dir, file);
    const ext = extname(file);
    const base = basename(file, ext);
    const cleanName = slugify(base) + '.webp';
    const dest = join(dir, cleanName);

    try {
      const before = (await stat(src)).size;

      const img = sharp(src);
      const meta = await img.metadata();

      let pipeline = img;
      if (meta.width && meta.width > MAX_WIDTH) {
        pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
      }

      await pipeline
        .webp({ quality: QUALITY })
        .toFile(dest + '.tmp');

      // Remove original if different from dest
      if (src !== dest) {
        await unlink(src);
      }

      // Rename tmp to final
      await rename(dest + '.tmp', dest);

      const after = (await stat(dest)).size;
      saved += before - after;
      count++;

      const pct = ((1 - after / before) * 100).toFixed(0);
      console.log(`  ${folder}/${file} -> ${cleanName} (${pct}% smaller)`);
    } catch (err) {
      console.error(`  ERROR ${folder}/${file}: ${err.message}`);
    }
  }

  return { count, saved };
}

async function main() {
  const folders = await readdir(BASE);
  let totalSaved = 0;
  let totalCount = 0;

  for (const folder of folders) {
    const s = await stat(join(BASE, folder));
    if (!s.isDirectory()) continue;

    console.log(`\n=== ${folder} ===`);
    const { count, saved } = await optimizeFolder(folder);
    totalCount += count;
    totalSaved += saved;
  }

  console.log(`\n--- Done ---`);
  console.log(`${totalCount} images optimized`);
  console.log(`${(totalSaved / 1048576).toFixed(1)} MB saved`);
}

main().catch(console.error);
