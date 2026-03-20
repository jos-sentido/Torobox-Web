'use client';

import { useState, useRef, useMemo } from 'react';
import Button from '@/components/Button';
import SimuladorTarifas, { type SeleccionSimulador } from '@/components/SimuladorTarifas';
import { SUCURSALES } from '@/data/sucursales';

const fmt = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 });

export default function ContactoCliente({ initialSucursal = '', initialTamano = '' }: { initialSucursal?: string; initialTamano?: string }) {
  const formRef = useRef<HTMLDivElement>(null);

  // Simulator pre-fill state
  const [preseleccion, setPreseleccion] = useState<SeleccionSimulador | null>(null);

  // Controlled form fields (those that can be pre-filled)
  const [sucursal, setSucursal] = useState(initialSucursal);
  const [tamano, setTamano] = useState(initialTamano);
  const [plazo, setPlazo] = useState('');

  // Form fields
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Submission state
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');

  const handleSolicitar = (data: SeleccionSimulador) => {
    setPreseleccion(data);
    setSucursal(data.sucursalId);
    setTamano(data.bodegaId);
    setPlazo(data.plazoId);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const clearPreseleccion = () => setPreseleccion(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setErrorEnvio('');

    const sucursalNombre = SUCURSALES.find(s => s.id === sucursal)?.nombre || sucursal;
    const tamanoLabel = allTamanos.find(t => t.id === tamano)?.label || tamano;
    const plazoLabels: Record<string, string> = {
      'mensual': 'Mensual',
      '3-meses': '3 Meses (10% desc.)',
      '12-meses': '12 Meses (15% desc.)',
    };

    const cotizacionText = preseleccion
      ? `${preseleccion.sucursalNombre} · ${preseleccion.bodegaLabel} · ${preseleccion.pisoLabel} · ${preseleccion.plazoLabel}${preseleccion.descuento > 0 ? ` (${preseleccion.descuento * 100}% desc.)` : ''} · ${fmt(preseleccion.precioMensual)}/mes`
      : '';

    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          telefono,
          correo,
          sucursal: sucursalNombre,
          tamano: tamanoLabel,
          plazo: plazoLabels[plazo] || plazo,
          mensaje,
          cotizacion: cotizacionText,
        }),
      });

      if (!res.ok) throw new Error('Error al enviar');

      setEnviado(true);
      setNombre('');
      setTelefono('');
      setCorreo('');
      setSucursal('');
      setTamano('');
      setPlazo('');
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

  // Filter sucursales based on selected tamaño
  const sucursalesFiltradas = useMemo(() => {
    if (!tamano) return SUCURSALES;
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
                  onClick={() => setEnviado(false)}
                  className="text-brand-red font-semibold hover:underline"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                  <input type="text" id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border-gray-300 border rounded-md shadow-sm py-3 px-4 focus:ring-brand-red focus:border-brand-red outline-none" placeholder="Tu nombre" required />
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <input type="tel" id="telefono" value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full border-gray-300 border rounded-md shadow-sm py-3 px-4 focus:ring-brand-red focus:border-brand-red outline-none" placeholder="Tu número" required />
                </div>
              </div>

              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
                <input type="email" id="correo" value={correo} onChange={e => setCorreo(e.target.value)} className="w-full border-gray-300 border rounded-md shadow-sm py-3 px-4 focus:ring-brand-red focus:border-brand-red outline-none" placeholder="tucorreo@ejemplo.com" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sucursal" className="block text-sm font-medium text-gray-700 mb-2">Sucursal de interés</label>
                  <select
                    id="sucursal"
                    value={sucursalesFiltradas.some(s => s.id === sucursal) ? sucursal : ''}
                    onChange={e => setSucursal(e.target.value)}
                    className="w-full border-gray-300 border rounded-md shadow-sm py-3 px-4 focus:ring-brand-red focus:border-brand-red outline-none bg-white"
                  >
                    <option value="">Selecciona una opción</option>
                    {sucursalesFiltradas.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="tamano" className="block text-sm font-medium text-gray-700 mb-2">Tamaño de bodega</label>
                  <select
                    id="tamano"
                    value={tamano}
                    onChange={e => setTamano(e.target.value)}
                    className="w-full border-gray-300 border rounded-md shadow-sm py-3 px-4 focus:ring-brand-red focus:border-brand-red outline-none bg-white"
                  >
                    <option value="">Aún no lo sé, necesito asesoría</option>
                    {allTamanos.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="plazo" className="block text-sm font-medium text-gray-700 mb-2">Plazo de contrato</label>
                <select
                  id="plazo"
                  value={plazo}
                  onChange={e => setPlazo(e.target.value)}
                  className="w-full border-gray-300 border rounded-md shadow-sm py-3 px-4 focus:ring-brand-red focus:border-brand-red outline-none bg-white"
                >
                  <option value="">No lo sé todavía, necesito asesoría</option>
                  <option value="mensual">Mensual — precio estándar, sin compromiso</option>
                  <option value="3-meses">3 Meses — 10% de descuento ⭐ Más Popular</option>
                  <option value="12-meses">12 Meses — 15% de descuento, el mayor ahorro</option>
                </select>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg py-2 px-1">
                    <p className="font-bold text-brand-black">Mensual</p>
                    <p className="text-gray-500 mt-0.5">Estándar</p>
                  </div>
                  <div className="bg-red-50 border border-brand-red rounded-lg py-2 px-1 relative">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Más Popular</span>
                    <p className="font-bold text-brand-red mt-1">3 Meses</p>
                    <p className="text-brand-red font-black text-base">10% off</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg py-2 px-1">
                    <p className="font-bold text-brand-black">12 Meses</p>
                    <p className="text-brand-black font-black text-base">15% off</p>
                  </div>
                </div>
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

              <Button type="submit" variant="primary" fullWidth className="py-4 text-lg mt-4 shadow-lg shadow-red-500/30" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Solicitar información ahora'}
              </Button>
            </form>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
