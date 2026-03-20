import type { Metadata } from "next";
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
