'use client';

import { Unit, PlacedItem, ItemType } from './types';
import { ITEM_TYPES } from './constants';
import { AlertTriangle, CheckCircle2, Trash2, Layers, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface StatsPanelProps {
  unit: Unit;
  items: PlacedItem[];
  allItemTypes?: ItemType[];
  onClear: () => void;
  onItemDelete: (id: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  aiFeedback: string | null;
  mobileTab?: 'bodega' | 'objetos' | 'resumen';
}

export default function StatsPanel({
  unit,
  items,
  allItemTypes = ITEM_TYPES,
  onClear,
  onItemDelete,
  onAnalyze,
  isAnalyzing,
  aiFeedback,
  mobileTab,
}: StatsPanelProps) {
  const unitArea = unit.width * unit.length;
  const unitVolume = unitArea * unit.height;

  let usedArea = 0;
  let usedVolume = 0;
  let maxHeight = 0;

  items.forEach(item => {
    const type = allItemTypes.find(t => t.id === item.typeId);
    if (type) {
      const itemArea = type.width * type.length;
      usedArea += itemArea;
      usedVolume += itemArea * type.height;
      const top = (item.z || 0) + type.height;
      if (top > maxHeight) maxHeight = top;
    }
  });

  const volumePercentage = Math.min(100, Math.round((usedVolume / unitVolume) * 100));
  const heightPercentage = Math.min(100, Math.round((maxHeight / unit.height) * 100));
  const areaPercentage = Math.min(100, Math.round((usedArea / unitArea) * 100));

  const isOverHeight = maxHeight > unit.height;
  const isOverVolume = usedVolume > unitVolume;
  const isStacking = usedArea > unitArea;
  const hasStackingError = items.some(item => item.stackingError);

  return (
    <div
      className={`order-3 w-full lg:w-72 xl:w-80 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex-col overflow-y-auto shrink-0 ${
        mobileTab !== 'resumen' ? 'hidden lg:flex' : 'flex'
      }`}
    >
      {/* Metrics */}
      <div className="p-4 lg:p-5 border-b border-slate-200 shrink-0">
        <h2 className="text-sm lg:text-base font-bold text-slate-900 mb-4">Resumen de Espacio</h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700">Volumen Usado</span>
              <span className={`font-bold ${isOverVolume ? 'text-red-600' : 'text-slate-900'}`}>
                {usedVolume.toFixed(1)} / {unitVolume.toFixed(1)} m³
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${isOverVolume ? 'bg-red-500' : 'bg-emerald-500'}`}
                style={{ width: `${volumePercentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700">Altura Máxima</span>
              <span className={`font-bold ${isOverHeight ? 'text-red-600' : 'text-slate-900'}`}>
                {maxHeight.toFixed(1)} / {unit.height.toFixed(1)} m
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${isOverHeight ? 'bg-red-500' : 'bg-purple-500'}`}
                style={{ width: `${heightPercentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700">Área Total (objetos)</span>
              <span className={`font-bold ${isStacking ? 'text-blue-600' : 'text-slate-900'}`}>
                {usedArea.toFixed(1)} / {unitArea.toFixed(1)} m²
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${isStacking ? 'bg-blue-500' : 'bg-blue-400'}`}
                style={{ width: `${areaPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          {hasStackingError ? (
            <div className="flex items-start gap-2 p-3 bg-red-50 text-red-800 rounded-lg border border-red-200">
              <AlertTriangle className="shrink-0 mt-0.5" size={15} />
              <div className="text-xs">
                <p className="font-bold">¡Apilamiento Inválido!</p>
                <p className="mt-0.5 opacity-90">Revisa los objetos marcados en rojo.</p>
              </div>
            </div>
          ) : isOverHeight ? (
            <div className="flex items-start gap-2 p-3 bg-red-50 text-red-800 rounded-lg border border-red-200">
              <AlertTriangle className="shrink-0 mt-0.5" size={15} />
              <div className="text-xs">
                <p className="font-bold">¡Altura Excedida!</p>
                <p className="mt-0.5 opacity-90">Los objetos superan el techo ({unit.height}m).</p>
              </div>
            </div>
          ) : isOverVolume ? (
            <div className="flex items-start gap-2 p-3 bg-red-50 text-red-800 rounded-lg border border-red-200">
              <AlertTriangle className="shrink-0 mt-0.5" size={15} />
              <div className="text-xs">
                <p className="font-bold">¡Capacidad Excedida!</p>
                <p className="mt-0.5 opacity-90">Necesitas una bodega más grande.</p>
              </div>
            </div>
          ) : isStacking ? (
            <div className="flex items-start gap-2 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
              <Layers className="shrink-0 mt-0.5" size={15} />
              <div className="text-xs">
                <p className="font-bold">Apilamiento Activo</p>
                <p className="mt-0.5 opacity-90">Aprovechando el espacio vertical.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
              <CheckCircle2 className="shrink-0 mt-0.5" size={15} />
              <div className="text-xs">
                <p className="font-bold">¡Todo Cabe Perfecto!</p>
                <p className="mt-0.5 opacity-90">Tienes suficiente espacio en el piso.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Item list + actions */}
      <div className="p-4 lg:p-5 flex-1 flex flex-col min-h-0">
        <h3 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
          Objetos en Bodega ({items.length})
        </h3>

        <div className="flex-1 overflow-y-auto space-y-1.5 mb-4 min-h-0 max-h-48 lg:max-h-none">
          {items.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-6">La bodega está vacía</p>
          ) : (
            [...items].sort((a, b) => (b.z || 0) - (a.z || 0)).map(item => {
              const type = allItemTypes.find(t => t.id === item.typeId);
              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100 group"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {type && (
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: type.color }}
                      />
                    )}
                    <span className="text-xs font-medium text-slate-700 truncate">{type?.name}</span>
                    {(item.z || 0) > 0 && (
                      <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold shrink-0">
                        ↑ {(item.z || 0).toFixed(1)}m
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onItemDelete(item.id)}
                    className="text-slate-400 hover:text-red-500 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity p-1 shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <button
          onClick={onClear}
          disabled={items.length === 0}
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2 text-sm"
        >
          Vaciar Bodega
        </button>

        <button
          onClick={onAnalyze}
          disabled={items.length === 0 || isAnalyzing}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {isAnalyzing ? (
            <><Loader2 size={15} className="animate-spin" />Analizando...</>
          ) : (
            <><Sparkles size={15} />Analizar con IA</>
          )}
        </button>

        {aiFeedback && (
          <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900">
            <div className="flex items-center gap-1.5 font-bold mb-2 text-indigo-700 text-xs">
              <Sparkles size={13} />
              Análisis de IA
            </div>
            <div className="text-xs leading-relaxed [&_p]:mb-2 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-4">
              <ReactMarkdown>{aiFeedback}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
