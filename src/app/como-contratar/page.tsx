import type { Metadata } from "next";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Cómo Contratar tu Mini Bodega — ToroBox",
  description:
    "Contrata tu mini bodega en 5 pasos: contacto, asesoría de tamaño, documentación, firma de contrato y acceso inmediato. Proceso rápido y sin complicaciones.",
  alternates: { canonical: "/como-contratar" },
};

export default function ComoContratarPage() {
  const steps = [
    { num: "01", title: "Contactar o solicitar información", desc: "Comunícate por teléfono, WhatsApp o llenando nuestro formulario web. Un asesor te atenderá de inmediato." },
    { num: "02", title: "Elegir tamaño de bodega", desc: "Te ayudamos a calcular exactamente los metros cuadrados que requieres según tus inventarios o muebles." },
    { num: "03", title: "Presentar documentación", desc: "Sólo requerimos identificación oficial y un comprobante de domicilio. Trámite ágil para personas y empresas." },
    { num: "04", title: "Firmar contrato", desc: "Contratos flexibles, transparentes y sin letras chiquitas. Firma presencial en sucursal en cuestión de minutos." },
    { num: "05", title: "Comenzar a utilizar la bodega", desc: "Recibes tus accesos y puedes comenzar a almacenar tus bienes de inmediato con total seguridad." },
  ];

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <div className="bg-brand-red text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Cómo Contratar</h1>
          <p className="text-base md:text-xl text-red-100">
            Nuestro proceso está diseñado para ser rápido, transparente y sin complicaciones. Tu espacio listo el mismo día.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 lg:p-12">
          
          <div className="space-y-12">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-start relative">
                {idx !== steps.length - 1 && (
                  <div className="hidden md:block absolute left-[31px] top-16 bottom-[-48px] w-0.5 bg-gray-200"></div>
                )}
                
                <div className="flex-shrink-0 mb-4 md:mb-0 mr-8 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-brand-black text-white flex items-center justify-center text-xl font-bold font-heading z-10 shadow-lg border-4 border-white">
                    {step.num}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 md:p-8 flex-grow border border-gray-100 hover:border-brand-red transition-colors w-full">
                  <h3 className="text-lg md:text-2xl font-bold text-brand-black mb-2 md:mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm md:text-lg">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-brand-black">¿Listo para comenzar tu contratación?</h2>
          <Button href="/contacto" variant="primary" className="px-10 py-5 text-lg shadow-xl shadow-red-500/20">
            Ir a formulario de contacto
          </Button>
        </div>
      </div>
    </div>
  );
}
