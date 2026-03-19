'use client';

import { useState, useMemo } from 'react';

// ─── Datos de precios reales (PDF Version T-40326) ───────────────────────────

type Piso = 'alta' | 'baja';

interface Bodega {
  id: string;
  label: string;
  area?: number;
  precios: Partial<Record<Piso, number>>;
}

interface Sucursal {
  id: string;
  nombre: string;
  bodegas: Bodega[];
}

const SUCURSALES: Sucursal[] = [
  {
    id: 'vallarta',
    nombre: 'Av. Vallarta',
    bodegas: [
      { id: '1.75', label: '1.75 m²', area: 1.75, precios: { alta: 900, baja: 750 } },
      { id: '3.5',  label: '3.5 m²',  area: 3.5,  precios: { baja: 1700 } },
      { id: '7',    label: '7 m²',    area: 7,    precios: { alta: 3150, baja: 2940 } },
      { id: '10',   label: '10 m²',   area: 10,   precios: { alta: 4050, baja: 3780 } },
      { id: '15',   label: '15 m²',   area: 15,   precios: { alta: 6750, baja: 6300 } },
      { id: '30',   label: '30 m²',   area: 30,   precios: { alta: 13500 } },
      { id: 'oficina', label: 'Bodega con Oficina', precios: { baja: 20416 } },
    ],
  },
  {
    id: 'zona-real',
    nombre: 'Zona Real',
    bodegas: [
      { id: '3.5',  label: '3.5 m²',  area: 3.5,  precios: { alta: 1800, baja: 1700 } },
      { id: '7',    label: '7 m²',    area: 7,    precios: { alta: 3150, baja: 2940 } },
      { id: '8',    label: '8 m²',    area: 8,    precios: { alta: 3600, baja: 3360 } },
      { id: '9',    label: '9 m²',    area: 9,    precios: { alta: 4050, baja: 3780 } },
      { id: '11',   label: '11 m²',   area: 11,   precios: { alta: 4950, baja: 4620 } },
      { id: '15',   label: '15 m²',   area: 15,   precios: { alta: 6750, baja: 6300 } },
      { id: '30',   label: '30 m²',   area: 30,   precios: { baja: 13500 } },
    ],
  },
  {
    id: 'punto-sur',
    nombre: 'Punto Sur',
    bodegas: [
      { id: '3.5',  label: '3.5 m²',  area: 3.5,  precios: { alta: 1700, baja: 1505 } },
      { id: '7',    label: '7 m²',    area: 7,    precios: { alta: 3150, baja: 2940 } },
      { id: '10',   label: '10 m²',   area: 10,   precios: { alta: 4050, baja: 3780 } },
      { id: '15',   label: '15 m²',   area: 15,   precios: { alta: 6750, baja: 6300 } },
      { id: '30',   label: '30 m²',   area: 30,   precios: { alta: 13500 } },
    ],
  },
  {
    id: 'bucerias',
    nombre: 'Bucerías',
    bodegas: [
      { id: '3.5',  label: '3.5 m²',  area: 3.5,  precios: { alta: 1700, baja: 1505 } },
      { id: '7',    label: '7 m²',    area: 7,    precios: { alta: 3150, baja: 2940 } },
      { id: '10',   label: '10 m²',   area: 10,   precios: { alta: 4050, baja: 3780 } },
      { id: '15',   label: '15 m²',   area: 15,   precios: { alta: 6750, baja: 6300 } },
      { id: '30',   label: '30 m²',   area: 30,   precios: { alta: 13500 } },
      { id: 'oficina', label: 'Bodega con Oficina', precios: { baja: 15000 } },
    ],
  },
];

const PLAZOS = [
  { id: 'mensual',   label: 'Mensual',   meses: 1,  descuento: 0,    badge: null },
  { id: '3-meses',  label: '3 Meses',   meses: 3,  descuento: 0.10, badge: '10% off' },
  { id: '12-meses', label: '12 Meses',  meses: 12, descuento: 0.15, badge: '15% off' },
] as const;

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
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SimuladorTarifas({ onSolicitar, initialSucursalId = '' }: SimuladorTarifasProps = {}) {
  const [sucursalId, setSucursalId] = useState(initialSucursalId);
  const [bodegaId, setBodegaId]     = useState('');
  const [piso, setPiso]             = useState<Piso | ''>('');
  const [plazoId, setPlazoId]       = useState('mensual');

  // Derived data
  const sucursal = SUCURSALES.find(s => s.id === sucursalId);
  const bodega   = sucursal?.bodegas.find(b => b.id === bodegaId);
  const plazo    = PLAZOS.find(p => p.id === plazoId)!;

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
    ? Math.round(precioBase * (1 - plazo.descuento) * 100) / 100
    : null;

  const totalPeriodo = precioMensualConDescuento !== null
    ? precioMensualConDescuento * plazo.meses
    : null;

  const ahorroTotal = (precioBase !== null && plazo.descuento > 0 && totalPeriodo !== null)
    ? precioBase * plazo.meses - totalPeriodo
    : null;

  const isComplete = precioBase !== null && precioMensualConDescuento !== null;

  // Reset bodega when branch changes
  const handleSucursal = (id: string) => {
    setSucursalId(id);
    setBodegaId('');
    setPiso('');
  };

  // Reset piso when bodega changes
  const handleBodega = (id: string) => {
    setBodegaId(id);
    setPiso('');
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
        descuento: plazo.descuento,
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
                  {SUCURSALES.map(s => (
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
                  disabled={!sucursal}
                  className={`${selectClass} disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <option value="">
                    {sucursal ? 'Selecciona un tamaño' : 'Primero elige una sucursal'}
                  </option>
                  {sucursal?.bodegas.map(b => {
                    const desde = Math.min(...Object.values(b.precios).filter(Boolean) as number[]);
                    return (
                      <option key={b.id} value={b.id}>
                        {b.label} — desde {fmt(desde)}/mes
                      </option>
                    );
                  })}
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
                <div className="grid grid-cols-3 gap-2">
                  {PLAZOS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setPlazoId(p.id)}
                      className={`relative py-3 px-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        plazoId === p.id
                          ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      {p.id === '3-meses' && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white text-brand-black text-[8px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap leading-none">
                          Popular
                        </span>
                      )}
                      <span className="block font-bold text-sm mt-1">{p.label}</span>
                      {p.badge ? (
                        <span className={`block text-[10px] mt-0.5 font-bold ${plazoId === p.id ? 'text-white/90' : 'text-emerald-400'}`}>
                          {p.badge}
                        </span>
                      ) : (
                        <span className="block text-[10px] mt-0.5 opacity-60">estándar</span>
                      )}
                    </button>
                  ))}
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
                    <p><span className="text-white font-semibold">Plazo:</span> {plazo.label}{plazo.descuento > 0 ? ` (${plazo.descuento * 100}% descuento)` : ''}</p>
                  </div>

                  {/* Precio mensual */}
                  <div className="bg-brand-red/10 border border-brand-red/30 rounded-xl p-5 text-center">
                    {plazo.descuento > 0 && (
                      <p className="text-xs text-gray-400 line-through mb-1">{fmt(precioBase!)}/mes</p>
                    )}
                    <p className="text-4xl font-black text-white">{fmt(precioMensualConDescuento!)}</p>
                    <p className="text-xs text-gray-400 mt-1">por mes</p>
                  </div>

                  {/* Desglose */}
                  <div className="space-y-2">
                    {plazo.meses > 1 && (
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-sm text-gray-400">Total {plazo.meses} meses</span>
                        <span className="text-sm font-bold text-white">{fmt(totalPeriodo!)}</span>
                      </div>
                    )}
                    {ahorroTotal !== null && ahorroTotal > 0 && (
                      <div className="flex justify-between items-center py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3">
                        <span className="text-sm text-emerald-400 font-semibold">🎉 Ahorras en total</span>
                        <span className="text-sm font-black text-emerald-400">{fmt(ahorroTotal)}</span>
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
