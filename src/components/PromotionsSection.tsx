import Button from "@/components/Button";

export default function PromotionsSection() {
  return (
    <section className="py-20 bg-brand-red relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-black">Ahorra más al contratar por plazo</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto mb-12">
          
          {/* Tarjeta Izquierda - Mensual */}
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 transition-transform duration-300 hover:scale-105">
            <h3 className="text-xl font-bold text-brand-black mb-2">Mensual</h3>
            <div className="text-4xl md:text-5xl font-bold text-white mb-4">Estándar</div>
            <p className="text-white/90">Flexibilidad total mes a mes.</p>
          </div>

          {/* Tarjeta Central - 3 Meses (Popular) */}
          <div className="bg-white rounded-2xl p-10 text-center shadow-2xl relative transform md:-translate-y-4 md:scale-110 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-black text-white px-6 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase whitespace-nowrap">
              Más Popular
            </div>
            <h3 className="text-xl font-bold text-brand-black mb-2 mt-2">3 Meses</h3>
            <div className="text-6xl font-bold text-brand-red mb-4">10%</div>
            <p className="text-gray-600 font-medium">De descuento en tu renta.</p>
          </div>

          {/* Tarjeta Derecha - 12 Meses */}
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 transition-transform duration-300 hover:scale-105">
            <h3 className="text-xl font-bold text-brand-black mb-2">12 Meses</h3>
            <div className="text-5xl md:text-6xl font-bold text-white mb-4">15%</div>
            <p className="text-white/90">El mayor ahorro para largo plazo.</p>
          </div>

        </div>

        <div className="text-center">
          <Button href="/contacto" variant="white" className="text-lg px-8 py-3.5 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all">
            Cotizar mi espacio
          </Button>
        </div>
      </div>
    </section>
  );
}
