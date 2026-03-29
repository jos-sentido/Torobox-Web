'use client';

import { useState } from 'react';
import type { ComponentType } from 'react';
import { Branch, Unit, ItemType } from './types';
import { BRANCHES, ITEM_TYPES } from './constants';
import { SUCURSALES } from '@/data/sucursales';

const BRANCH_ID_MAP: Record<string, string> = { vallarta: 'vallarta' };

const fmt = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

function getBodegaPrecio(branchId: string, unitId: string): string | null {
  const sucursalDataId = BRANCH_ID_MAP[branchId] || branchId;
  const sucursal = SUCURSALES.find(s => s.id === sucursalDataId);
  if (!sucursal) return null;
  // unitId is like 'v-7', 'ps-10', 'b-oficina' — extract bodega id after the prefix
  const bodegaId = unitId.replace(/^[a-z]+-/, '');
  const bodega = sucursal.bodegas.find(b => b.id === bodegaId);
  if (!bodega) return null;
  const precios = Object.values(bodega.precios).filter(Boolean) as number[];
  if (precios.length === 0) return null;
  const min = Math.min(...precios);
  return `Desde ${fmt(min)}/mes`;
}
import {
  PiPlusDuotone,
  PiTrashDuotone,
  PiCaretDownDuotone,
  PiCaretUpDuotone,
  PiPencilLineDuotone,
  PiCubeDuotone,
  PiPackageDuotone,
  PiCouchDuotone,
  PiArmchairDuotone,
  PiTableDuotone,
  PiArchiveDuotone,
  PiBicycleDuotone,
  PiLockersDuotone,
  PiBedDuotone,
} from 'react-icons/pi';
import type { IconBaseProps } from 'react-icons';

// Map iconName strings from constants to Phosphor Duotone components
const ICON_MAP: Record<string, ComponentType<IconBaseProps>> = {
  Package: PiPackageDuotone,
  Couch: PiCouchDuotone,
  Armchair: PiArmchairDuotone,
  Table: PiTableDuotone,
  Archive: PiArchiveDuotone,
  Bicycle: PiBicycleDuotone,
  Lockers: PiLockersDuotone,
  Bed: PiBedDuotone,
};

const CUSTOM_COLORS = [
  '#fb923c', '#a3e635', '#22d3ee', '#e879f9',
  '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f97316',
];

interface SidebarProps {
  selectedBranch: Branch;
  selectedUnit: Unit;
  customItems: ItemType[];
  onSelectBranch: (branch: Branch) => void;
  onSelectUnit: (unit: Unit) => void;
  onAddItem: (typeId: string) => void;
  onAddCustomItem: (item: ItemType) => void;
  onDeleteCustomItem: (id: string) => void;
  mobileTab?: 'bodega' | 'objetos' | 'resumen';
}

export default function Sidebar({
  selectedBranch,
  selectedUnit,
  customItems,
  onSelectBranch,
  onSelectUnit,
  onAddItem,
  onAddCustomItem,
  onDeleteCustomItem,
  mobileTab,
}: SidebarProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');
  const [error, setError] = useState('');

  const handleDragStart = (e: React.DragEvent, itemType: ItemType) => {
    e.dataTransfer.setData('itemTypeId', itemType.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const w = parseFloat(width);
    const l = parseFloat(length);
    const h = parseFloat(height);
    const trimmedName = name.trim();

    if (!trimmedName) { setError('El nombre es requerido.'); return; }
    if (isNaN(w) || w <= 0 || w > 10) { setError('Ancho: valor entre 0.1 y 10 m.'); return; }
    if (isNaN(l) || l <= 0 || l > 10) { setError('Largo: valor entre 0.1 y 10 m.'); return; }
    if (isNaN(h) || h <= 0 || h > 5) { setError('Alto: valor entre 0.1 y 5 m.'); return; }

    const color = CUSTOM_COLORS[customItems.length % CUSTOM_COLORS.length];
    const newItem: ItemType = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: trimmedName,
      width: w,
      length: l,
      height: h,
      color,
    };

    onAddCustomItem(newItem);
    setName('');
    setWidth('');
    setLength('');
    setHeight('');
    setShowForm(false);
  };

  return (
    <div
      className={`order-2 lg:order-1 w-full lg:w-72 xl:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex-col overflow-y-auto shrink-0 pb-4 lg:pb-0 ${
        mobileTab === 'resumen' ? 'hidden lg:flex' : 'flex'
      }`}
    >
      {/* Branch selector */}
      <div className={`p-4 lg:p-5 border-b border-slate-200 shrink-0 ${mobileTab === 'objetos' ? 'hidden lg:block' : 'block'}`}>
        <h2 className="text-sm lg:text-base font-bold text-slate-900 mb-3">1. Selecciona tu Sucursal</h2>
        <select
          value={selectedBranch.id}
          onChange={e => {
            const branch = BRANCHES.find(b => b.id === e.target.value);
            if (branch) onSelectBranch(branch);
          }}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {BRANCHES.map(branch => (
            <option key={branch.id} value={branch.id}>{branch.name}</option>
          ))}
        </select>
      </div>

      {/* Unit selector */}
      <div className={`p-4 lg:p-5 border-b border-slate-200 shrink-0 ${mobileTab === 'objetos' ? 'hidden lg:block' : 'block'}`}>
        <h2 className="text-sm lg:text-base font-bold text-slate-900 mb-3">2. Selecciona tu Bodega</h2>
        <div className="flex overflow-x-auto lg:flex-col gap-2 pb-1 lg:pb-0 snap-x">
          {selectedBranch.units.map(unit => {
            const precio = getBodegaPrecio(selectedBranch.id, unit.id);
            return (
              <button
                key={unit.id}
                onClick={() => onSelectUnit(unit)}
                className={`min-w-[160px] lg:w-full text-left px-3 py-2.5 rounded-xl border-2 transition-all snap-start shrink-0 ${
                  selectedUnit.id === unit.id
                    ? 'border-brand-red bg-red-50 text-red-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs lg:text-sm">{unit.name}</span>
                  {precio && (
                    <span className={`text-[10px] font-bold whitespace-nowrap ${
                      selectedUnit.id === unit.id ? 'text-brand-red' : 'text-slate-400'
                    }`}>{precio}</span>
                  )}
                </div>
                <div className="text-[10px] lg:text-xs opacity-70 mt-1 flex gap-2 flex-wrap">
                  <span>Fondo {unit.width}m</span>
                  <span>Frente {unit.length}m</span>
                  <span>Alto {unit.height}m</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Item palette */}
      <div className={`p-4 lg:p-5 flex-1 ${mobileTab === 'bodega' ? 'hidden lg:block' : 'block'}`}>
        <h2 className="text-sm lg:text-base font-bold text-slate-900 mb-1">3. Añade tus Objetos</h2>
        <p className="text-xs text-slate-500 mb-3">Toca o arrastra hacia la bodega.</p>

        {/* Predefined items */}
        <div className="grid grid-cols-3 lg:grid-cols-2 gap-2 mb-4">
          {ITEM_TYPES.map(item => {
            const Icon = (item.iconName && ICON_MAP[item.iconName]) || PiCubeDuotone;
            return (
              <div
                key={item.id}
                draggable
                onDragStart={e => handleDragStart(e, item)}
                onClick={() => onAddItem(item.id)}
                className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors active:scale-95"
                style={{ borderLeftColor: item.color, borderLeftWidth: 4 }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mb-1 text-white shadow-sm"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon size={14} />
                </div>
                <span className="text-[10px] font-medium text-slate-700 text-center leading-tight">{item.name}</span>
                <span className="text-[9px] text-slate-400 mt-0.5">{item.width}×{item.length}m</span>
              </div>
            );
          })}
        </div>

        {/* Custom items */}
        {customItems.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Personalizados</p>
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
              {customItems.map(item => (
                <div
                  key={item.id}
                  className="relative flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors active:scale-95 group"
                  style={{ borderLeftColor: item.color, borderLeftWidth: 4 }}
                  draggable
                  onDragStart={e => handleDragStart(e, item)}
                  onClick={() => onAddItem(item.id)}
                >
                  {/* Delete button */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteCustomItem(item.id);
                    }}
                    className="absolute top-1 right-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar objeto"
                  >
                    <PiTrashDuotone size={11} />
                  </button>

                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mb-1 text-white shadow-sm"
                    style={{ backgroundColor: item.color }}
                  >
                    <PiPencilLineDuotone size={14} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-700 text-center leading-tight line-clamp-2">{item.name}</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">{item.width}×{item.length}m</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add custom item form */}
        <div className="border border-dashed border-slate-300 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowForm(v => !v)}
            className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <PiPlusDuotone size={14} className="text-brand-red" />
              Crear objeto personalizado
            </span>
            {showForm ? <PiCaretUpDuotone size={14} /> : <PiCaretDownDuotone size={14} />}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="px-3 pb-3 pt-1 space-y-2 bg-slate-50">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ej: Caja de ropa"
                  maxLength={30}
                  className="w-full px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                  Dimensiones (metros)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Ancho', value: width, set: setWidth, placeholder: '0.0' },
                    { label: 'Largo', value: length, set: setLength, placeholder: '0.0' },
                    { label: 'Alto', value: height, set: setHeight, placeholder: '0.0' },
                  ].map(({ label, value, set, placeholder }) => (
                    <div key={label}>
                      <label className="text-[9px] text-slate-400 block mb-0.5">{label}</label>
                      <input
                        type="number"
                        value={value}
                        onChange={e => set(e.target.value)}
                        placeholder={placeholder}
                        step="0.1"
                        min="0.1"
                        max={label === 'Alto' ? '5' : '10'}
                        className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-[10px] text-red-600 font-medium">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-lg transition-colors"
              >
                Agregar objeto
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
