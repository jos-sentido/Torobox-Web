import Button from "@/components/Button";

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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Artículos No Permitidos</h1>
          <p className="text-xl text-gray-300">
            Para garantizar la seguridad de todas las pertenencias y de nuestras instalaciones, existen restricciones estrictas.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-red-50 border-l-4 border-brand-red p-6 rounded-r-lg mb-12">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
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
            <div key={idx} className="border border-gray-200 rounded-xl p-8 hover:border-brand-red transition-colors">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-brand-black mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Si tienes dudas sobre algo en específico, por favor consulta nuestra sección completa de FAQ o contáctanos.</p>
          <div className="flex justify-center gap-4">
             <Button href="/faq" variant="secondary">Leer FAQ completo</Button>
             <Button href="/contacto" variant="outline">Consultar Asesor</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
