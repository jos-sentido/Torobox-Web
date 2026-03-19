import Button from "@/components/Button";
import Image from "next/image";

export default function QuePuedesGuardarPage() {
  const categorias = [
    {
      titulo: "Para el Hogar",
      items: ["Muebles (salas, comedores, recámaras)", "Electrodomésticos", "Ropa de temporada", "Decoraciones navideñas o festivas", "Maletas y artículos de viaje", "Bicicletas y equipo deportivo"]
    },
    {
      titulo: "Para tu Negocio",
      items: ["Inventario de temporada", "Mercancía para e-commerce", "Excedente de productos", "Herramientas de trabajo", "Material promocional o stands", "Mobiliario de oficina"]
    },
    {
      titulo: "Corporativo y Legal",
      items: ["Archivo muerto", "Expedientes contables", "Documentación legal", "Equipo de cómputo en desuso", "Insumos de papelería masiva"]
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-brand-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Qué Puedes Guardar</h1>
          <p className="text-xl text-gray-300">
            Nuestras mini bodegas están diseñadas para adaptarse a cualquier necesidad de almacenamiento, comercial o personal.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {categorias.map((cat, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-bold text-brand-red mb-6 border-b border-gray-200 pb-4">{cat.titulo}</h2>
              <ul className="space-y-4">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-brand-light rounded-2xl p-8 md:p-12 text-center border border-gray-200 mb-16">
          <h2 className="text-3xl font-bold text-brand-black mb-4">¿Tienes algo diferente en mente?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
            Si no estás seguro si tu artículo es apto para almacenamiento, contáctanos. En la mayoría de los casos podemos ofrecerte una solución.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button href="/articulos-no-permitidos" variant="outline" className="bg-white">Ver Artículos Prohibidos</Button>
            <Button href="/contacto" variant="primary">Preguntar a un asesor</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
