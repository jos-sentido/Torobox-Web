import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';

interface ItemInput {
  id: string;
  typeId: string;
  typeName: string;
  width: number;
  length: number;
  height: number;
}

interface UnitInput {
  width: number;
  length: number;
  height: number;
}

// ─── AI returns a PLAN, not coordinates ─────────────────────────────
const planSchema = z.object({
  placementOrder: z.array(z.object({
    id: z.string().describe('ID del artículo'),
    rotation: z.number().describe('0 = sin rotar, 90 = rotado 90°'),
    stackOnId: z.string().optional().describe('ID del artículo sobre el que se apila. Omitir si va en el piso.'),
  })).describe('Orden en que se deben colocar los artículos (primero = fondo, último = entrada)'),
  overflow: z.array(z.string()).describe('IDs de artículos que definitivamente no caben'),
  summary: z.string().describe('Explicación breve del acomodo en español (1-2 oraciones)'),
});

// ─── Safety constants ───────────────────────────────────────────────
const MAX_STACK_HEIGHT_RATIO = 0.85;  // 85% of unit height (~2.36m in 2.78m unit)
const MAX_BOX_LEVELS = 2;             // Max 2 boxes stacked on each other
const ACCESS_CORRIDOR = 0.60;
const NARROW_BASE_IDS = new Set(['cabinet', 'fridge']);

// ─── Code-based placement engine ────────────────────────────────────
interface Rect { x: number; y: number; w: number; h: number; }
interface PlacedEntry {
  id: string;
  typeId: string;
  rect: Rect;
  z: number;
  height: number;
  stackLevel: number;
}

function rectsOverlap(a: Rect, b: Rect): boolean {
  const m = 0.01;
  return !(
    a.x - a.w / 2 + m >= b.x + b.w / 2 - m ||
    a.x + a.w / 2 - m <= b.x - b.w / 2 + m ||
    a.y - a.h / 2 + m >= b.y + b.h / 2 - m ||
    a.y + a.h / 2 - m <= b.y - b.h / 2 + m
  );
}

function findFloorPosition(
  w: number, h: number,
  usableW: number, unitL: number,
  placed: PlacedEntry[],
): { x: number; y: number } | null {
  const GAP = 0.02;
  const hw = w / 2;
  const hh = h / 2;

  const candidates: { x: number; y: number }[] = [{ x: hw, y: hh }];

  for (const p of placed) {
    if (p.z !== 0) continue;
    const pr = p.rect;
    const pRight = pr.x + pr.w / 2 + GAP;
    const pBottom = pr.y + pr.h / 2 + GAP;

    candidates.push({ x: pRight + hw, y: pr.y - pr.h / 2 + hh });
    candidates.push({ x: pRight + hw, y: hh });
    candidates.push({ x: hw, y: pBottom + hh });
    candidates.push({ x: pr.x - pr.w / 2 + hw, y: pBottom + hh });
    candidates.push({ x: pRight + hw, y: pBottom + hh });

    for (const q of placed) {
      if (q === p || q.z !== 0) continue;
      const qBottom = q.rect.y + q.rect.h / 2 + GAP;
      candidates.push({ x: pRight + hw, y: qBottom + hh });
    }
  }

  // Sparse grid fallback
  for (let gy = hh; gy <= unitL - hh + 0.001; gy += 0.10) {
    for (let gx = hw; gx <= usableW - hw + 0.001; gx += 0.10) {
      candidates.push({ x: gx, y: gy });
    }
  }

  const seen = new Set<string>();
  const valid = candidates.filter(c => {
    if (c.x < hw - 0.001 || c.x > usableW - hw + 0.001) return false;
    if (c.y < hh - 0.001 || c.y > unitL - hh + 0.001) return false;
    const key = `${Math.round(c.x * 1000)},${Math.round(c.y * 1000)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  let best: { x: number; y: number } | null = null;
  let bestScore = Infinity;

  for (const { x, y } of valid) {
    const rect: Rect = { x, y, w, h };
    let collides = false;
    for (const p of placed) {
      if (p.z === 0 && rectsOverlap(rect, p.rect)) { collides = true; break; }
    }
    if (collides) continue;
    const score = y * 1000 + x;
    if (score < bestScore) { bestScore = score; best = { x, y }; }
  }

  return best;
}

/**
 * Find the best stacking position on a specific base item.
 * Supports multiple boxes side-by-side on the same base, and box-on-box stacking.
 */
function findStackPosition(
  w: number, h: number, itemHeight: number,
  itemTypeId: string,
  base: PlacedEntry,
  usableW: number, unitL: number, unitH: number, maxStackZ: number,
  placed: PlacedEntry[],
): { x: number; y: number; z: number; stackLevel: number } | null {
  // Find the actual surface to stack on: could be the base itself or a box on the base
  // We need to find all possible z-levels on this base's footprint

  // Narrow base items: max 1 box total on top
  if (NARROW_BASE_IDS.has(base.typeId)) {
    const hasBoxOnTop = placed.some(p =>
      p.z >= base.z + base.height - 0.01 && p.id !== base.id
      && rectsOverlap(p.rect, base.rect)
    );
    if (hasBoxOnTop) return null;
  }

  // Collect all possible z-levels to try stacking on
  const zLevels: { z: number; stackLevel: number; supportId: string }[] = [];

  // Direct on base
  const baseTopZ = base.z + base.height;
  zLevels.push({ z: baseTopZ, stackLevel: 1, supportId: base.id });

  // On top of boxes that are already on this base (box-on-box, level 2)
  if (itemTypeId === 'box') {
    for (const p of placed) {
      if (p.typeId !== 'box') continue;
      if (p.stackLevel < 1) continue;
      // Check if this box is roughly above the base
      if (p.z < baseTopZ - 0.01) continue;
      const pTopZ = p.z + p.height;
      const newLevel = p.stackLevel + 1;
      if (newLevel > MAX_BOX_LEVELS) continue;
      zLevels.push({ z: pTopZ, stackLevel: newLevel, supportId: p.id });
    }
  }

  let best: { x: number; y: number; z: number; stackLevel: number } | null = null;
  let bestScore = Infinity;

  for (const { z: targetZ, stackLevel, supportId } of zLevels) {
    if (targetZ + itemHeight > maxStackZ || targetZ + itemHeight > unitH) continue;

    // For level 1 (on furniture): constrain to base footprint
    // For level 2+ (on box): constrain to support footprint
    const support = supportId === base.id ? base : placed.find(p => p.id === supportId);
    if (!support) continue;

    const sLeft = support.rect.x - support.rect.w / 2;
    const sTop = support.rect.y - support.rect.h / 2;
    const sRight = support.rect.x + support.rect.w / 2;
    const sBottom = support.rect.y + support.rect.h / 2;

    // For stacking on furniture (level 1), use the full base footprint
    // For stacking on boxes (level 2), the box can be anywhere on the original base
    const constraintLeft = stackLevel === 1 ? sLeft : (base.rect.x - base.rect.w / 2);
    const constraintTop = stackLevel === 1 ? sTop : (base.rect.y - base.rect.h / 2);
    const constraintRight = stackLevel === 1 ? sRight : (base.rect.x + base.rect.w / 2);
    const constraintBottom = stackLevel === 1 ? sBottom : (base.rect.y + base.rect.h / 2);

    const minX = Math.max(w / 2, constraintLeft + w / 2);
    const maxX = Math.min(usableW - w / 2, constraintRight - w / 2);
    const minY = Math.max(h / 2, constraintTop + h / 2);
    const maxY = Math.min(unitL - h / 2, constraintBottom - h / 2);

    if (minX > maxX + 0.001 || minY > maxY + 0.001) continue;

    const xCands = [minX, maxX, (minX + maxX) / 2];
    const yCands = [minY, maxY, (minY + maxY) / 2];
    for (let gx = minX; gx <= maxX + 0.001; gx += 0.05) xCands.push(gx);
    for (let gy = minY; gy <= maxY + 0.001; gy += 0.05) yCands.push(gy);

    for (const y of yCands) {
      if (y < minY - 0.001 || y > maxY + 0.001) continue;
      for (const x of xCands) {
        if (x < minX - 0.001 || x > maxX + 0.001) continue;
        const rect: Rect = { x, y, w, h };
        let collides = false;
        for (const other of placed) {
          if (other.id === base.id) continue;
          const oBot = other.z;
          const oTop = oBot + other.height;
          const cBot = targetZ;
          const cTop = targetZ + itemHeight;
          if (cBot < oTop && cTop > oBot && rectsOverlap(rect, other.rect)) {
            collides = true; break;
          }
        }
        if (collides) continue;
        // Score: prefer lower z first, then pack top-left
        const score = targetZ * 10000 + (y - constraintTop) * 100 + (x - constraintLeft);
        if (score < bestScore) {
          bestScore = score;
          best = { x, y, z: targetZ, stackLevel };
        }
      }
    }
  }

  return best;
}

// ─── Build stacking capacity info for the prompt ────────────────────
function buildStackingInfo(items: ItemInput[], unit: UnitInput): string {
  const boxW = 0.5, boxL = 0.5, boxH = 0.5;
  const maxStackH = unit.height * MAX_STACK_HEIGHT_RATIO;
  const lines: string[] = [];

  // Deduplicate by typeId
  const seenTypes = new Set<string>();
  for (const item of items) {
    if (seenTypes.has(item.typeId)) continue;
    seenTypes.add(item.typeId);

    const isNarrow = NARROW_BASE_IDS.has(item.typeId);
    const canStackBoxes = ['bed', 'table', 'sofa', 'cabinet', 'fridge', 'box'].includes(item.typeId);
    const neverStack = ['chair', 'bike'].includes(item.typeId);

    if (neverStack) {
      lines.push(`- ${item.typeName} (${item.width}×${item.length}m, h=${item.height}m): NO se puede apilar nada encima.`);
      continue;
    }

    if (!canStackBoxes && !item.typeId.startsWith('custom-')) continue;

    if (item.typeId.startsWith('custom-')) {
      lines.push(`- ${item.typeName} (${item.width}×${item.length}m, h=${item.height}m): Solo cajas encima si la superficie es plana. Máx 1 caja.`);
      continue;
    }

    if (isNarrow) {
      const fits = (item.height + boxH) <= maxStackH;
      lines.push(`- ${item.typeName} (${item.width}×${item.length}m, h=${item.height}m): Máximo 1 caja encima. ${fits ? '✓ Cabe.' : '✗ Excede altura.'}`);
      continue;
    }

    if (item.typeId === 'box') {
      lines.push(`- Caja sobre Caja: Máximo ${MAX_BOX_LEVELS} niveles de cajas apiladas.`);
      continue;
    }

    // Furniture with flat surface: calculate exact capacity
    const boxesX = Math.floor(item.width / boxW);
    const boxesY = Math.floor(item.length / boxL);
    const layer1 = boxesX * boxesY;

    const layer1TopZ = item.height + boxH;
    const layer2TopZ = item.height + boxH * 2;
    const canLayer2 = layer2TopZ <= maxStackH;

    const total = canLayer2 ? layer1 * 2 : layer1;
    const layers = canLayer2 ? 2 : 1;

    lines.push(`- ${item.typeName} (${item.width}×${item.length}m, h=${item.height}m): Caben ${boxesX}×${boxesY}=${layer1} cajas por capa. ${layers} capa(s) posible(s). Total: ${total} cajas. Altura máxima: ${(canLayer2 ? layer2TopZ : layer1TopZ).toFixed(1)}m.`);
  }

  return lines.join('\n');
}

// ─── Main handler ───────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { items, unit }: { items: ItemInput[]; unit: UnitInput } = await req.json();

    if (!items || items.length === 0) {
      return Response.json({ placements: [], overflow: [], summary: 'No hay objetos para acomodar.' });
    }

    const itemMap = new Map(items.map(i => [i.id, i]));
    const maxStackH = unit.height * MAX_STACK_HEIGHT_RATIO;

    const itemList = items
      .map((item, i) => `  ${i + 1}. id="${item.id}" tipo="${item.typeName}" (${item.typeId}) ancho=${item.width}m largo=${item.length}m alto=${item.height}m`)
      .join('\n');

    const stackingInfo = buildStackingInfo(items, unit);

    // Count items by type for the analysis
    const itemCounts: Record<string, number> = {};
    for (const item of items) {
      itemCounts[item.typeName] = (itemCounts[item.typeName] || 0) + 1;
    }
    const itemCountSummary = Object.entries(itemCounts)
      .map(([name, count]) => `${count}× ${name}`)
      .join(', ');

    // Calculate total floor area needed by non-stackable items
    const floorOnlyItems = items.filter(i => !['box'].includes(i.typeId));
    const floorAreaNeeded = floorOnlyItems.reduce((sum, i) => sum + i.width * i.length, 0);
    const boxCount = items.filter(i => i.typeId === 'box').length;

    // Calculate total stacking capacity
    const stackableItems = items.filter(i => ['bed', 'table', 'sofa'].includes(i.typeId));
    const totalStackCapacity = stackableItems.reduce((sum, i) => {
      const perLayer = Math.floor(i.width / 0.5) * Math.floor(i.length / 0.5);
      const canLayer2 = (i.height + 1.0) <= maxStackH;
      return sum + (canLayer2 ? perLayer * 2 : perLayer);
    }, 0);
    const narrowItems = items.filter(i => NARROW_BASE_IDS.has(i.typeId));
    const narrowCapacity = narrowItems.length; // 1 box each

    const prompt = `Eres un experto en logística y optimización de espacio en mini bodegas de almacenamiento (self-storage). Tu trabajo es decidir la MEJOR estrategia para acomodar los artículos del cliente.

## PASO 1: ESTUDIA LA BODEGA
Dimensiones exactas de esta bodega:
- ANCHO (eje X, pared a pared): ${unit.width}m
- LARGO (eje Y, fondo a entrada): ${unit.length}m
- ALTO (eje Z, piso a techo): ${unit.height}m
- Área de piso total: ${(unit.width * unit.length).toFixed(2)}m²
- Volumen total: ${(unit.width * unit.length * unit.height).toFixed(2)}m³
- Área útil de piso (sin corredor de 60cm): ${(Math.max(unit.width - 0.6, unit.width * 0.6) * unit.length).toFixed(2)}m²
- Altura máxima segura de apilamiento: ${maxStackH.toFixed(2)}m

## PASO 2: ESTUDIA CADA ARTÍCULO
${itemList}

Resumen: ${itemCountSummary}
Total de cajas: ${boxCount}

Dimensiones clave de cada tipo:
- Caja Estándar: 0.5×0.5×0.5m — es el artículo más versátil, puede ir en piso o apilada
- Sillón 3 Plazas: 2.2×0.9×0.9m — superficie plana, se pueden poner cajas encima
- Silla: 0.5×0.5×1.0m — NO se puede apilar nada encima (se rompe)
- Mesa de Comedor: 1.6×0.9×0.8m — superficie plana, se pueden poner cajas encima
- Archivero: 0.5×0.6×1.3m — superficie pequeña, máximo 1 caja encima
- Bicicleta: 1.8×0.6×1.0m — forma irregular, NO se puede apilar nada encima
- Refrigerador: 0.8×0.8×1.8m — superficie pequeña, máximo 1 caja encima
- Cama Matrimonial: 1.4×1.9×0.6m — superficie GRANDE y plana, ideal para cajas encima

## PASO 3: CAPACIDAD EXACTA DE APILAMIENTO
${stackingInfo}

Capacidad total de apilamiento sobre muebles: ${totalStackCapacity + narrowCapacity} cajas (${totalStackCapacity} en muebles grandes + ${narrowCapacity} en archiveros/refris).
Cajas que necesitan piso: ${Math.max(0, boxCount - totalStackCapacity - narrowCapacity)} de ${boxCount}.

## PASO 4: PIENSA ESTRATÉGICAMENTE
EL PISO ES VALIOSO. Es un recurso limitado (${(unit.width * unit.length).toFixed(1)}m²). Los muebles, sillas, bicis y objetos grandes NECESITAN piso obligatoriamente. Las cajas NO — pueden ir encima de muebles.

PRINCIPIO CLAVE: Si tienes muebles con superficie plana (camas, mesas, sillones), las cajas deben ir ENCIMA de esos muebles PRIMERO, NO en el piso. El espacio de piso que ahorras al subir cajas se usa para artículos que solo pueden ir en el piso.

Ejemplo de pensamiento correcto:
- Tienes 2 camas, 1 bici y 8 cajas.
- Cada cama admite hasta 12 cajas (6 por capa × 2 capas).
- Las 8 cajas caben en las camas → 0 cajas en piso.
- El piso queda libre para las camas y la bici.

Ejemplo de pensamiento INCORRECTO:
- Poner cajas en el piso y luego decir que la bici no cabe.
- Las cajas se suben a los muebles y la bici va en el piso.

## PASO 5: REGLAS FÍSICAS (SENTIDO COMÚN)
- Un refrigerador encima de una silla = la silla se rompe. PROHIBIDO.
- Cajas encima de una cama = perfectamente seguro. PERMITIDO.
- Solo CAJAS se apilan sobre muebles. No poner muebles sobre muebles.
- Máximo ${MAX_BOX_LEVELS} niveles de cajas (caja sobre caja). No más.
- Archivero y Refrigerador: máximo 1 caja encima (base muy pequeña/alta).
- NUNCA apilar NADA sobre: sillas, bicicletas.
- La altura total no debe exceder ${maxStackH.toFixed(2)}m.

## PASO 6: ORDEN DE COLOCACIÓN
1. PRIMERO: Muebles grandes al fondo (camas, sillones, mesas) — empacando desde y=0 (fondo) hacia la entrada.
2. SEGUNDO: Archiveros, refrigeradores.
3. TERCERO: Sillas, bicicletas, objetos que solo van en piso.
4. ÚLTIMO: Cajas — PRIMERO apiladas sobre muebles (llenar toda la capacidad vertical), las sobrantes van en piso.
- Rota artículos (90°) cuando eso aproveche mejor el ancho de ${unit.width}m.

## TU TAREA
Devuelve el PLAN de acomodo:
1. "placementOrder": lista ordenada de TODOS los artículos.
   - Muebles/sillas/bicis: van al piso (sin stackOnId).
   - Cajas que van sobre un mueble: stackOnId = ID del mueble base.
   - Cajas que van en piso (solo si ya no caben arriba): sin stackOnId.
2. "overflow": IDs de artículos que DEFINITIVAMENTE no caben (después de apilar todo lo posible).
3. "summary": 1-2 oraciones describiendo el acomodo.

REGLA CRÍTICA: El motor de colocación se encarga de las coordenadas exactas y de colocar las cajas en la capa correcta (nivel 1 o nivel 2). Tú solo decides: ¿esta caja va sobre este mueble (stackOnId) o va en el piso (sin stackOnId)?
Cuando pongas cajas sobre un mueble, pon TODAS las que quepan con stackOnId = ese mueble. El motor las distribuye automáticamente en las capas disponibles.`;

    const result = await generateObject({
      model: anthropic('claude-sonnet-4-20250514'),
      prompt,
      schema: planSchema,
    });

    const plan = result.object;
    const overflowIds = new Set<string>(plan.overflow ?? []);

    // ─── Execute the AI plan with code-based coordinate calculation ───
    const usableW = Math.max(unit.width - ACCESS_CORRIDOR, unit.width * 0.6);

    const placed: PlacedEntry[] = [];
    const placements: Array<{
      id: string; x: number; y: number; z: number;
      rotation: number; stackedOnId?: string;
    }> = [];
    const overflow: string[] = [...overflowIds];

    for (const step of plan.placementOrder) {
      const item = itemMap.get(step.id);
      if (!item || overflowIds.has(step.id)) continue;

      const rotation = step.rotation === 90 ? 90 : 0;
      const isRotated = rotation === 90;
      const w = isRotated ? item.length : item.width;
      const h = isRotated ? item.width : item.length;

      let placementResult: { x: number; y: number; z: number; stackedOnId?: string; stackLevel: number } | null = null;

      // If AI says stack on something, try that first
      if (step.stackOnId) {
        const base = placed.find(p => p.id === step.stackOnId);
        if (base) {
          const pos = findStackPosition(w, h, item.height, item.typeId, base, usableW, unit.length, unit.height, maxStackH, placed);
          if (pos) {
            placementResult = { ...pos, stackedOnId: step.stackOnId };
          }
        }
        // If couldn't stack on specified base, try any other valid base
        if (!placementResult) {
          for (const base of placed) {
            if (base.z !== 0) continue; // Only stack on floor-level furniture
            if (!canStackOn(base.typeId, item.typeId)) continue;
            const pos = findStackPosition(w, h, item.height, item.typeId, base, usableW, unit.length, unit.height, maxStackH, placed);
            if (pos) {
              placementResult = { ...pos, stackedOnId: base.id };
              break;
            }
          }
        }
      }

      // Fall back to floor placement (with corridor, then without)
      if (!placementResult) {
        const pos = findFloorPosition(w, h, usableW, unit.length, placed)
          ?? findFloorPosition(w, h, unit.width, unit.length, placed);
        if (pos) {
          placementResult = { x: pos.x, y: pos.y, z: 0, stackLevel: 0 };
        }
      }

      if (placementResult) {
        placed.push({
          id: item.id,
          typeId: item.typeId,
          rect: { x: placementResult.x, y: placementResult.y, w, h },
          z: placementResult.z,
          height: item.height,
          stackLevel: placementResult.stackLevel,
        });
        placements.push({
          id: item.id,
          x: placementResult.x,
          y: placementResult.y,
          z: placementResult.z,
          rotation,
          stackedOnId: placementResult.stackedOnId,
        });
      } else {
        overflow.push(item.id);
      }
    }

    return Response.json({
      placements,
      overflow,
      summary: plan.summary,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('calculadora-arrange error:', msg);
    return Response.json(
      { placements: [], overflow: [], summary: 'Error al calcular el acomodo. Intenta de nuevo.' },
      { status: 500 },
    );
  }
}

/** Check if a box can be stacked on a given base type */
function canStackOn(baseTypeId: string, topTypeId: string): boolean {
  if (topTypeId !== 'box') return false;
  return ['bed', 'table', 'sofa', 'cabinet', 'fridge', 'box'].includes(baseTypeId)
    || baseTypeId.startsWith('custom-');
}
