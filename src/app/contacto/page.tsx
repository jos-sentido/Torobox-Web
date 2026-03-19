import ContactoCliente from './ContactoCliente';

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ sucursal?: string; tamano?: string }>;
}) {
  const params = await searchParams;
  const initialSucursal = params.sucursal ?? '';
  const initialTamano = params.tamano ?? '';

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-brand-red text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contacto</h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            ¿Buscas una cotización exacta? Solicita información hoy y nuestro equipo te asesorará con la mejor opción disponible.
          </p>
        </div>
      </div>

      <ContactoCliente initialSucursal={initialSucursal} initialTamano={initialTamano} />
    </div>
  );
}
