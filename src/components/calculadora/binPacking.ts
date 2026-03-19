import { PlacedItem, ItemType, Unit } from './types';
import { PIXELS_PER_METER } from './constants';
import { canStack } from './utils';

// ─── Safety constraints ───────────────────────────────────────────
const MAX_STACK_HEIGHT_RATIO = 0.55;  // Max 55% of unit height for stacking (~1.5m in 2.78m unit)
const MAX_BOX_LEVELS = 2;             // Max 2 boxes stacked on each other
const ACCESS_CORRIDOR = 0.60;         // 60cm corridor reserved for access
const FLOOR_ONLY_IDS = new Set([      // Heavy/tall items: floor only, never stacked
  'fridge', 'cabinet', 'bike', 'chair', 'sofa',
]);
const NARROW_BASE_IDS = new Set([     // Narrow bases: max 1 box on top
  'cabinet', 'fridge',
]);
// ──────────────────────────────────────────────────────────────────

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PlacedEntry {
  item: PlacedItem;
  type: ItemType;
  rect: Rect;
  z: number;
  stackLevel: number; // How many items deep in a stack (0 = floor)
}

/**
 * Bin-packing with edge-based candidate positions and safety constraints.
 *
 * Instead of scanning a blind grid, generates candidate positions from:
 * - Walls (top-left corner, along each wall)
 * - Edges of already-placed items (right/bottom edges → tight packing)
 * - Sparse grid fallback for isolated gaps
 *
 * Evaluates ALL candidates for BOTH rotations to find the optimal position.
 */
export function autoArrange(
  items: PlacedItem[],
  allItemTypes: ItemType[],
  unit: Unit,
): { arranged: PlacedItem[]; overflow: PlacedItem[] } {
  const unitW = unit.width;
  const unitL = unit.length;
  const unitH = unit.height;
  const maxStackZ = unitH * MAX_STACK_HEIGHT_RATIO;

  // Usable width after reserving access corridor
  const usableW = Math.max(unitW - ACCESS_CORRIDOR, unitW * 0.6);

  const enriched = items
    .map(item => {
      const type = allItemTypes.find(t => t.id === item.typeId);
      return { item, type };
    })
    .filter((e): e is { item: PlacedItem; type: ItemType } => !!e.type);

  // Sort: base furniture first, stackable items last, largest first within group
  enriched.sort((a, b) => {
    const pa = getPlacementPriority(a.type);
    const pb = getPlacementPriority(b.type);
    if (pa !== pb) return pa - pb;
    return (b.type.width * b.type.length) - (a.type.width * a.type.length);
  });

  const placed: PlacedEntry[] = [];
  const overflow: PlacedItem[] = [];

  for (const { item, type } of enriched) {
    let wasPlaced = false;

    const isFloorOnly = FLOOR_ONLY_IDS.has(type.id);

    // Try stacking first (unless floor-only)
    if (!isFloorOnly) {
      const stackPos = findStackPosition(type, usableW, unitL, unitH, maxStackZ, placed);
      if (stackPos) {
        const isRotated = stackPos.rotation % 180 !== 0;
        placed.push({
          item: {
            ...item,
            x: stackPos.x * PIXELS_PER_METER,
            y: stackPos.y * PIXELS_PER_METER,
            z: stackPos.z,
            rotation: stackPos.rotation,
            stackingError: false,
            stackedOn: stackPos.stackedOnId,
          },
          type,
          rect: {
            x: stackPos.x,
            y: stackPos.y,
            w: isRotated ? type.length : type.width,
            h: isRotated ? type.width : type.length,
          },
          z: stackPos.z,
          stackLevel: stackPos.stackLevel,
        });
        wasPlaced = true;
      }
    }

    // Fall back to floor — first try with corridor, then without
    if (!wasPlaced) {
      const floorPos = findFloorPosition(type, usableW, unitL, placed)
        ?? findFloorPosition(type, unitW, unitL, placed);
      if (floorPos) {
        const isRotated = floorPos.rotation % 180 !== 0;
        placed.push({
          item: {
            ...item,
            x: floorPos.x * PIXELS_PER_METER,
            y: floorPos.y * PIXELS_PER_METER,
            z: 0,
            rotation: floorPos.rotation,
            stackingError: false,
            stackedOn: undefined,
          },
          type,
          rect: {
            x: floorPos.x,
            y: floorPos.y,
            w: isRotated ? type.length : type.width,
            h: isRotated ? type.width : type.length,
          },
          z: 0,
          stackLevel: 0,
        });
        wasPlaced = true;
      }
    }

    if (!wasPlaced) {
      overflow.push(item);
    }
  }

  return {
    arranged: placed.map(p => p.item),
    overflow,
  };
}

/** Place base/support furniture first, stackable items last */
function getPlacementPriority(type: ItemType): number {
  if (['bed', 'sofa', 'table'].includes(type.id)) return 1;
  if (['cabinet', 'fridge'].includes(type.id)) return 2;
  if (['chair', 'bike'].includes(type.id)) return 3;
  if (type.id === 'box') return 4;
  return 3; // Custom items
}

/**
 * Generate candidate (x,y) positions for floor placement.
 * Uses edges of placed items + walls + sparse grid for comprehensive coverage.
 */
function generateFloorCandidates(
  w: number,
  h: number,
  usableW: number,
  unitL: number,
  placed: PlacedEntry[],
): { x: number; y: number }[] {
  const candidates: { x: number; y: number }[] = [];
  const hw = w / 2;
  const hh = h / 2;
  const GAP = 0.02; // 2cm gap between items

  // Corner: top-left (against both walls)
  candidates.push({ x: hw, y: hh });

  // For each floor-level placed item, generate anchor positions
  for (const p of placed) {
    if (p.z !== 0) continue;
    const pr = p.rect;
    const pRight = pr.x + pr.w / 2 + GAP;
    const pBottom = pr.y + pr.h / 2 + GAP;
    const pLeft = pr.x - pr.w / 2 - GAP;
    const pTop = pr.y - pr.h / 2;

    // Right of item, aligned with its top
    candidates.push({ x: pRight + hw, y: pTop + hh });
    // Right of item, aligned with top wall
    candidates.push({ x: pRight + hw, y: hh });
    // Right of item, aligned with its center
    candidates.push({ x: pRight + hw, y: pr.y });

    // Below item, aligned with its left
    candidates.push({ x: pr.x - pr.w / 2 + hw, y: pBottom + hh });
    // Below item, aligned with left wall
    candidates.push({ x: hw, y: pBottom + hh });
    // Below item, aligned with its center
    candidates.push({ x: pr.x, y: pBottom + hh });

    // Left of item (for filling right-side gaps)
    candidates.push({ x: pLeft - hw, y: pTop + hh });
    candidates.push({ x: pLeft - hw, y: hh });

    // Cross-references: right of one item, below another
    for (const q of placed) {
      if (q === p || q.z !== 0) continue;
      const qBottom = q.rect.y + q.rect.h / 2 + GAP;
      candidates.push({ x: pRight + hw, y: qBottom + hh });
    }
  }

  // Sparse grid fallback (10cm) for gaps not covered by edge candidates
  const gridStep = 0.10;
  for (let gy = hh; gy <= unitL - hh + 0.001; gy += gridStep) {
    for (let gx = hw; gx <= usableW - hw + 0.001; gx += gridStep) {
      candidates.push({ x: gx, y: gy });
    }
  }

  // Filter to valid bounds and deduplicate (round to 1mm to avoid near-duplicates)
  const seen = new Set<string>();
  return candidates.filter(c => {
    if (c.x < hw - 0.001 || c.x > usableW - hw + 0.001) return false;
    if (c.y < hh - 0.001 || c.y > unitL - hh + 0.001) return false;
    const key = `${Math.round(c.x * 1000)},${Math.round(c.y * 1000)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Find the best floor position by evaluating ALL candidate positions
 * for BOTH rotations. No early-break — finds the globally optimal spot.
 */
function findFloorPosition(
  type: ItemType,
  usableW: number,
  unitL: number,
  placed: PlacedEntry[],
): { x: number; y: number; rotation: number } | null {
  let best: { x: number; y: number; rotation: number } | null = null;
  let bestScore = Infinity;

  for (const rotation of [0, 90]) {
    const isRotated = rotation % 180 !== 0;
    const w = isRotated ? type.length : type.width;
    const h = isRotated ? type.width : type.length;

    if (w > usableW + 0.001 || h > unitL + 0.001) continue;

    const candidates = generateFloorCandidates(w, h, usableW, unitL, placed);

    for (const { x, y } of candidates) {
      const candidateRect: Rect = { x, y, w, h };

      let collides = false;
      for (const p of placed) {
        if (p.z === 0 && rectsOverlap(candidateRect, p.rect)) {
          collides = true;
          break;
        }
      }
      if (collides) continue;

      // Score: prefer top-left packing (low y, then low x)
      const score = y * 1000 + x;
      if (score < bestScore) {
        bestScore = score;
        best = { x, y, rotation };
      }
    }
  }

  return best;
}

/**
 * Find the best stacking position with safety constraints.
 * Evaluates all valid positions across all bases and rotations.
 */
function findStackPosition(
  type: ItemType,
  usableW: number,
  unitL: number,
  unitH: number,
  maxStackZ: number,
  placed: PlacedEntry[],
): { x: number; y: number; z: number; rotation: number; stackedOnId: string; stackLevel: number } | null {
  let best: { x: number; y: number; z: number; rotation: number; stackedOnId: string; stackLevel: number } | null = null;
  let bestScore = Infinity;
  const step = 0.05;

  for (const base of placed) {
    if (!canStack(base.type.id, type.id)) continue;

    const topZ = base.z + base.type.height;
    const newTopZ = topZ + type.height;

    // Safety checks
    if (newTopZ > maxStackZ) continue;
    if (newTopZ > unitH) continue;

    const newStackLevel = base.stackLevel + 1;
    if (type.id === 'box' && base.type.id === 'box' && newStackLevel > MAX_BOX_LEVELS) continue;
    if (NARROW_BASE_IDS.has(base.type.id) && base.stackLevel > 0) continue;

    // Safety: don't stack items wider than their base
    const typeArea = type.width * type.length;
    const baseArea = base.type.width * base.type.length;
    if (typeArea > baseArea * 1.1) continue;

    // Base surface bounds
    const baseLeft = base.rect.x - base.rect.w / 2;
    const baseTop = base.rect.y - base.rect.h / 2;
    const baseRight = base.rect.x + base.rect.w / 2;
    const baseBottom = base.rect.y + base.rect.h / 2;

    for (const rotation of [0, 90]) {
      const isRotated = rotation % 180 !== 0;
      const w = isRotated ? type.length : type.width;
      const h = isRotated ? type.width : type.length;

      // Must fit within base footprint AND usable area
      const minX = Math.max(w / 2, baseLeft + w / 2);
      const maxX = Math.min(usableW - w / 2, baseRight - w / 2);
      const minY = Math.max(h / 2, baseTop + h / 2);
      const maxY = Math.min(unitL - h / 2, baseBottom - h / 2);

      if (minX > maxX + 0.001 || minY > maxY + 0.001) continue;

      // Generate candidate positions: corners of base + grid
      const xCandidates = [minX, maxX, (minX + maxX) / 2];
      const yCandidates = [minY, maxY, (minY + maxY) / 2];

      // Add positions adjacent to other stacked items on same base
      for (const other of placed) {
        if (other.z < topZ - 0.001 || other.z > topZ + 0.001) continue;
        const otherRight = other.rect.x + other.rect.w / 2 + w / 2 + 0.02;
        const otherBottom = other.rect.y + other.rect.h / 2 + h / 2 + 0.02;
        if (otherRight >= minX && otherRight <= maxX) xCandidates.push(otherRight);
        if (otherBottom >= minY && otherBottom <= maxY) yCandidates.push(otherBottom);
      }

      // Also add grid points for thorough coverage
      for (let gx = minX; gx <= maxX + 0.001; gx += step) xCandidates.push(gx);
      for (let gy = minY; gy <= maxY + 0.001; gy += step) yCandidates.push(gy);

      for (const y of yCandidates) {
        if (y < minY - 0.001 || y > maxY + 0.001) continue;
        for (const x of xCandidates) {
          if (x < minX - 0.001 || x > maxX + 0.001) continue;
          const candidateRect: Rect = { x, y, w, h };

          let collides = false;
          for (const other of placed) {
            if (other === base) continue;
            const otherBottom = other.z;
            const otherTopZ = otherBottom + other.type.height;
            const candBottom = topZ;
            const candTopZ = topZ + type.height;
            if (candBottom < otherTopZ && candTopZ > otherBottom) {
              if (rectsOverlap(candidateRect, other.rect)) {
                collides = true;
                break;
              }
            }
          }
          if (collides) continue;

          // Score: prefer lower z, then pack towards corner of base
          const score = topZ * 10000 + (y - baseTop) * 100 + (x - baseLeft);
          if (score < bestScore) {
            bestScore = score;
            best = { x, y, z: topZ, rotation, stackedOnId: base.item.id, stackLevel: newStackLevel };
          }
        }
      }
    }
  }

  return best;
}

function rectsOverlap(a: Rect, b: Rect): boolean {
  const margin = 0.01;
  return !(
    a.x - a.w / 2 + margin >= b.x + b.w / 2 - margin ||
    a.x + a.w / 2 - margin <= b.x - b.w / 2 + margin ||
    a.y - a.h / 2 + margin >= b.y + b.h / 2 - margin ||
    a.y + a.h / 2 - margin <= b.y - b.h / 2 + margin
  );
}
