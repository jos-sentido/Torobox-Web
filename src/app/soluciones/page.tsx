import Button from "@/components/Button";

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
            {/* Aqui iría imagen real de bodega u oficina */}
            <div className="absolute inset-0 bg-brand-red flex items-center justify-center opacity-90 text-white p-8 text-center">
              <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
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
                    <svg className="w-5 h-5 text-brand-red mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
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
            {/* Aqui iría imagen real de autos */}
            <div className="absolute inset-0 bg-brand-black flex items-center justify-center opacity-90 text-white p-8 text-center">
               <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
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
                    <svg className="w-5 h-5 text-brand-red mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
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
