import Image from 'next/image';
import Link from 'next/link';

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
          <Image src={heroSrc} alt={`Sucursal ${nombre}`} fill className="object-cover opacity-30" priority />
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
                {/* Featured: first image wide */}
                {gallery[0] && (
                  <div className="col-span-2 relative h-64 rounded-xl overflow-hidden bg-gray-100">
                    <Image src={gallery[0]} alt="Instalaciones" fill className="object-cover" sizes="(max-width: 768px) 100vw, 55vw" />
                  </div>
                )}
                {gallery[1] && (
                  <div className="col-span-1 relative h-64 rounded-xl overflow-hidden bg-gray-100">
                    <Image src={gallery[1]} alt="Instalaciones" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                  </div>
                )}
                {/* Smaller grid */}
                {gallery.slice(2, 8).map((src, i) => (
                  <div key={i} className="col-span-1 relative h-36 rounded-xl overflow-hidden bg-gray-100">
                    <Image src={src} alt="Instalaciones" fill className="object-cover" sizes="(max-width: 768px) 33vw, 20vw" loading="lazy" />
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
                    <svg className="w-5 h-5 text-brand-red mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
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
                  title={`Mapa ${nombre}`}
                />
              </div>
            </section>

            {/* Contact info */}
            <section>
              <h2 className="text-2xl font-bold text-brand-black mb-5">Datos de Contacto</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4 sm:col-span-2">
                  <div className="shrink-0 w-9 h-9 bg-red-50 border border-red-100 text-brand-red rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Dirección</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{direccion}</p>
                  </div>
                </div>

                {telefono && (
                  <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <div className="shrink-0 w-9 h-9 bg-red-50 border border-red-100 text-brand-red rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
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
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
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
                <Link
                  href={`/contacto?sucursal=${sucursalId}`}
                  className="block w-full text-center bg-brand-red hover:bg-brand-red-hover text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-lg shadow-brand-red/30 text-sm"
                >
                  Cotizar en {nombre}
                </Link>
                <p className="text-xs text-gray-500 text-center mt-3">Te respondemos de inmediato · Lun–Sáb</p>
              </div>

              {(telefono || email) && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contacto directo</p>
                  {telefono && (
                    <a href={`tel:${telefono.replace(/-/g, '')}`} className="flex items-center gap-2 text-sm font-semibold text-brand-black hover:text-brand-red transition-colors">
                      <svg className="w-4 h-4 text-brand-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {telefono}
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm font-semibold text-brand-black hover:text-brand-red transition-colors break-all">
                      <svg className="w-4 h-4 text-brand-red shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
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
