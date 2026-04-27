import type { Metadata } from "next";
import Button from "@/components/Button";
import { PiWarningDuotone } from "react-icons/pi";

export const metadata: Metadata = {
  title: "Artículos No Permitidos en Mini Bodegas — ToroBox",
  description:
    "Conoce los artículos prohibidos en mini bodegas ToroBox: inflamables, explosivos, perecederos, sustancias tóxicas y más. Política de seguridad.",
  alternates: { canonical: "/articulos-no-permitidos" },
};

export default function ArticulosNoPermitidosPage() {
  const prohibidos = [
    { title: "Seres Vivos", desc: "No se permite almacenar animales, mascotas ni plantas de ningún tipo.", icon: "🐾" },
    { title: "Materiales Inflamables", desc: "Gasolina, solventes, pintura, gas y cualquier otra sustancia altamente inflamable.", icon: "🔥" },
    { title: "Explosivos", desc: "Pólvora, fuegos artificiales, municiones o cualquier material detonante.", icon: "💣" },
    { title: "Sustancias Tóxicas", desc: "Químicos peligrosos, venenos, fertilizantes concentrados o residuos biológicos.", icon: "☣️" },
    { title: "Perecederos", desc: "Alimentos no enlatados, comida que requiera refrigeración o que pueda atraer plagas.", icon: "🍎" },
    { title: "Mercancía Ilegal", desc: "Drogas, armas no registradas, contrabando o artículos de procedencia ilícita.", icon: "🚫" },
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-brand-black text-white py-16 border-b-4 border-brand-red">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Artículos No Permitidos</h1>
          <p className="text-base md:text-xl text-gray-300">
            Para garantizar la seguridad de todas las pertenencias y de nuestras instalaciones, existen restricciones estrictas.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-red-50 border-l-4 border-brand-red p-6 rounded-r-lg mb-12">
          <div className="flex">
            <div className="flex-shrink-0">
              <PiWarningDuotone className="h-6 w-6 text-brand-red" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Razones de Seguridad</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Las restricciones existen para proteger tus pertenencias contra incendios, explosiones, plagas y problemas legales.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prohibidos.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl p-5 md:p-8 hover:border-brand-red transition-colors">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-brand-black mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Si tienes dudas sobre algo en específico, por favor consulta nuestra sección completa de FAQ o contáctanos.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
             <Button href="/faq" variant="secondary">Leer FAQ completo</Button>
             <Button href="/contacto" variant="outline">Consultar Asesor</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
