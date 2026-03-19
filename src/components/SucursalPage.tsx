import Image from 'next/image';
import Button from '@/components/Button';
import { PiCheckCircleDuotone, PiMapPinDuotone, PiPhoneDuotone, PiEnvelopeDuotone } from 'react-icons/pi';

export interface SucursalData {
  sucursalId: string;
  nombre: string;
  etiqueta: string;
  descripcion: string;
  telefono?: string | null;
  email?: string | null;
  direccion: string;
  mapQuery: string;
  heroSrc: string;
  gallery: string[];
  servicios: string[];
}

export default function SucursalPage({ data }: { data: SucursalData }) {
  const { sucursalId, nombre, etiqueta, descripcion, telefono, email, direccion, mapQuery, heroSrc, gallery, servicios } = data;

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="relative bg-brand-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src={heroSrc} alt={`Fachada e instalaciones de la sucursal ToroBox ${nombre}`} fill sizes="100vw" className="object-cover opacity-30" priority />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <span className="text-brand-red font-bold uppercase tracking-wider text-sm mb-2 block">{etiqueta}</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{nombre}</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-300">{descripcion}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-14">

            {/* Gallery */}
            <section>
              <h2 className="text-2xl font-bold text-brand-black mb-6">Galería de Instalaciones</h2>
              <div className="grid grid-cols-3 gap-3">
                {gallery[0] && (
                  <div className="col-span-2 relative h-64 rounded-xl overflow-hidden bg-gray-100">
                    <Image src={gallery[0]} alt={`Vista principal de las instalaciones ToroBox ${nombre}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 55vw" />
                  </div>
                )}
                {gallery[1] && (
                  <div className="col-span-1 relative h-64 rounded-xl overflow-hidden bg-gray-100">
                    <Image src={gallery[1]} alt={`Interior de mini bodegas en sucursal ${nombre}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                )}
                {gallery.slice(2, 8).map((src, i) => (
                  <div key={i} className="col-span-1 relative h-36 rounded-xl overflow-hidden bg-gray-100">
                    <Image src={src} alt={`Galería de la sucursal ToroBox ${nombre}, foto ${i + 3}`} fill className="object-cover" sizes="(max-width: 768px) 33vw, 20vw" loading="lazy" />
                  </div>
                ))}
              </div>
            </section>

            {/* Services */}
            <section>
              <h2 className="text-2xl font-bold text-brand-black mb-6">Servicios y Características</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {servicios.map((s, i) => (
                  <li key={i} className="flex items-center text-gray-700 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <PiCheckCircleDuotone className="w-5 h-5 text-brand-red mr-3 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            {/* Map */}
            <section>
              <h2 className="text-2xl font-bold text-brand-black mb-6">Cómo Llegar</h2>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: 320 }}>
                <iframe
                  src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  className="border-0 w-full h-full"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa sucursal ${nombre}`}
                />
              </div>
            </section>

            {/* Contact info */}
            <section>
              <h2 className="text-2xl font-bold text-brand-black mb-5">Datos de Contacto</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4 sm:col-span-2">
                  <div className="shrink-0 w-9 h-9 bg-red-50 border border-red-100 text-brand-red rounded-xl flex items-center justify-center">
                    <PiMapPinDuotone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Dirección</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{direccion}</p>
                  </div>
                </div>

                {telefono && (
                  <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <div className="shrink-0 w-9 h-9 bg-red-50 border border-red-100 text-brand-red rounded-xl flex items-center justify-center">
                      <PiPhoneDuotone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Teléfono</p>
                      <a href={`tel:${telefono.replace(/-/g, '')}`} className="text-sm text-brand-red font-semibold hover:underline">
                        {telefono}
                      </a>
                    </div>
                  </div>
                )}

                {email && (
                  <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <div className="shrink-0 w-9 h-9 bg-red-50 border border-red-100 text-brand-red rounded-xl flex items-center justify-center">
                      <PiEnvelopeDuotone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Correo electrónico</p>
                      <a href={`mailto:${email}`} className="text-sm text-brand-red font-semibold hover:underline break-all">
                        {email}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-brand-black text-white rounded-2xl p-7 shadow-2xl">
                <span className="text-brand-red text-xs font-bold uppercase tracking-wider mb-1 block">¿Listo para rentar?</span>
                <h3 className="text-xl font-bold mb-2">{nombre}</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Simula el costo de tu bodega y solicita información con un asesor de esta sucursal.
                </p>
                <Button href={`/contacto?sucursal=${sucursalId}`} variant="primary" fullWidth>
                  Cotizar en {nombre}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-3">Te respondemos de inmediato · Lun–Sáb</p>
              </div>

              {(telefono || email) && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contacto directo</p>
                  {telefono && (
                    <a href={`tel:${telefono.replace(/-/g, '')}`} className="flex items-center gap-2 text-sm font-semibold text-brand-black hover:text-brand-red transition-colors">
                      <PiPhoneDuotone className="w-4 h-4 text-brand-red shrink-0" />
                      {telefono}
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm font-semibold text-brand-black hover:text-brand-red transition-colors break-all">
                      <PiEnvelopeDuotone className="w-4 h-4 text-brand-red shrink-0" />
                      {email}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
