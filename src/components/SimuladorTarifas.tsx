'use client';

import { useState, useMemo } from 'react';
import { SUCURSALES, PLAZOS } from '@/data/sucursales';
import type { Sucursal, Bodega, Piso } from '@/data/sucursales';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 });

const selectClass =
  'w-full border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-shadow shadow-sm';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface SeleccionSimulador {
  sucursalId: string;
  sucursalNombre: string;
  bodegaId: string;
  bodegaLabel: string;
  pisoId: Piso;
  pisoLabel: string;
  plazoId: string;
  plazoLabel: string;
  precioBase: number;
  precioMensual: number;
  descuento: number;
}

interface SimuladorTarifasProps {
  onSolicitar?: (data: SeleccionSimulador) => void;
  initialSucursalId?: string;
  initialBodegaId?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SimuladorTarifas({ onSolicitar, initialSucursalId = '', initialBodegaId = '' }: SimuladorTarifasProps = {}) {
  const [sucursalId, setSucursalId] = useState(initialSucursalId);
  const [bodegaId, setBodegaId]     = useState(initialBodegaId);
  const [piso, setPiso]             = useState<Piso | ''>('');
  const [plazoId, setPlazoId]       = useState('mensual');

  // When a bodega is pre-selected without a sucursal, filter available sucursales
  const sucursalesDisponibles = useMemo(() => {
    if (!bodegaId) return SUCURSALES;
    return SUCURSALES.filter(s => s.bodegas.some(b => b.id === bodegaId));
  }, [bodegaId]);

  // Derived data
  const sucursal = SUCURSALES.find(s => s.id === sucursalId);
  const bodega   = sucursal?.bodegas.find(b => b.id === bodegaId);
  const plazo    = PLAZOS.find(p => p.id === plazoId)!;

  // Descuento: viene de la bodega según el plazo seleccionado
  const descuento = useMemo(() => {
    if (!bodega?.descuentos) return 0;
    return bodega.descuentos[plazoId] ?? 0;
  }, [bodega, plazoId]);

  // Plazos disponibles: solo muestra plazos con descuento si la bodega los tiene
  const plazosDisponibles = useMemo(() => {
    if (!bodega) return PLAZOS;
    if (!bodega.descuentos) return PLAZOS.filter(p => p.id === 'mensual');
    return PLAZOS.filter(p => p.id === 'mensual' || bodega.descuentos![p.id] !== undefined);
  }, [bodega]);

  const pisosDisponibles = useMemo<Piso[]>(() => {
    if (!bodega) return [];
    return (Object.keys(bodega.precios) as Piso[]).filter(k => bodega.precios[k] !== undefined);
  }, [bodega]);

  // Auto-select piso when only one is available
  const pisoEfectivo: Piso | '' = useMemo(() => {
    if (pisosDisponibles.length === 1) return pisosDisponibles[0];
    return piso;
  }, [pisosDisponibles, piso]);

  const precioBase: number | null = useMemo(() => {
    if (!bodega || !pisoEfectivo) return null;
    return bodega.precios[pisoEfectivo] ?? null;
  }, [bodega, pisoEfectivo]);

  const precioMensualConDescuento = precioBase !== null
    ? Math.round(precioBase * (1 - descuento) * 100) / 100
    : null;

  const totalPeriodo = precioMensualConDescuento !== null
    ? precioMensualConDescuento * plazo.meses
    : null;

  const ahorroTotal = (precioBase !== null && descuento > 0 && totalPeriodo !== null)
    ? precioBase * plazo.meses - totalPeriodo
    : null;

  const ahorroMensual = (precioBase !== null && descuento > 0 && precioMensualConDescuento !== null)
    ? precioBase - precioMensualConDescuento
    : null;

  const isAnual = plazoId === 'anualidad';

  const isComplete = precioBase !== null && precioMensualConDescuento !== null;

  // Reset bodega when branch changes (but keep pre-filled bodega if it exists in the new branch)
  const handleSucursal = (id: string) => {
    setSucursalId(id);
    const newSucursal = SUCURSALES.find(s => s.id === id);
    if (!newSucursal?.bodegas.some(b => b.id === bodegaId)) {
      setBodegaId('');
    }
    setPiso('');
    setPlazoId('mensual');
  };

  // Reset piso when bodega changes
  const handleBodega = (id: string) => {
    setBodegaId(id);
    setPiso('');
    setPlazoId('mensual');
  };

  const handleSolicitarClick = () => {
    if (onSolicitar && isComplete && pisoEfectivo) {
      onSolicitar({
        sucursalId,
        sucursalNombre: sucursal!.nombre,
        bodegaId,
        bodegaLabel: bodega!.label,
        pisoId: pisoEfectivo,
        pisoLabel: pisoEfectivo === 'alta' ? 'Planta Alta' : 'Planta Baja',
        plazoId,
        plazoLabel: plazo.label,
        precioBase: precioBase!,
        precioMensual: precioMensualConDescuento!,
        descuento,
      });
    } else {
      document.getElementById('formulario-contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="bg-brand-black py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-brand-red font-bold uppercase tracking-wider text-xs mb-2 block">Herramienta interactiva</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Simula el costo de tu bodega</h2>
          <p className="text-gray-400 mt-2 text-sm">Selecciona sucursal, tamaño, planta y plazo para ver tu presupuesto al instante.</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">

            {/* ── Selectores ── */}
            <div className="p-6 sm:p-8 space-y-5">
              <h3 className="text-white font-bold text-base mb-1">Configura tu bodega</h3>

              {/* Sucursal */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Sucursal
                </label>
                <select value={sucursalId} onChange={e => handleSucursal(e.target.value)} className={selectClass}>
                  <option value="">Selecciona una sucursal</option>
                  {sucursalesDisponibles.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Tamaño */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Tamaño de bodega
                </label>
                <select
                  value={bodegaId}
                  onChange={e => handleBodega(e.target.value)}
                  disabled={!sucursal && !bodegaId}
                  className={`${selectClass} disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <option value="">
                    {sucursal ? 'Selecciona un tamaño' : 'Primero elige una sucursal'}
                  </option>
                  {sucursal
                    ? sucursal.bodegas.map(b => {
                        const desde = Math.min(...Object.values(b.precios).filter(Boolean) as number[]);
                        return (
                          <option key={b.id} value={b.id}>
                            {b.label} — desde {fmt(desde)}/mes
                          </option>
                        );
                      })
                    : bodegaId && (() => {
                        // Show pre-filled bodega label when no sucursal is selected yet
                        const anyBodega = SUCURSALES.flatMap(s => s.bodegas).find(b => b.id === bodegaId);
                        return anyBodega ? <option value={anyBodega.id}>{anyBodega.label}</option> : null;
                      })()
                  }
                </select>
              </div>

              {/* Planta (solo si hay ambas opciones) */}
              {bodega && pisosDisponibles.length > 1 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Planta
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {pisosDisponibles.map(p => (
                      <button
                        key={p}
                        onClick={() => setPiso(p)}
                        className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                          pisoEfectivo === p
                            ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                        }`}
                      >
                        <span className="block text-base mb-0.5">{p === 'alta' ? '🔺' : '🔻'}</span>
                        Planta {p === 'alta' ? 'Alta' : 'Baja'}
                        <span className="block text-xs font-normal mt-0.5 opacity-80">
                          {fmt(bodega.precios[p]!)}/mes
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Plazo */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Plazo de contrato
                </label>
                <div className={`grid gap-2 ${plazosDisponibles.length <= 1 ? 'grid-cols-1' : plazosDisponibles.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
                  {plazosDisponibles.map(p => {
                    const pDescuento = bodega?.descuentos?.[p.id] ?? 0;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPlazoId(p.id)}
                        className={`relative py-3 px-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                          plazoId === p.id
                            ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                        }`}
                      >
                        {p.id === 'anualidad' && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white text-brand-black text-[8px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap leading-none">
                            Mejor ahorro
                          </span>
                        )}
                        <span className="block font-bold text-sm mt-1">{p.label}</span>
                        {pDescuento > 0 ? (
                          <span className={`block text-[10px] mt-0.5 font-bold ${plazoId === p.id ? 'text-white/90' : 'text-emerald-400'}`}>
                            {Math.round(pDescuento * 100)}% off
                          </span>
                        ) : (
                          <span className="block text-[10px] mt-0.5 opacity-60">estándar</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Resultado ── */}
            <div className="p-6 sm:p-8 flex flex-col">
              <h3 className="text-white font-bold text-base mb-5">Tu presupuesto estimado</h3>

              {!isComplete ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Selecciona sucursal, tamaño y planta<br/>para ver tu cotización.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col gap-4">

                  {/* Resumen selección */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-xs text-gray-400 space-y-1">
                    <p><span className="text-white font-semibold">Sucursal:</span> {sucursal?.nombre}</p>
                    <p><span className="text-white font-semibold">Bodega:</span> {bodega?.label}{bodega?.area ? ` — ${bodega.area} m²` : ''}</p>
                    <p><span className="text-white font-semibold">Planta:</span> {pisoEfectivo === 'alta' ? 'Planta Alta' : 'Planta Baja'}</p>
                    <p><span className="text-white font-semibold">Plazo:</span> {plazo.label}{descuento > 0 ? ` (${Math.round(descuento * 100)}% descuento)` : ''}</p>
                  </div>

                  {/* Precio */}
                  {isAnual ? (
                    /* Anualidad: solo pago total + ahorro */
                    <div className="bg-brand-red/10 border border-brand-red/30 rounded-xl p-5 text-center">
                      {descuento > 0 && (
                        <p className="text-xs text-gray-400 line-through mb-1">{fmt(precioBase! * plazo.meses)}</p>
                      )}
                      <p className="text-4xl font-black text-white">{fmt(totalPeriodo!)}</p>
                      <p className="text-xs text-gray-400 mt-1">*Pago anual único</p>
                    </div>
                  ) : (
                    /* Mensual / 3-6 / 7+: solo pago mensual */
                    <div className="bg-brand-red/10 border border-brand-red/30 rounded-xl p-5 text-center">
                      {descuento > 0 && (
                        <p className="text-xs text-gray-400 line-through mb-1">{fmt(precioBase!)}/mes</p>
                      )}
                      <p className="text-4xl font-black text-white">{fmt(precioMensualConDescuento!)}</p>
                      <p className="text-xs text-gray-400 mt-1">por mes</p>
                    </div>
                  )}

                  {/* Ahorro */}
                  <div className="space-y-2">
                    {isAnual && ahorroTotal !== null && ahorroTotal > 0 && (
                      <div className="flex justify-between items-center py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3">
                        <span className="text-sm text-emerald-400 font-semibold">Ahorras en total</span>
                        <span className="text-sm font-black text-emerald-400">{fmt(ahorroTotal)}</span>
                      </div>
                    )}
                    {!isAnual && ahorroMensual !== null && ahorroMensual > 0 && (
                      <div className="flex justify-between items-center py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3">
                        <span className="text-sm text-emerald-400 font-semibold">Ahorro sobre la mensualidad</span>
                        <span className="text-sm font-black text-emerald-400">{fmt(ahorroMensual)}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-gray-600 text-center leading-relaxed">
                    Precios en MXN, IVA no incluido. Sujeto a disponibilidad de unidad.
                    Cotización exacta al confirmar con un asesor.
                  </p>

                  <button
                    onClick={handleSolicitarClick}
                    className="mt-auto w-full bg-brand-red hover:bg-brand-red-hover text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-brand-red/20 flex items-center justify-center gap-2"
                  >
                    Solicitar esta cotización
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
