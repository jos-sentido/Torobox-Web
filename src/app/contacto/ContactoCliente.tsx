'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import Button from '@/components/Button';
import SimuladorTarifas, { type SeleccionSimulador } from '@/components/SimuladorTarifas';
import { SUCURSALES } from '@/data/sucursales';
import type { Piso } from '@/data/sucursales';
import { useUtmCapture } from '@/hooks/useUtmCapture';

const fmt = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 });

export default function ContactoCliente({ initialSucursal = '', initialTamano = '' }: { initialSucursal?: string; initialTamano?: string }) {
  const formRef = useRef<HTMLDivElement>(null);
  const { getUtmData } = useUtmCapture();

  // Simulator pre-fill state
  const [preseleccion, setPreseleccion] = useState<SeleccionSimulador | null>(null);

  // Controlled form fields (those that can be pre-filled)
  const [sucursal, setSucursal] = useState(initialSucursal);
  const [tamano, setTamano] = useState(initialTamano || 'asesoria');
  const [piso, setPiso] = useState<Piso | ''>('');
  const [plazo, setPlazo] = useState('asesoria');

  // Form fields
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Validation errors
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Submission state
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');

  const handleSolicitar = (data: SeleccionSimulador) => {
    setPreseleccion(data);
    setSucursal(data.sucursalId);
    setTamano(data.bodegaId);
    setPiso(data.pisoId);
    setPlazo(data.plazoId);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const clearPreseleccion = () => setPreseleccion(null);

  const handleNombre = (value: string) => {
    // Only allow letters, spaces, accents, and common name characters
    const cleaned = value.replace(/[0-9]/g, '');
    setNombre(cleaned);
    if (errores.nombre) setErrores(prev => ({ ...prev, nombre: '' }));
  };

  const handleTelefono = (value: string) => {
    // Only allow digits, spaces, dashes, parentheses, and +
    const cleaned = value.replace(/[^0-9+\-() ]/g, '');
    setTelefono(cleaned);
    if (errores.telefono) setErrores(prev => ({ ...prev, telefono: '' }));
  };

  const handleCorreo = (value: string) => {
    setCorreo(value);
    if (errores.correo) setErrores(prev => ({ ...prev, correo: '' }));
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (nombreLimpio.length < 3) {
      nuevosErrores.nombre = 'Ingresa tu nombre completo';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]+$/.test(nombreLimpio)) {
      nuevosErrores.nombre = 'El nombre solo puede contener letras';
    }

    const telLimpio = telefono.replace(/[\s\-()]/g, '');
    if (!telLimpio) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    } else if (!/^\+?\d{7,15}$/.test(telLimpio)) {
      nuevosErrores.telefono = 'Ingresa un número de teléfono válido (7-15 dígitos)';
    }

    if (!correo.trim()) {
      nuevosErrores.correo = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      nuevosErrores.correo = 'Ingresa un correo electrónico válido';
    }

    if (!sucursal) {
      nuevosErrores.sucursal = 'Selecciona una sucursal';
    }

    if (!tamano) {
      nuevosErrores.tamano = 'Selecciona un tamaño de bodega';
    }

    if (!plazo) {
      nuevosErrores.plazo = 'Selecciona un plazo de contrato';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (enviando) return;
    if (!validarFormulario()) return;
    setEnviando(true);
    setErrorEnvio('');

    const sucursalNombre = SUCURSALES.find(s => s.id === sucursal)?.nombre || sucursal;
    const tamanoLabel = tamano === 'asesoria' ? 'Necesita asesoría' : (allTamanos.find(t => t.id === tamano)?.label || tamano);
    const plazoLabels: Record<string, string> = {
      'asesoria': 'Necesita asesoría',
      'mensual': 'Mensual',
      '3-6-meses': '3 – 6 Meses',
      '7-meses': '7+ Meses',
      'anualidad': 'Anualidad',
    };

    const cotizacionText = preseleccion
      ? `${preseleccion.sucursalNombre} · ${preseleccion.bodegaLabel} · ${preseleccion.pisoLabel} · ${preseleccion.plazoLabel}${preseleccion.descuento > 0 ? ` (${preseleccion.descuento * 100}% desc.)` : ''} · ${fmt(preseleccion.precioMensual)}/mes`
      : '';

    try {
      const utmData = getUtmData();

      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          telefono,
          correo,
          sucursal: sucursalNombre,
          tamano: tamanoLabel,
          piso: piso === 'baja' ? 'Baja' : piso === 'alta' ? 'Alta' : 'Sin preferencia',
          plazo: plazoLabels[plazo] || plazo,
          mensaje,
          cotizacion: cotizacionText,
          utm: utmData,
        }),
      });

      if (!res.ok) throw new Error('Error al enviar');

      const trimmedNombre = nombre.trim();
      const spaceIdx = trimmedNombre.indexOf(' ');
      const firstName = spaceIdx > 0 ? trimmedNombre.slice(0, spaceIdx) : trimmedNombre;
      const lastName = spaceIdx > 0 ? trimmedNombre.slice(spaceIdx + 1) : '';

      const eventId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

      const w = window as Window & { dataLayer?: Record<string, unknown>[] };
      if (Array.isArray(w.dataLayer)) {
        w.dataLayer.push({
          event: 'form_submit',
          event_id: eventId,
          lead_form: 'contacto_torobox',
          value: preseleccion?.precioMensual ?? 0,
          currency: 'MXN',
          enhanced_conversion_data: {
            email: correo.trim().toLowerCase(),
            phone_number: telefono.replace(/\D/g, ''),
            first_name: firstName,
            last_name: lastName,
          },
        });
      }

      try {
        window.history.pushState({ formEnviado: true }, '', '/contacto/formenviado');
        if (Array.isArray(w.dataLayer)) {
          w.dataLayer.push({
            event: 'page_view',
            page_path: '/contacto/formenviado',
            page_location: window.location.origin + '/contacto/formenviado',
            page_title: 'Contacto - Formulario Enviado',
          });
        }
      } catch {}

      setEnviado(true);
      setNombre('');
      setTelefono('');
      setCorreo('');
      setSucursal('');
      setTamano('asesoria');
      setPiso('');
      setPlazo('asesoria');
      setMensaje('');
      setPreseleccion(null);
    } catch {
      setErrorEnvio('Hubo un error al enviar tu solicitud. Por favor intenta de nuevo o contáctanos directamente.');
    } finally {
      setEnviando(false);
    }
  };

  // All unique bodega sizes across all branches
  const allTamanos = useMemo(() => {
    const seen = new Map<string, string>();
    for (const s of SUCURSALES) {
      for (const b of s.bodegas) {
        if (!seen.has(b.id)) seen.set(b.id, b.label);
      }
    }
    return Array.from(seen.entries()).map(([id, label]) => ({ id, label }));
  }, []);

  // Selected bodega (for dynamic discount badges)
  const bodegaSeleccionada = useMemo(() => {
    if (!sucursal || !tamano || tamano === 'asesoria') return null;
    const suc = SUCURSALES.find(s => s.id === sucursal);
    return suc?.bodegas.find(b => b.id === tamano) ?? null;
  }, [sucursal, tamano]);

  // Available floors for selected bodega
  const pisosDisponibles = useMemo<Piso[]>(() => {
    if (!bodegaSeleccionada) return [];
    return (Object.keys(bodegaSeleccionada.precios) as Piso[]).filter(k => bodegaSeleccionada.precios[k] !== undefined);
  }, [bodegaSeleccionada]);

  // Auto-select piso when only one option, or reset when bodega changes
  useEffect(() => {
    if (!preseleccion) {
      if (pisosDisponibles.length === 1) {
        setPiso(pisosDisponibles[0]);
      } else if (pisosDisponibles.length === 0) {
        setPiso('');
      } else if (piso && !pisosDisponibles.includes(piso)) {
        setPiso('');
      }
    }
  }, [pisosDisponibles, preseleccion, piso]);

  // Filter sucursales based on selected tamaño
  const sucursalesFiltradas = useMemo(() => {
    if (!tamano || tamano === 'asesoria') return SUCURSALES;
    return SUCURSALES.filter(s => s.bodegas.some(b => b.id === tamano));
  }, [tamano]);

  return (
    <>
      <SimuladorTarifas onSolicitar={handleSolicitar} initialSucursalId={initialSucursal} initialBodegaId={initialTamano} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Información lateral */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-brand-black">Estamos para servirte</h2>
            <p className="text-gray-600 mb-8 text-lg">Envíanos un mensaje, pide una cotización para tu sucursal más cercana o simplemente llámanos directamente. ¡Te responderemos de inmediato!</p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-red-50 text-brand-red p-3 rounded-lg mr-4 border border-red-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <h3 className="font-bold text-brand-black">Llámanos</h3>
                  <p className="text-gray-600">+52 (33) 1234 5678</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-50 text-brand-red p-3 rounded-lg mr-4 border border-red-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h3 className="font-bold text-brand-black">Envíanos un correo</h3>
                  <p className="text-gray-600">info@torobox.mx</p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-gray-50 border border-gray-200 p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-2">Visita Nuestras Instalaciones</h3>
              <p className="text-gray-600 mb-6">Todas nuestras sucursales cuentan con asesores presenciales de Lunes a Sábado.</p>
              <Button href="/sucursales" variant="secondary" fullWidth>Ver Directorio de Sucursales</Button>
            </div>
          </div>

          {/* Formulario */}
          <div ref={formRef} id="formulario-contacto" className="bg-white shadow-xl rounded-2xl p-8 md:p-10 border border-gray-100 relative">

            {/* Banner de pre-selección del simulador */}
            {preseleccion && (
              <div className="mb-6 bg-brand-black text-white rounded-xl p-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-red mb-1.5">Cotización del simulador</p>
                  <p className="text-sm font-semibold leading-snug">
                    {preseleccion.sucursalNombre} · {preseleccion.bodegaLabel} · {preseleccion.pisoLabel}
                  </p>
                  <p className="text-sm text-gray-300 mt-0.5">
                    {preseleccion.plazoLabel}
                    {preseleccion.descuento > 0 && (
                      <span className="ml-2 text-emerald-400 font-semibold">
                        {preseleccion.descuento * 100}% off
                      </span>
                    )}
                    {' · '}
                    <span className="text-white font-bold">{fmt(preseleccion.precioMensual)}/mes</span>
                  </p>
                </div>
                <button
                  onClick={clearPreseleccion}
                  className="text-gray-400 hover:text-white transition-colors shrink-0 mt-0.5"
                  title="Limpiar pre-selección"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <h3 className="text-2xl font-bold mb-6 text-brand-black">Solicitar Información</h3>

            {enviado ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-brand-black mb-2">¡Solicitud enviada!</h4>
                <p className="text-gray-600 mb-6">Nuestro equipo te contactará a la brevedad posible.</p>
                <button
                  onClick={() => {
                    try { window.history.pushState({}, '', '/contacto'); } catch {}
                    setEnviado(false);
                  }}
                  className="text-brand-red font-semibold hover:underline"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (

            <div
              role="form"
              className="space-y-6"
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  (e.target as HTMLElement).tagName === 'INPUT'
                ) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre completo <span className="text-brand-red">*</span></label>
                  <input type="text" id="nombre" value={nombre} onChange={e => handleNombre(e.target.value)} className={`w-full border rounded-md shadow-sm py-3 px-4 focus:ring-brand-red focus:border-brand-red outline-none ${errores.nombre ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} placeholder="Tu nombre" />
                  {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">Teléfono <span className="text-brand-red">*</span></label>
                  <input type="tel" id="telefono" inputMode="tel" value={telefono} onChange={e => handleTelefono(e.target.value)} className={`w-full border rounded-md shadow-sm py-3 px-4 focus:ring-brand-red focus:border-brand-red outline-none ${errores.telefono ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} placeholder="33 1234 5678" />
                  {errores.telefono && <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico <span className="text-brand-red">*</span></label>
                <input type="email" id="correo" inputMode="email" value={correo} onChange={e => handleCorreo(e.target.value)} className={`w-full border rounded-md shadow-sm py-3 px-4 focus:ring-brand-red focus:border-brand-red outline-none ${errores.correo ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} placeholder="tucorreo@ejemplo.com" />
                {errores.correo && <p className="text-red-500 text-xs mt-1">{errores.correo}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sucursal" className="block text-sm font-medium text-gray-700 mb-2">Sucursal de interés <span className="text-brand-red">*</span></label>
                  <select
                    id="sucursal"
                    value={sucursalesFiltradas.some(s => s.id === sucursal) ? sucursal : ''}
                    onChange={e => { setSucursal(e.target.value); if (errores.sucursal) setErrores(prev => ({ ...prev, sucursal: '' })); }}
                    className={`w-full border rounded-md shadow-sm py-3 px-4 focus:ring-brand-red focus:border-brand-red outline-none bg-white ${errores.sucursal ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  >
                    <option value="">Selecciona una opción</option>
                    {sucursalesFiltradas.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                  {errores.sucursal && <p className="text-red-500 text-xs mt-1">{errores.sucursal}</p>}
                </div>
                <div>
                  <label htmlFor="tamano" className="block text-sm font-medium text-gray-700 mb-2">Tamaño de bodega <span className="text-brand-red">*</span></label>
                  <select
                    id="tamano"
                    value={tamano}
                    onChange={e => { setTamano(e.target.value); if (errores.tamano) setErrores(prev => ({ ...prev, tamano: '' })); }}
                    className={`w-full border rounded-md shadow-sm py-3 px-4 focus:ring-brand-red focus:border-brand-red outline-none bg-white ${errores.tamano ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  >
                    <option value="asesoria">Aún no lo sé, necesito asesoría</option>
                    {allTamanos.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                  {errores.tamano && <p className="text-red-500 text-xs mt-1">{errores.tamano}</p>}
                </div>
              </div>

              {/* Planta — solo aparece cuando hay pisos disponibles */}
              {pisosDisponibles.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Planta preferida</label>
                  <div className="flex gap-3">
                    {pisosDisponibles.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPiso(p)}
                        className={`flex-1 py-3 px-4 rounded-md text-sm font-semibold transition-all border ${
                          piso === p
                            ? 'bg-brand-red text-white border-brand-red'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-brand-red'
                        }`}
                      >
                        Planta {p === 'alta' ? 'Alta' : 'Baja'}
                      </button>
                    ))}
                  </div>
                  {pisosDisponibles.length > 1 && piso && bodegaSeleccionada && (
                    <p className="text-xs text-gray-500 mt-1.5">
                      Precio: {fmt(bodegaSeleccionada.precios[piso] ?? 0)}/mes
                    </p>
                  )}
                </div>
              )}
              {pisosDisponibles.length === 1 && bodegaSeleccionada && (
                <div className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-600">
                  Esta bodega solo está disponible en <strong className="text-brand-black">Planta {pisosDisponibles[0] === 'alta' ? 'Alta' : 'Baja'}</strong>
                </div>
              )}

              <div>
                <label htmlFor="plazo" className="block text-sm font-medium text-gray-700 mb-2">Plazo de contrato <span className="text-brand-red">*</span></label>
                <select
                  id="plazo"
                  value={plazo}
                  onChange={e => { setPlazo(e.target.value); if (errores.plazo) setErrores(prev => ({ ...prev, plazo: '' })); }}
                  className={`w-full border rounded-md shadow-sm py-3 px-4 focus:ring-brand-red focus:border-brand-red outline-none bg-white ${errores.plazo ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                >
                  <option value="asesoria">No lo sé todavía, necesito asesoría</option>
                  <option value="mensual">Mensual — precio estándar, sin compromiso</option>
                  <option value="3-6-meses">3 – 6 Meses — hasta 20% de descuento</option>
                  <option value="7-meses">7+ Meses — hasta 25% de descuento</option>
                  <option value="anualidad">Anualidad — hasta 35% de descuento, el mayor ahorro</option>
                </select>
                {(() => {
                  const allPlazos = [
                    { id: 'mensual', label: 'Mensual', fallback: 'Estándar' },
                    { id: '3-6-meses', label: '3 – 6 Meses', fallback: 'Hasta 20% off' },
                    { id: '7-meses', label: '7+ Meses', fallback: 'Hasta 25% off' },
                    { id: 'anualidad', label: 'Anualidad', fallback: 'Hasta 35% off' },
                  ] as const;
                  const hasSelection = plazo && plazo !== 'asesoria';
                  const selected = allPlazos.find(p => p.id === plazo);

                  if (hasSelection && selected) {
                    const desc = selected.id === 'mensual' ? 0 : (bodegaSeleccionada?.descuentos?.[selected.id] ?? 0);
                    const descLabel = selected.id === 'mensual'
                      ? 'Sin descuento — precio estándar'
                      : desc > 0
                        ? `${Math.round(desc * 100)}% de descuento aplicado`
                        : 'Sin descuento en este plazo';

                    return (
                      <div className="mt-3 flex justify-center">
                        <div className="bg-brand-red/10 border-2 border-brand-red rounded-lg py-3 px-6 text-center inline-flex flex-col items-center">
                          <p className="font-bold text-brand-red text-sm">{selected.label}</p>
                          <p className="text-brand-red font-black text-lg">{descLabel}</p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                      {allPlazos.map((p) => {
                        const isBest = p.id === 'anualidad';
                        return (
                          <div key={p.id} className={`rounded-lg py-2 px-1 relative ${isBest ? 'bg-red-50 border border-brand-red' : 'bg-gray-50 border border-gray-200'}`}>
                            {isBest && (
                              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Mejor Ahorro</span>
                            )}
                            <p className={`font-bold ${isBest ? 'text-brand-red mt-1' : 'text-brand-black'}`}>{p.label}</p>
                            <p className={`font-black text-base ${isBest ? 'text-brand-red' : 'text-brand-black'}`}>
                              {p.id === 'mensual' ? <span className="text-gray-500 font-medium text-xs">Estándar</span> : p.fallback}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
                {errores.plazo && <p className="text-red-500 text-xs mt-1">{errores.plazo}</p>}
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">Mensaje o comentarios adicionales</label>
                <textarea id="mensaje" rows={4} value={mensaje} onChange={e => setMensaje(e.target.value)} className="w-full border-gray-300 border rounded-md shadow-sm py-3 px-4 focus:ring-brand-red focus:border-brand-red outline-none" placeholder="Dinos qué necesitas almacenar..."></textarea>
              </div>

              {errorEnvio && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">
                  {errorEnvio}
                </div>
              )}

              <Button type="button" onClick={() => handleSubmit()} variant="primary" fullWidth className="py-4 text-lg mt-4 shadow-lg shadow-red-500/30" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Solicitar información ahora'}
              </Button>
            </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
