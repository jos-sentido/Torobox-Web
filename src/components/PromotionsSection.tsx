'use client';

import { useState, useMemo } from 'react';
import Button from '@/components/Button';
import { SUCURSALES, PLAZOS } from '@/data/sucursales';
import type { Piso } from '@/data/sucursales';

const fmt = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

const selectClass =
  'border border-white/30 rounded-xl py-3 px-4 text-sm font-medium text-white bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-shadow shadow-sm appearance-none cursor-pointer';

const PLAZO_META: Record<string, { descripcion: string }> = {
  'mensual':     { descripcion: 'Flexibilidad total mes a mes.' },
  '3-6-meses':   { descripcion: 'Ahorra desde el tercer mes.' },
  '7-meses':     { descripcion: 'Mayor ahorro a mediano plazo.' },
  'anualidad':   { descripcion: 'El mayor descuento en tu renta.' },
};

export default function PromotionsSection() {
  const [sucursalId, setSucursalId] = useState('');
  const [bodegaId, setBodegaId] = useState('');
  const [piso, setPiso] = useState<Piso | ''>('');

  const sucursal = SUCURSALES.find(s => s.id === sucursalId);
  const bodega = sucursal?.bodegas.find(b => b.id === bodegaId);

  const pisosDisponibles = useMemo<Piso[]>(() => {
    if (!bodega) return [];
    return (Object.keys(bodega.precios) as Piso[]).filter(k => bodega.precios[k] !== undefined);
  }, [bodega]);

  const pisoEfectivo: Piso | '' = useMemo(() => {
    if (pisosDisponibles.length === 1) return pisosDisponibles[0];
    return piso;
  }, [pisosDisponibles, piso]);

  const precioBase = bodega && pisoEfectivo ? (bodega.precios[pisoEfectivo] ?? null) : null;

  const handleSucursal = (id: string) => {
    setSucursalId(id);
    setBodegaId('');
    setPiso('');
  };

  const handleBodega = (id: string) => {
    setBodegaId(id);
    setPiso('');
  };

  // Check if we have a complete selection with prices to show
  const showPrices = precioBase !== null && bodega;

  // Compute discount percentages progressively based on selection level
  const descuentosPorPlazo = useMemo(() => {
    const plazoIds = ['3-6-meses', '7-meses', 'anualidad'] as const;
    const result: Record<string, { value: number; isMax: boolean }> = {};
    const suc = SUCURSALES.find(s => s.id === sucursalId);
    const bod = suc?.bodegas.find(b => b.id === bodegaId);

    if (bod) {
      // Specific bodega selected → exact discounts
      for (const pid of plazoIds) {
        const d = bod.descuentos?.[pid] ?? 0;
        result[pid] = { value: d, isMax: false };
      }
    } else if (suc) {
      // Sucursal selected → max across its bodegas, with "Hasta"
      for (const pid of plazoIds) {
        let max = 0;
        for (const b of suc.bodegas) {
          const d = b.descuentos?.[pid] ?? 0;
          if (d > max) max = d;
        }
        result[pid] = { value: max, isMax: true };
      }
    } else {
      // Nothing selected → max across ALL sucursales
      for (const pid of plazoIds) {
        let max = 0;
        for (const s of SUCURSALES) {
          for (const b of s.bodegas) {
            const d = b.descuentos?.[pid] ?? 0;
            if (d > max) max = d;
          }
        }
        result[pid] = { value: max, isMax: true };
      }
    }

    return result;
  }, [sucursalId, bodegaId]);

  return (
    <section className="py-20 bg-brand-red relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-black">Ahorra más al contratar por plazo</h2>
          <p className="text-white/80 mt-3 text-base max-w-xl mx-auto">
            Selecciona una sucursal y tamaño para ver tu ahorro real en cada plazo.
          </p>
        </div>

        {/* Selectores */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            {/* Sucursal */}
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Sucursal</label>
              <select value={sucursalId} onChange={e => handleSucursal(e.target.value)} className={selectClass + ' w-full'}>
                <option value="" className="text-gray-800">Selecciona una sucursal</option>
                {SUCURSALES.map(s => (
                  <option key={s.id} value={s.id} className="text-gray-800">{s.nombre}</option>
                ))}
              </select>
            </div>

            {/* Bodega */}
            <div>
              <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Tamaño de bodega</label>
              <select
                value={bodegaId}
                onChange={e => handleBodega(e.target.value)}
                disabled={!sucursal}
                className={`${selectClass} w-full disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <option value="" className="text-gray-800">
                  {sucursal ? 'Selecciona un tamaño' : 'Primero elige sucursal'}
                </option>
                {sucursal?.bodegas.map(b => (
                  <option key={b.id} value={b.id} className="text-gray-800">{b.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Selector de planta si hay ambas */}
          {bodega && pisosDisponibles.length > 1 && (
            <div className="mt-3 flex gap-2 justify-center">
              {pisosDisponibles.map(p => (
                <button
                  key={p}
                  onClick={() => setPiso(p)}
                  className={`py-2 px-5 rounded-xl text-sm font-semibold transition-all ${
                    pisoEfectivo === p
                      ? 'bg-white text-brand-red shadow-lg'
                      : 'bg-white/15 text-white border border-white/30 hover:bg-white/25'
                  }`}
                >
                  Planta {p === 'alta' ? 'Alta' : 'Baja'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tarjetas de plazos */}
        {showPrices ? (
          /* Full selection: show prices, totals, savings */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch max-w-6xl mx-auto mb-12">
            {PLAZOS.map(plazo => {
              const descuento = bodega.descuentos?.[plazo.id] ?? 0;
              const precioMensual = Math.round(precioBase * (1 - descuento));
              const total = precioMensual * plazo.meses;
              const ahorro = (precioBase - precioMensual) * plazo.meses;
              const esMejor = plazo.id === 'anualidad' && descuento > 0;
              const sinDescuento = plazo.id !== 'mensual' && descuento === 0;

              if (sinDescuento) return null;

              return (
                <div
                  key={plazo.id}
                  className={`rounded-2xl p-6 text-center relative transition-transform duration-300 hover:scale-105 flex flex-col ${
                    esMejor
                      ? 'bg-white shadow-2xl lg:-translate-y-3 lg:scale-110 z-10'
                      : 'bg-white/15 backdrop-blur-sm border border-white/20'
                  }`}
                >
                  {esMejor && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-black text-white px-5 py-1 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap">
                      Mejor Ahorro
                    </div>
                  )}

                  <h3 className={`text-lg font-bold mb-1 ${esMejor ? 'text-brand-black mt-2' : 'text-brand-black'}`}>
                    {plazo.label}
                  </h3>

                  {descuento > 0 ? (
                    <>
                      <div className={`text-5xl font-black my-2 ${esMejor ? 'text-brand-red' : 'text-white'}`}>
                        {Math.round(descuento * 100)}%
                      </div>
                      <div className={`text-sm font-semibold mb-1 ${esMejor ? 'text-gray-800' : 'text-white'}`}>
                        {fmt(precioMensual)}<span className="text-xs font-normal opacity-70">/mes</span>
                      </div>
                      <div className={`text-xs mb-2 ${esMejor ? 'text-gray-500 line-through' : 'text-white/50 line-through'}`}>
                        {fmt(precioBase)}/mes
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`text-3xl font-black my-2 ${esMejor ? 'text-brand-red' : 'text-white'}`}>
                        {fmt(precioMensual)}
                      </div>
                      <div className={`text-xs mb-2 ${esMejor ? 'text-gray-500' : 'text-white/60'}`}>por mes</div>
                    </>
                  )}

                  <div className="mt-auto">
                    {plazo.meses > 1 && (
                      <div className={`text-xs font-medium mb-1 ${esMejor ? 'text-gray-600' : 'text-white/70'}`}>
                        Total {plazo.meses} meses: {fmt(total)}
                      </div>
                    )}
                    {ahorro > 0 && (
                      <div className={`text-xs font-bold ${esMejor ? 'text-emerald-600' : 'text-emerald-300'}`}>
                        Ahorras {fmt(ahorro)}
                      </div>
                    )}
                  </div>

                  <p className={`text-xs mt-3 ${esMejor ? 'text-gray-500' : 'text-white/60'}`}>
                    {PLAZO_META[plazo.id]?.descripcion}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          /* Progressive badges: update as user selects */
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto mb-12">
            {PLAZOS.map(plazo => {
              const info = descuentosPorPlazo[plazo.id];
              const desc = info?.value ?? 0;
              const isMax = info?.isMax ?? true;
              const esMejor = plazo.id === 'anualidad' && desc > 0;
              const noDisponible = plazo.id !== 'mensual' && desc === 0;

              if (noDisponible) return null;

              const displayValue = plazo.id === 'mensual'
                ? 'Estándar'
                : desc > 0
                  ? `${isMax ? 'Hasta ' : ''}${Math.round(desc * 100)}%`
                  : 'Estándar';

              return (
                <div
                  key={plazo.id}
                  className={`rounded-2xl text-center transition-transform duration-300 hover:scale-105 w-full sm:w-[calc(50%-12px)] lg:w-[250px] ${
                    esMejor
                      ? 'bg-white p-10 shadow-2xl relative transform lg:-translate-y-4 lg:scale-110 z-10'
                      : 'bg-white/15 backdrop-blur-sm p-8 border border-white/20'
                  }`}
                >
                  {esMejor && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-black text-white px-6 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase whitespace-nowrap">
                      Mejor Ahorro
                    </div>
                  )}
                  <h3 className={`text-xl font-bold mb-2 ${esMejor ? 'text-brand-black mt-2' : 'text-brand-black'}`}>
                    {plazo.label}
                  </h3>
                  <div className={`font-bold mb-4 ${
                    plazo.id === 'mensual'
                      ? 'text-4xl md:text-5xl text-white'
                      : esMejor
                        ? 'text-6xl text-brand-red'
                        : 'text-5xl md:text-6xl text-white'
                  }`}>
                    {displayValue}
                  </div>
                  <p className={esMejor ? 'text-gray-600 font-medium' : 'text-white/90'}>
                    {PLAZO_META[plazo.id]?.descripcion}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Button href="/contacto" variant="white" className="text-lg px-8 py-3.5 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all">
            Cotizar mi espacio
          </Button>
        </div>
      </div>
    </section>
  );
}
