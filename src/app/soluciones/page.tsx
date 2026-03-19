import type { Metadata } from "next";
import Button from "@/components/Button";
import { PiCheckCircleDuotone, PiBuildingOfficeDuotone, PiCarProfileDuotone } from "react-icons/pi";

export const metadata: Metadata = {
  title: "Soluciones de Almacenamiento Empresarial — ToroBox",
  description:
    "Bodega con oficina integrada para PyMES y pensión vehicular para autos, flotillas y remolques. Soluciones a la medida en Guadalajara, Zapopan y Bucerías.",
};

export default function SolucionesPage() {
  return (
    <div className="bg-brand-light min-h-screen">
      <div className="bg-brand-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Soluciones Adicionales</h1>
          <p className="text-xl text-gray-300">
            Más allá del almacenamiento tradicional, en ToroBox desarrollamos soluciones a la medida de los clientes más exigentes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Bodega con Oficina */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-16 flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 bg-gray-200 relative min-h-[300px]">
            <div className="absolute inset-0 bg-brand-red flex items-center justify-center opacity-90 text-white p-8 text-center">
              <PiBuildingOfficeDuotone className="w-20 h-20 opacity-50" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
            <div className="inline-block bg-brand-black text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-6">Emprendedores y PyMES</div>
            <h2 className="text-3xl font-bold text-brand-black mb-4">Bodega con Oficina Integrada</h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              La máxima eficiencia para e-commerce, distribuidores y emprendedores. Tus operaciones e inventario en un solo lugar sin pagar los altos costos de arrendamiento comercial tradicional.
            </p>
            <ul className="space-y-3 mb-8">
              {['Espacio híbrido configurable', 'Conexión a internet dedicada disponible', 'Recepción de paquetería', 'Acceso a sanitarios y áreas comunes'].map((ben, i) => (
                 <li key={i} className="flex items-start">
                    <PiCheckCircleDuotone className="w-5 h-5 text-brand-red mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{ben}</span>
                 </li>
              ))}
            </ul>
            <div className="mt-auto">
               <Button href="/contacto" variant="primary">Cotizar Bodega Industrial/Oficina</Button>
            </div>
          </div>
        </div>

        {/* Pensión o Resguardo de Autos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row-reverse">
          <div className="w-full lg:w-1/2 bg-gray-200 relative min-h-[300px]">
            <div className="absolute inset-0 bg-brand-black flex items-center justify-center opacity-90 text-white p-8 text-center">
               <PiCarProfileDuotone className="w-20 h-20 opacity-50" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
            <div className="inline-block bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded mb-6">Coleccionistas y Empresas</div>
            <h2 className="text-3xl font-bold text-brand-black mb-4">Pensión y Resguardo Vehicular</h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Espacios techados y de gran tamaño ideales para resguardar autos clásicos, flotillas de negocio, remolques o vehículos recreativos con la máxima seguridad.
            </p>
            <ul className="space-y-3 mb-8">
              {['Espacios a pie de calle o planta baja', 'Maniobra sencilla', 'Seguridad CCTV 24/7 de alta definición', 'Control estricto de accesos'].map((ben, i) => (
                 <li key={i} className="flex items-start">
                    <PiCheckCircleDuotone className="w-5 h-5 text-brand-red mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{ben}</span>
                 </li>
              ))}
            </ul>
            <div className="mt-auto">
               <Button href="/contacto" variant="secondary">Consultar disponibilidad vehicular</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
