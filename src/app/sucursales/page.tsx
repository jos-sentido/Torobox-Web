import Button from "@/components/Button";
import Image from "next/image";
import Link from "next/link";

const sucursales = [
  {
    id: "av-vallarta",
    nombre: "Av. Vallarta",
    telefono: "33-31-15-43-51",
    email: "ventasvallarta@torobox.com.mx",
    direccion: "Av. Vallarta 7529, Col. Ciudad Granja, C.P. 45010, Zapopan, Jalisco",
    mapQuery: "Torobox+Av.+Ignacio+L.+Vallarta+7529,+Granja,+45010+Zapopan,+Jal.,+M%C3%A9xico",
    img: "/images/sucursales/av-vallarta/hero.jpg",
    caracteristicas: ["Acceso 24/7", "Bodegas desde 1.75m²", "Cerca de vías rápidas"],
  },
  {
    id: "zona-real",
    nombre: "Zona Real",
    telefono: "33-31-31-21-64",
    email: "karen.diaz@torobox.com.mx",
    direccion: "Prol. Jesús 3777, Col. Los Girasoles, C.P. 45136, Zapopan, Jalisco",
    mapQuery: "Torobox+Prol.+Jes%C3%BAs+3777,+Los+Girasoles,+45136+Zapopan,+Jal.,+M%C3%A9xico",
    img: "/images/sucursales/zona-real/hero.jpg",
    caracteristicas: ["Seguridad Premium", "Bodegas corporativas", "Amplio estacionamiento"],
  },
  {
    id: "punto-sur",
    nombre: "Punto Sur",
    telefono: "33-32-58-26-36",
    email: "ventaspuntosur@torobox.com.mx",
    direccion: "Av. Adolfo López Mateos Sur 5540, Col. Los Gavilanes, C.P. 45645, Tlajomulco, Jalisco",
    mapQuery: "Torobox+Av.+Adolfo+L%C3%B3pez+Mateos+Sur+5540,+Los+Gavilanes,+45645+Tlajomulco+de+Z%C3%BA%C3%B1iga,+Jal.,+M%C3%A9xico",
    img: "/images/sucursales/punto-sur/hero.jpg",
    caracteristicas: ["Pensión vehicular", "Acceso controlado", "Ideal para hogar"],
  },
  {
    id: "bucerias",
    nombre: "Bucerías",
    telefono: null,
    email: null,
    direccion: "Carr. Tepic-Vallarta, Bucerías, Nayarit",
    mapQuery: "Buce%C3%ADas,+Nayarit,+M%C3%A9xico",
    img: "/images/sucursales/bucerias/hero.jpg",
    caracteristicas: ["Almacén vacacional", "Clima controlado", "Espacios para botes y motos"],
  },
];

export default function SucursalesPage() {
  return (
    <div className="bg-brand-light min-h-screen pb-20">
      <div className="bg-brand-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestras Sucursales</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Encuentra la mini bodega más cercana a tu hogar o negocio. Instalaciones de primer nivel en ubicaciones estratégicas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
        {sucursales.map((suc) => (
          <div
            key={suc.id}
            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3">

              {/* Left: photo + info */}
              <div className="lg:col-span-2 flex flex-col">
                {/* Photo */}
                <div className="relative h-56 sm:h-64 w-full bg-gray-200">
                  <Image
                    src={suc.img}
                    alt={`Sucursal ToroBox ${suc.nombre}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="p-6 md:p-8 flex flex-col flex-1 justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-black mb-4">{suc.nombre}</h2>

                    {/* Address */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="shrink-0 w-8 h-8 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center text-brand-red mt-0.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Dirección</p>
                        <p className="text-sm text-gray-700 leading-snug">{suc.direccion}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    {suc.telefono && (
                      <div className="flex items-start gap-3 mb-3">
                        <div className="shrink-0 w-8 h-8 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center text-brand-red mt-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Teléfono</p>
                          <a href={`tel:${suc.telefono.replace(/-/g, '')}`} className="text-sm text-brand-red font-semibold hover:underline">
                            {suc.telefono}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    {suc.email && (
                      <div className="flex items-start gap-3 mb-5">
                        <div className="shrink-0 w-8 h-8 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center text-brand-red mt-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Correo</p>
                          <a href={`mailto:${suc.email}`} className="text-sm text-brand-red font-semibold hover:underline break-all">
                            {suc.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <ul className="flex flex-wrap gap-2 mb-6">
                      {suc.caracteristicas.map((car, idx) => (
                        <li key={idx} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-brand-red rounded-full shrink-0" />
                          {car}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/sucursales/${suc.id}`}
                    className="inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-6 py-2.5 text-center"
                  >
                    Ver Detalles de Sucursal
                  </Link>
                </div>
              </div>

              {/* Right: map */}
              <div className="lg:col-span-1 min-h-[280px] lg:min-h-0">
                <iframe
                  src={`https://maps.google.com/maps?q=${suc.mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  className="w-full h-full min-h-[280px] border-0 grayscale-[20%]"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa sucursal ${suc.nombre}`}
                />
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
