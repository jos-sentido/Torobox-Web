'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import { Unit, PlacedItem, ItemType } from './types';
import { ITEM_TYPES, PIXELS_PER_METER } from './constants';

interface CanvasAreaProps {
  unit: Unit;
  items: PlacedItem[];
  allItemTypes?: ItemType[];
  onItemMove: (id: string, x: number, y: number) => void;
  onItemRotate: (id: string) => void;
  onItemDelete: (id: string) => void;
  onDropItem: (typeId: string, x: number, y: number) => void;
}

export default function CanvasArea({
  unit,
  items,
  allItemTypes = ITEM_TYPES,
  onItemMove,
  onItemRotate,
  onItemDelete,
  onDropItem,
}: CanvasAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const lastTapRef = useRef<{ id: string; time: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Double-tap detection for mobile rotate
  const handleTap = useCallback((id: string) => {
    const now = Date.now();
    const last = lastTapRef.current;
    if (last && last.id === id && now - last.time < 350) {
      // Double tap — rotate
      onItemRotate(id);
      lastTapRef.current = null;
    } else {
      lastTapRef.current = { id, time: now };
    }
  }, [onItemRotate]);

  const unitWidthPx = unit.width * PIXELS_PER_METER;
  const unitLengthPx = unit.length * PIXELS_PER_METER;

  const padding = 40;
  const scaleX = (dimensions.width - padding * 2) / unitWidthPx;
  const scaleY = (dimensions.height - padding * 2) / unitLengthPx;
  const scale = Math.min(1, Math.min(scaleX, scaleY));

  const offsetX = (dimensions.width / scale - unitWidthPx) / 2;
  const offsetY = (dimensions.height / scale - unitLengthPx) / 2;

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const typeId = e.dataTransfer.getData('itemTypeId');
    if (!typeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale - offsetX;
    const y = (e.clientY - rect.top) / scale - offsetY;
    onDropItem(typeId, x, y);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        scaleX={scale}
        scaleY={scale}
      >
        <Layer>
          {/* Unit floor */}
          <Rect
            x={offsetX}
            y={offsetY}
            width={unitWidthPx}
            height={unitLengthPx}
            fill="#ffffff"
            stroke="#94a3b8"
            strokeWidth={4 / scale}
            shadowColor="black"
            shadowBlur={10 / scale}
            shadowOpacity={0.1}
          />

          {/* Grid lines */}
          {Array.from({ length: Math.floor(unit.width * 2) + 1 }).map((_, i) => (
            <Rect
              key={`v-${i}`}
              x={offsetX + i * (PIXELS_PER_METER / 2)}
              y={offsetY}
              width={1 / scale}
              height={unitLengthPx}
              fill="#e2e8f0"
            />
          ))}
          {Array.from({ length: Math.floor(unit.length * 2) + 1 }).map((_, i) => (
            <Rect
              key={`h-${i}`}
              x={offsetX}
              y={offsetY + i * (PIXELS_PER_METER / 2)}
              width={unitWidthPx}
              height={1 / scale}
              fill="#e2e8f0"
            />
          ))}

          {/* Items */}
          {[...items].sort((a, b) => (a.z || 0) - (b.z || 0)).map(item => {
            const itemType = allItemTypes.find(t => t.id === item.typeId);
            if (!itemType) return null;

            const w = itemType.width * PIXELS_PER_METER;
            const h = itemType.length * PIXELS_PER_METER;
            const itemZ = item.z || 0;
            const isOverHeight = itemZ + itemType.height > unit.height;
            const hasError = isOverHeight || item.stackingError;

            // Adaptive font size: shrink for small items
            const minDim = Math.min(w, h);
            const nameFontSize = Math.max(8, Math.min(12, minDim / 4)) / scale;
            const zFontSize = Math.max(7, Math.min(11, minDim / 5)) / scale;

            return (
              <Group
                key={item.id}
                x={offsetX + item.x}
                y={offsetY + item.y}
                draggable
                rotation={item.rotation}
                offsetX={w / 2}
                offsetY={h / 2}
                onDragEnd={e => {
                  onItemMove(item.id, e.target.x() - offsetX, e.target.y() - offsetY);
                }}
                onDblClick={() => onItemRotate(item.id)}
                onDblTap={() => onItemRotate(item.id)}
                onContextMenu={e => {
                  e.evt.preventDefault();
                  onItemDelete(item.id);
                }}
                onTap={() => handleTap(item.id)}
              >
                <Rect
                  width={w}
                  height={h}
                  fill={hasError ? '#fca5a5' : itemType.color}
                  stroke={hasError ? '#dc2626' : '#1e293b'}
                  strokeWidth={(hasError ? 4 : 2) / scale}
                  cornerRadius={4 / scale}
                  shadowColor={hasError ? 'red' : 'black'}
                  shadowBlur={(5 + itemZ * 10) / scale}
                  shadowOpacity={0.2 + itemZ * 0.1}
                  shadowOffset={{ x: (2 + itemZ * 5) / scale, y: (2 + itemZ * 5) / scale }}
                />
                <Text
                  text={itemType.name}
                  width={w}
                  height={h}
                  align="center"
                  verticalAlign="middle"
                  fill="#ffffff"
                  fontSize={nameFontSize}
                  fontStyle="bold"
                  padding={4 / scale}
                  ellipsis={true}
                  wrap="none"
                />
                {itemZ > 0 && (
                  <Text
                    text={`↑ ${itemZ.toFixed(1)}m`}
                    x={0}
                    y={h - 20 / scale}
                    width={w}
                    align="center"
                    fill="#ffffff"
                    fontSize={zFontSize}
                    fontStyle="bold"
                    shadowColor="black"
                    shadowBlur={4 / scale}
                  />
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>

      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-xs font-medium text-slate-600 shadow-sm pointer-events-none">
        <span className="hidden lg:inline">Doble clic para rotar • Clic derecho para eliminar</span>
        <span className="inline lg:hidden">Doble toque para rotar • Elimina desde la lista</span>
      </div>
    </div>
  );
}
