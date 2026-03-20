import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Tamaños de Mini Bodegas — ToroBox",
  description:
    "Bodegas desde 1.75 m² hasta 30 m². Encuentra el tamaño ideal para tu hogar, negocio o archivo. Cotiza en Guadalajara, Zapopan, Tlajomulco y Bucerías.",
};

export default function TamanosPage() {
  const tamanos = [
    {
      size: "1.75 m²",
      value: "1.75",
      title: "Mini Bodega Estándar",
      caben: "Cajas pequeñas, archivo muerto, maletas, bicicletas, decoraciones de temporada.",
      recomendado: "Ideal para liberar espacio de clósets en casa o pequeños excedentes de oficina.",
    },
    {
      size: "3.5 m²",
      value: "3.5",
      title: "Bodega Chica",
      caben: "Muebles de una recámara pequeña, electrodomésticos, cajas medianas.",
      recomendado: "Equivalente a la capacidad de una van de carga. Perfecto para remodelaciones.",
    },
    {
      size: "7.0 m²",
      value: "7",
      title: "Bodega Mediana",
      caben: "Muebles de un departamento de 1-2 recámaras, sofás, colchones, comedor.",
      recomendado: "Excelente para mudanzas de departamentos pequeños o inventario medio de negocio.",
    },
    {
      size: "10.0 m²",
      value: "10",
      title: "Bodega Amplia",
      caben: "Contenido de una casa de 2-3 recámaras, archivo masivo, equipo de trabajo.",
      recomendado: "Optimo para pequeños negocios de e-commerce y empresas de construcción.",
    },
    {
      size: "15.0 m²",
      value: "15",
      title: "Bodega Grande",
      caben: "Muebles de una casa de 3-4 recámaras, inventario de tienda, maquinaria.",
      recomendado: "Ideal para comerciantes, exceso de mercancía y contratistas.",
    },
    {
      size: "30.0 m²",
      value: "30",
      title: "Bodega Industrial / Comercial",
      caben: "Inventario corporativo, vehículos pequeños, mudanzas masivas, material pesado.",
      recomendado: "Nuestra solución más grande, diseñada para logística de empresas o gran volumen.",
    }
  ];

  return (
    <div className="bg-brand-light pb-20">
      <div className="bg-brand-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Tamaños de Mini Bodegas</h1>
          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto">
            Desde necesidades personales hasta requerimientos empresariales. Encuentra el espacio perfecto para ti.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tamanos.map((t, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
              <div className="bg-brand-red text-white p-6 text-center">
                <div className="text-4xl font-bold font-heading">{t.size}</div>
                <div className="text-red-100 mt-1 uppercase text-sm tracking-wide">{t.title}</div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2 text-brand-black flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    ¿Qué objetos caben?
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t.caben}</p>
                </div>
                <div className="mb-8 flex-grow">
                  <h3 className="font-bold text-lg mb-2 text-brand-black flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Recomendado para:
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t.recomendado}</p>
                </div>
                
                <div className="mt-auto">
                  <Button href={`/contacto?tamano=${t.value}`} fullWidth variant="primary">Solicitar Información</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bodega con Oficina — Sección Especial */}
      <div id="bodega-con-oficina" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 scroll-mt-20">
        <div className="bg-brand-black text-white rounded-2xl overflow-hidden shadow-2xl border border-brand-red/30">
          {/* Header badge */}
          <div className="bg-brand-red px-8 py-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-bold uppercase tracking-wider text-sm">Servicio Exclusivo — Bodega con Oficina Integrada</span>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left: Description */}
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Bodega con<br /><span className="text-brand-red">Oficina Integrada</span>
                </h2>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  La única bodega del mercado que combina espacio de almacenamiento con una <strong className="text-white">oficina privada dentro del mismo espacio</strong>. Administra tu negocio y guarda tu inventario sin pagar dos rentas.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Oficina privada integrada a la bodega",
                    "Ancho: 2.44m · Bodega: 8.60m de largo · Oficina: 3.40m de largo",
                    "Altura: 2.78m — espacio amplio y ventilado",
                    "Planta baja para carga y descarga sin escaleras",
                    "Wi-Fi, vigilancia 24/7, circuito cerrado y acceso controlado incluidos",
                    "Una sola renta que cubre almacén y oficina",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <span className="text-brand-red font-bold text-base mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Dimensions visual */}
                <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-3">Distribución del espacio</div>
                  <div className="flex gap-2 items-stretch h-16">
                    <div className="bg-brand-red/20 border border-brand-red/40 rounded-lg flex-[86] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white font-bold text-sm">8.60m</div>
                        <div className="text-gray-400 text-xs">Bodega</div>
                      </div>
                    </div>
                    <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg flex-[34] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white font-bold text-sm">3.40m</div>
                        <div className="text-gray-400 text-xs">Oficina</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs mt-2 text-center">Ancho total: 2.44m</div>
                </div>
              </div>

              {/* Right: Location cards */}
              <div className="lg:w-1/2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Disponible en estas sucursales:</h3>
                <div className="space-y-4">
                  {/* Av. Vallarta */}
                  <div className="border border-gray-700 rounded-xl p-6 hover:border-brand-red transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-bold text-white text-lg">Sucursal Av. Vallarta</div>
                        <div className="text-gray-400 text-sm">Guadalajara, Jalisco</div>
                      </div>
                      <div className="text-right">
                        <div className="text-brand-red font-bold text-3xl">$20,416</div>
                        <div className="text-gray-400 text-xs">/mes</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-white font-bold text-sm">2.44m</div>
                        <div className="text-gray-500 text-xs">ancho</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-white font-bold text-sm">8.60m</div>
                        <div className="text-gray-500 text-xs">bodega</div>
                      </div>
                      <div className="bg-blue-900/40 border border-blue-700/30 rounded-lg p-3 text-center">
                        <div className="text-blue-300 font-bold text-sm">3.40m</div>
                        <div className="text-gray-500 text-xs">oficina</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button href="/contacto?tamano=oficina&sucursal=av-vallarta" fullWidth variant="primary">Solicitar Información</Button>
                      <Link href="/sucursales/av-vallarta" className="shrink-0 border border-gray-600 hover:border-brand-red text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center">
                        Ver sucursal
                      </Link>
                    </div>
                  </div>

                  {/* Bucerías */}
                  <div className="border border-gray-700 rounded-xl p-6 hover:border-brand-red transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-bold text-white text-lg">Sucursal Bucerías</div>
                        <div className="text-gray-400 text-sm">Nayarit</div>
                      </div>
                      <div className="text-right">
                        <div className="text-brand-red font-bold text-3xl">$15,000</div>
                        <div className="text-gray-400 text-xs">/mes</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-white font-bold text-sm">2.44m</div>
                        <div className="text-gray-500 text-xs">ancho</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <div className="text-white font-bold text-sm">8.60m</div>
                        <div className="text-gray-500 text-xs">bodega</div>
                      </div>
                      <div className="bg-blue-900/40 border border-blue-700/30 rounded-lg p-3 text-center">
                        <div className="text-blue-300 font-bold text-sm">3.40m</div>
                        <div className="text-gray-500 text-xs">oficina</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button href="/contacto?tamano=oficina&sucursal=bucerias" fullWidth variant="primary">Solicitar Información</Button>
                      <Link href="/sucursales/bucerias" className="shrink-0 border border-gray-600 hover:border-brand-red text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center">
                        Ver sucursal
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-brand-black">¿Aún no estás seguro de qué tamaño elegir?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nuestros asesores están capacitados para ayudarte a calcular el espacio exacto que necesitas para no pagar de más.
          </p>
          <Button href="/contacto" variant="secondary">Contactar a un asesor</Button>
        </div>
      </div>
    </div>
  );
}
