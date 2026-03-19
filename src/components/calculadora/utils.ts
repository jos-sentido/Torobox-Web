import { PlacedItem, ItemType } from './types';
import { ITEM_TYPES, PIXELS_PER_METER } from './constants';

export function getBoundingBox(item: PlacedItem, allItemTypes: ItemType[] = ITEM_TYPES) {
  const type = allItemTypes.find(t => t.id === item.typeId);
  if (!type) return null;

  const w = type.width * PIXELS_PER_METER;
  const l = type.length * PIXELS_PER_METER;

  const isRotated = item.rotation % 180 !== 0;
  const actualWidth = isRotated ? l : w;
  const actualLength = isRotated ? w : l;

  const margin = 2;

  return {
    left: item.x - actualWidth / 2 + margin,
    right: item.x + actualWidth / 2 - margin,
    top: item.y - actualLength / 2 + margin,
    bottom: item.y + actualLength / 2 - margin,
    height: type.height,
  };
}

export function doIntersect(item1: PlacedItem, item2: PlacedItem, allItemTypes: ItemType[] = ITEM_TYPES) {
  const box1 = getBoundingBox(item1, allItemTypes);
  const box2 = getBoundingBox(item2, allItemTypes);
  if (!box1 || !box2) return false;
  return !(
    box2.left >= box1.right ||
    box2.right <= box1.left ||
    box2.top >= box1.bottom ||
    box2.bottom <= box1.top
  );
}

export function canStack(bottomTypeId: string, topTypeId: string): boolean {
  // Custom items (prefix 'custom-') can support/be placed on anything
  if (bottomTypeId.startsWith('custom-') || topTypeId.startsWith('custom-')) return true;

  const rules: Record<string, string[]> = {
    box: ['box'],
    sofa: ['box', 'bike'],
    chair: [],
    table: ['box', 'chair'],
    cabinet: ['box'],
    bike: [],
    fridge: ['box'],
    bed: ['box', 'bike', 'chair'],
  };
  return rules[bottomTypeId]?.includes(topTypeId) || false;
}

export function applyGravity(
  items: PlacedItem[],
  activeItemId?: string,
  allItemTypes: ItemType[] = ITEM_TYPES
): PlacedItem[] {
  const itemsWithActiveBoost = items.map(item =>
    item.id === activeItemId ? { ...item, z: 9999 } : item
  );

  const sorted = [...itemsWithActiveBoost].sort((a, b) => (a.z || 0) - (b.z || 0));
  const result: PlacedItem[] = [];

  for (const item of sorted) {
    let maxZ = 0;
    let stackedOnId: string | undefined = undefined;
    let stackedOnTypeId: string | undefined = undefined;

    for (const other of result) {
      if (doIntersect(item, other, allItemTypes)) {
        const otherBox = getBoundingBox(other, allItemTypes);
        if (otherBox) {
          const otherTop = (other.z || 0) + otherBox.height;
          if (otherTop > maxZ) {
            maxZ = otherTop;
            stackedOnId = other.id;
            stackedOnTypeId = other.typeId;
          }
        }
      }
    }

    const stackingError = stackedOnTypeId ? !canStack(stackedOnTypeId, item.typeId) : false;
    result.push({ ...item, z: maxZ, stackingError, stackedOn: stackedOnId });
  }

  return result;
}
