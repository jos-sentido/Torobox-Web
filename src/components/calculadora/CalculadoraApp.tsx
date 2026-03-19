'use client';

import { useState, useMemo } from 'react';
import { Unit, Branch, PlacedItem, ItemType } from './types';
import { BRANCHES, ITEM_TYPES, PIXELS_PER_METER } from './constants';
import Sidebar from './Sidebar';
import CanvasArea from './CanvasArea';
import StatsPanel from './StatsPanel';
import { applyGravity } from './utils';

export default function CalculadoraApp() {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES[0]);
  const [selectedUnit, setSelectedUnit] = useState<Unit>(BRANCHES[0].units[0]);
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [customItems, setCustomItems] = useState<ItemType[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'bodega' | 'objetos' | 'resumen'>('bodega');

  // Combined list: predefined + custom
  const allItemTypes = useMemo(() => [...ITEM_TYPES, ...customItems], [customItems]);

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setSelectedUnit(branch.units[0]);
    setItems([]);
    setAiFeedback(null);
  };

  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
    setItems([]);
    setAiFeedback(null);
  };

  const handleAddCustomItem = (item: ItemType) => {
    setCustomItems(prev => [...prev, item]);
  };

  const handleDeleteCustomItem = (id: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== id));
    // Also remove any placed instances of this custom item
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

  const handleDropItem = (typeId: string, x: number, y: number) => {
    const itemType = allItemTypes.find(t => t.id === typeId);
    if (!itemType) return;

    const itemMin = Math.min(itemType.width, itemType.length);
    const itemMax = Math.max(itemType.width, itemType.length);
    const unitMin = Math.min(selectedUnit.width, selectedUnit.length);
    const unitMax = Math.max(selectedUnit.width, selectedUnit.length);

    if (itemMin > unitMin || itemMax > unitMax || itemType.height > selectedUnit.height) {
      alert(`El objeto "${itemType.name}" es demasiado grande para esta bodega.`);
      return;
    }

    let initialRotation = 0;
    if (itemType.width > selectedUnit.width || itemType.length > selectedUnit.length) {
      initialRotation = 90;
    }

    const { x: cx, y: cy } = clampPosition(x, y, itemType.width, itemType.length, initialRotation);
    const newItem: PlacedItem = {
      id: Math.random().toString(36).substring(2, 9),
      typeId,
      x: cx,
      y: cy,
      rotation: initialRotation,
      z: 9999,
    };
    setItems(prev => applyGravity([...prev, newItem], newItem.id, allItemTypes));
    setAiFeedback(null);
  };

  const handleAddItem = (typeId: string) => {
    const itemType = allItemTypes.find(t => t.id === typeId);
    if (!itemType) return;

    const itemMin = Math.min(itemType.width, itemType.length);
    const itemMax = Math.max(itemType.width, itemType.length);
    const unitMin = Math.min(selectedUnit.width, selectedUnit.length);
    const unitMax = Math.max(selectedUnit.width, selectedUnit.length);

    if (itemMin > unitMin || itemMax > unitMax || itemType.height > selectedUnit.height) {
      alert(`El objeto "${itemType.name}" es demasiado grande para esta bodega.`);
      return;
    }

    let initialRotation = 0;
    if (itemType.width > selectedUnit.width || itemType.length > selectedUnit.length) {
      initialRotation = 90;
    }

    const cx = (selectedUnit.width * PIXELS_PER_METER) / 2;
    const cy = (selectedUnit.length * PIXELS_PER_METER) / 2;
    const { x, y } = clampPosition(cx, cy, itemType.width, itemType.length, initialRotation);

    const newItem: PlacedItem = {
      id: Math.random().toString(36).substring(2, 9),
      typeId,
      x,
      y,
      rotation: initialRotation,
      z: 9999,
    };
    setItems(prev => applyGravity([...prev, newItem], newItem.id, allItemTypes));
    setAiFeedback(null);
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
    setAiFeedback(null);
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
        alert(`El objeto "${itemType.name}" no cabe si se rota.`);
        return prev;
      }
      const { x: cx, y: cy } = clampPosition(item.x, item.y, itemType.width, itemType.length, newRotation);
      return applyGravity(
        prev.map(i => (i.id === id ? { ...i, rotation: newRotation, x: cx, y: cy } : i)),
        id,
        allItemTypes
      );
    });
    setAiFeedback(null);
  };

  const handleItemDelete = (id: string) => {
    setItems(prev => applyGravity(prev.filter(item => item.id !== id), undefined, allItemTypes));
    setAiFeedback(null);
  };

  const handleClearItems = () => {
    setItems([]);
    setAiFeedback(null);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAiFeedback(null);
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
      setAiFeedback(data.feedback ?? 'No se pudo generar un análisis.');
    } catch {
      setAiFeedback('Ocurrió un error al analizar. Intenta de nuevo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-5rem)] bg-slate-50 text-slate-900 overflow-hidden">
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

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Canvas */}
        <main className="order-1 lg:order-2 flex-none lg:flex-1 p-2 lg:p-4 h-[45vh] lg:h-auto bg-slate-50 border-b border-slate-200 lg:border-none overflow-hidden">
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
          isAnalyzing={isAnalyzing}
          aiFeedback={aiFeedback}
          mobileTab={mobileTab}
        />
      </div>
    </div>
  );
}
