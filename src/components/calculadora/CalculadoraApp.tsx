'use client';

import { useState, useMemo, useCallback } from 'react';
import { Unit, Branch, PlacedItem, ItemType } from './types';
import { BRANCHES, ITEM_TYPES, PIXELS_PER_METER } from './constants';
import Sidebar from './Sidebar';
import CanvasArea from './CanvasArea';
import StatsPanel from './StatsPanel';
import { applyGravity } from './utils';

export interface AIAnalysis {
  summary: string;
  canOptimize: boolean;
  itemsToRemove: string[];
}

export interface OverflowInfo {
  items: PlacedItem[];
  names: string[];
}

export default function CalculadoraApp() {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES[0]);
  const [selectedUnit, setSelectedUnit] = useState<Unit>(BRANCHES[0].units[0]);
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [customItems, setCustomItems] = useState<ItemType[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isArranging, setIsArranging] = useState(false);
  const [hasArranged, setHasArranged] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [overflowInfo, setOverflowInfo] = useState<OverflowInfo | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'bodega' | 'objetos' | 'resumen'>('bodega');

  const allItemTypes = useMemo(() => [...ITEM_TYPES, ...customItems], [customItems]);

  // ── Toast system (replaces alert()) ─────────────────────────────
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Reset helpers ───────────────────────────────────────────────
  const clearFeedback = useCallback(() => {
    setAiAnalysis(null);
    setOverflowInfo(null);
    setHasArranged(false);
  }, []);

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setSelectedUnit(branch.units[0]);
    setItems([]);
    clearFeedback();
  };

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setItems([]);
    clearFeedback();
  };

  const handleAddCustomItem = (item: ItemType) => {
    setCustomItems(prev => [...prev, item]);
  };

  const handleDeleteCustomItem = (id: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== id));
    setItems(prev => applyGravity(prev.filter(item => item.typeId !== id), undefined, allItemTypes));
  };

  const clampPosition = (x: number, y: number, itemWidth: number, itemLength: number, rotation: number) => {
    const isRotated = rotation % 180 !== 0;
    const w = (isRotated ? itemLength : itemWidth) * PIXELS_PER_METER;
    const h = (isRotated ? itemWidth : itemLength) * PIXELS_PER_METER;
    const unitWidthPx = selectedUnit.width * PIXELS_PER_METER;
    const unitLengthPx = selectedUnit.length * PIXELS_PER_METER;
    return {
      x: Math.max(w / 2, Math.min(x, unitWidthPx - w / 2)),
      y: Math.max(h / 2, Math.min(y, unitLengthPx - h / 2)),
    };
  };

  /** Validate if item fits in unit — returns true if OK, shows toast if not */
  const validateFit = (itemType: ItemType): { ok: boolean; rotation: number } => {
    const itemMin = Math.min(itemType.width, itemType.length);
    const itemMax = Math.max(itemType.width, itemType.length);
    const unitMin = Math.min(selectedUnit.width, selectedUnit.length);
    const unitMax = Math.max(selectedUnit.width, selectedUnit.length);

    if (itemMin > unitMin || itemMax > unitMax || itemType.height > selectedUnit.height) {
      showToast(`"${itemType.name}" es demasiado grande para esta bodega.`);
      return { ok: false, rotation: 0 };
    }

    let rotation = 0;
    if (itemType.width > selectedUnit.width || itemType.length > selectedUnit.length) {
      rotation = 90;
    }
    return { ok: true, rotation };
  };

  const handleDropItem = (typeId: string, x: number, y: number) => {
    const itemType = allItemTypes.find(t => t.id === typeId);
    if (!itemType) return;
    const { ok, rotation } = validateFit(itemType);
    if (!ok) return;

    const { x: cx, y: cy } = clampPosition(x, y, itemType.width, itemType.length, rotation);
    const newItem: PlacedItem = {
      id: crypto.randomUUID(),
      typeId,
      x: cx,
      y: cy,
      rotation,
      z: 9999,
    };
    setItems(prev => applyGravity([...prev, newItem], newItem.id, allItemTypes));
    clearFeedback();
  };

  const handleAddItem = (typeId: string) => {
    const itemType = allItemTypes.find(t => t.id === typeId);
    if (!itemType) return;
    const { ok, rotation } = validateFit(itemType);
    if (!ok) return;

    const cx = (selectedUnit.width * PIXELS_PER_METER) / 2;
    const cy = (selectedUnit.length * PIXELS_PER_METER) / 2;
    const { x, y } = clampPosition(cx, cy, itemType.width, itemType.length, rotation);

    const newItem: PlacedItem = {
      id: crypto.randomUUID(),
      typeId,
      x,
      y,
      rotation,
      z: 9999,
    };
    setItems(prev => applyGravity([...prev, newItem], newItem.id, allItemTypes));
    clearFeedback();
  };

  const handleItemMove = (id: string, x: number, y: number) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      const itemType = allItemTypes.find(t => t.id === item.typeId);
      if (!itemType) return prev;
      const { x: cx, y: cy } = clampPosition(x, y, itemType.width, itemType.length, item.rotation);
      return applyGravity(prev.map(i => (i.id === id ? { ...i, x: cx, y: cy } : i)), id, allItemTypes);
    });
    clearFeedback();
  };

  const handleItemRotate = (id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      const itemType = allItemTypes.find(t => t.id === item.typeId);
      if (!itemType) return prev;
      const newRotation = (item.rotation + 90) % 360;
      const isRotated = newRotation % 180 !== 0;
      const w = isRotated ? itemType.length : itemType.width;
      const h = isRotated ? itemType.width : itemType.length;
      if (w > selectedUnit.width || h > selectedUnit.length) {
        showToast(`"${itemType.name}" no cabe si se rota.`);
        return prev;
      }
      const { x: cx, y: cy } = clampPosition(item.x, item.y, itemType.width, itemType.length, newRotation);
      return applyGravity(
        prev.map(i => (i.id === id ? { ...i, rotation: newRotation, x: cx, y: cy } : i)),
        id,
        allItemTypes
      );
    });
    clearFeedback();
  };

  const handleItemDelete = (id: string) => {
    setItems(prev => applyGravity(prev.filter(item => item.id !== id), undefined, allItemTypes));
    clearFeedback();
  };

  const handleClearItems = () => {
    if (items.length === 0) return;
    setItems([]);
    clearFeedback();
    showToast('Bodega vaciada.');
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const itemDescriptions = items.map(item => {
        const type = allItemTypes.find(t => t.id === item.typeId);
        const stackedOnType = item.stackedOn
          ? allItemTypes.find(t => t.id === items.find(i => i.id === item.stackedOn)?.typeId)?.name
          : 'el piso';
        return {
          typeName: type?.name ?? item.typeId,
          z: item.z ?? 0,
          stackedOnName: stackedOnType ?? 'el piso',
          stackingError: item.stackingError ?? false,
        };
      });

      const res = await fetch('/api/calculadora-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemDescriptions,
          unit: { width: selectedUnit.width, length: selectedUnit.length, height: selectedUnit.height },
        }),
      });

      const data = await res.json();
      setAiAnalysis({
        summary: data.summary ?? 'No se pudo generar un análisis.',
        canOptimize: data.canOptimize ?? false,
        itemsToRemove: data.itemsToRemove ?? [],
      });
    } catch {
      setAiAnalysis({
        summary: 'Ocurrió un error al analizar. Intenta de nuevo.',
        canOptimize: false,
        itemsToRemove: [],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAutoArrange = async () => {
    setIsArranging(true);
    clearFeedback();
    try {
      // Build item descriptions for the AI
      const itemInputs = items.map(item => {
        const type = allItemTypes.find(t => t.id === item.typeId);
        return {
          id: item.id,
          typeId: item.typeId,
          typeName: type?.name ?? item.typeId,
          width: type?.width ?? 0.5,
          length: type?.length ?? 0.5,
          height: type?.height ?? 0.5,
        };
      });

      const res = await fetch('/api/calculadora-arrange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemInputs,
          unit: { width: selectedUnit.width, length: selectedUnit.length, height: selectedUnit.height },
        }),
      });

      const data = await res.json();

      if (!data.placements || data.placements.length === 0) {
        showToast('La IA no pudo generar un acomodo. Intenta de nuevo.');
        return;
      }

      // Map AI placements back to PlacedItem format
      const arranged: PlacedItem[] = [];
      const overflowItems: PlacedItem[] = [];
      const overflowIds = new Set<string>(data.overflow ?? []);

      for (const item of items) {
        if (overflowIds.has(item.id)) {
          overflowItems.push(item);
          continue;
        }

        const placement = data.placements.find((p: { id: string }) => p.id === item.id);
        if (!placement) {
          overflowItems.push(item);
          continue;
        }

        arranged.push({
          ...item,
          x: placement.x * PIXELS_PER_METER,
          y: placement.y * PIXELS_PER_METER,
          z: placement.z ?? 0,
          rotation: placement.rotation ?? 0,
          stackedOn: placement.stackedOnId ?? undefined,
          stackingError: false,
        });
      }

      setItems(arranged);
      setHasArranged(true);

      if (overflowItems.length > 0) {
        const overflowNames = overflowItems.map(item => {
          const type = allItemTypes.find(t => t.id === item.typeId);
          return type?.name ?? item.typeId;
        });
        setOverflowInfo({ items: overflowItems, names: overflowNames });
        setAiAnalysis({
          summary: data.summary ?? `Se acomodaron ${arranged.length} objetos. ${overflowItems.length} no cupieron.`,
          canOptimize: false,
          itemsToRemove: [],
        });
      } else {
        setOverflowInfo(null);
        setAiAnalysis({
          summary: data.summary ?? `Se acomodaron ${arranged.length} objetos con IA.`,
          canOptimize: false,
          itemsToRemove: [],
        });
      }
    } catch {
      showToast('Error al conectar con la IA. Intenta de nuevo.');
    } finally {
      setIsArranging(false);
    }
  };

  const handleRemoveOverflow = () => {
    setOverflowInfo(null);
    setAiAnalysis({
      summary: 'Objetos eliminados. Tu bodega está optimizada.',
      canOptimize: false,
      itemsToRemove: [],
    });
  };

  const handleKeepOverflow = () => {
    if (!overflowInfo) return;
    const centerX = (selectedUnit.width * PIXELS_PER_METER) / 2;
    const centerY = (selectedUnit.length * PIXELS_PER_METER) / 2;
    const restored = overflowInfo.items.map(item => ({
      ...item,
      x: centerX,
      y: centerY,
      z: 9999,
    }));
    setItems(prev => applyGravity([...prev, ...restored], undefined, allItemTypes));
    setOverflowInfo(null);
    setAiAnalysis({
      summary: 'Objetos restaurados. Algunos no caben — considera quitar algo o usar una bodega más grande.',
      canOptimize: false,
      itemsToRemove: [],
    });
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-5rem)] bg-slate-50 text-slate-900 overflow-hidden lg:overflow-hidden">
      {/* Toast notification */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      {/* Mobile tabs */}
      <div className="flex lg:hidden bg-white border-b border-slate-200 shrink-0 z-20 shadow-sm">
        {(['bodega', 'objetos', 'resumen'] as const).map(tab => (
          <button
            key={tab}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
              mobileTab === tab
                ? 'border-brand-red text-brand-red'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => setMobileTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">
        <main className="order-1 lg:order-2 flex-none lg:flex-1 p-2 lg:p-4 h-[40vh] min-h-[250px] lg:h-auto bg-slate-50 border-b border-slate-200 lg:border-none overflow-hidden">
          <CanvasArea
            unit={selectedUnit}
            items={items}
            allItemTypes={allItemTypes}
            onItemMove={handleItemMove}
            onItemRotate={handleItemRotate}
            onItemDelete={handleItemDelete}
            onDropItem={handleDropItem}
          />
        </main>

        <Sidebar
          selectedBranch={selectedBranch}
          selectedUnit={selectedUnit}
          customItems={customItems}
          onSelectBranch={handleSelectBranch}
          onSelectUnit={handleSelectUnit}
          onAddItem={handleAddItem}
          onAddCustomItem={handleAddCustomItem}
          onDeleteCustomItem={handleDeleteCustomItem}
          mobileTab={mobileTab}
        />

        <StatsPanel
          unit={selectedUnit}
          items={items}
          allItemTypes={allItemTypes}
          onClear={handleClearItems}
          onItemDelete={handleItemDelete}
          onAnalyze={handleAnalyze}
          onAutoArrange={handleAutoArrange}
          onRemoveOverflow={handleRemoveOverflow}
          onKeepOverflow={handleKeepOverflow}
          isAnalyzing={isAnalyzing}
          isArranging={isArranging}
          hasArranged={hasArranged}
          aiAnalysis={aiAnalysis}
          overflowInfo={overflowInfo}
          mobileTab={mobileTab}
        />
      </div>
    </div>
  );
}
