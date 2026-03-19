import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import PromotionsSection from "@/components/PromotionsSection";
import GaleriaHome from "@/components/GaleriaHome";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-brand-black text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/sucursales/av-vallarta/hero.jpg" 
            alt="Bodegas ToroBox" 
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 to-brand-black/40" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start text-left">
          <span className="text-brand-red font-bold tracking-wider uppercase text-sm mb-4">Almacenamiento Seguro y Profesional</span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 max-w-3xl leading-tight">
            Más espacio para tu vida y tu negocio.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl">
            Renta de mini bodegas seguras, limpias y accesibles. Protege lo que más importa con infraestructura de primer nivel.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button href="/sucursales" variant="primary">Ver Sucursales</Button>
            <Button href="/tamanos" variant="outline-white">Conocer Tamaños</Button>
          </div>
        </div>
      </section>

      {/* Usos Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">¿Para qué necesitas espacio?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Soluciones de almacenamiento diseñadas para cubrir cualquier necesidad, desde tu hogar hasta tu corporativo.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Hogar y Mudanza",
                desc: "El sitio seguro para tus muebles y cajas mientras te instalas.",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                    {/* Roof */}
                    <polygon points="24,4 44,22 4,22" fill="#D0272C"/>
                    {/* Wall */}
                    <rect x="8" y="22" width="32" height="22" rx="1" fill="#1a1a1a"/>
                    {/* Door */}
                    <rect x="19" y="30" width="10" height="14" rx="2" fill="#D0272C"/>
                    {/* Chimney */}
                    <rect x="31" y="10" width="5" height="12" rx="1" fill="#D0272C"/>
                  </svg>
                ),
              },
              {
                title: "Negocio e Inventario",
                desc: "Libera espacio valioso almacenando tu mercancía o equipo.",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                    {/* Box body */}
                    <rect x="6" y="18" width="36" height="26" rx="2" fill="#1a1a1a"/>
                    {/* Box flap left */}
                    <path d="M6 18 L6 10 L20 10 L20 18 Z" fill="#D0272C"/>
                    {/* Box flap right */}
                    <path d="M28 10 L42 10 L42 18 L28 18 Z" fill="#D0272C"/>
                    {/* Box top center strip */}
                    <rect x="20" y="8" width="8" height="12" rx="1" fill="#b01e22"/>
                    {/* Tape line on body */}
                    <rect x="6" y="28" width="36" height="4" rx="1" fill="#D0272C"/>
                  </svg>
                ),
              },
              {
                title: "Archivo Muerto",
                desc: "Cumple con las leyes resguardando tus documentos importantes de forma organizada.",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                    {/* Folder back */}
                    <rect x="4" y="14" width="40" height="30" rx="3" fill="#1a1a1a"/>
                    {/* Folder tab */}
                    <path d="M4 14 L4 10 Q4 8 6 8 L20 8 L24 14 Z" fill="#D0272C"/>
                    {/* Document lines */}
                    <rect x="12" y="22" width="24" height="3" rx="1.5" fill="#D0272C"/>
                    <rect x="12" y="29" width="18" height="3" rx="1.5" fill="#D0272C" opacity="0.7"/>
                    <rect x="12" y="36" width="20" height="3" rx="1.5" fill="#D0272C" opacity="0.5"/>
                  </svg>
                ),
              },
              {
                title: "Herramientas",
                desc: "Tus equipos de trabajo seguros y listos para tu próximo proyecto.",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                    {/* Wrench */}
                    <path d="M10 38 L28 18 C26 14 27 8 32 6 C34 5.5 36 6 38 7 L33 12 L36 15 L41 10 C42 12 42 15 41 17 C39 21 34 22 30 20 L12 40 C10.5 41.5 8 41.5 6.5 40 C5 38.5 8.5 36.5 10 38Z" fill="#1a1a1a"/>
                    {/* Screwdriver */}
                    <rect x="26" y="26" width="6" height="18" rx="3" transform="rotate(-45 26 26)" fill="#D0272C"/>
                    <rect x="35" y="8" width="4" height="10" rx="1" transform="rotate(-45 35 8)" fill="#D0272C"/>
                  </svg>
                ),
              },
            ].map((uso, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="mb-6 bg-white w-16 h-16 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  {uso.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-brand-black">{uso.title}</h3>
                <p className="text-gray-600 mb-4">{uso.desc}</p>
                <Link href="/que-puedes-guardar" className="text-brand-red font-semibold text-sm inline-flex items-center hover:text-brand-red-hover">
                  Saber más &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios Incluidos Section */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tu tranquilidad está incluida</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Nuestras instalaciones cuentan con los más altos estándares de seguridad y servicios complementarios sin costo extra.</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-center">
            {[
              { name: "Wifi", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-red mb-3"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/></svg> },
              { name: "Vigilancia 24/7", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-red mb-3"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg> },
              { name: "Circuito cerrado", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-red mb-3"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg> },
              { name: "Área de estacionamiento", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-red mb-3"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg> },
              { name: "Escaleras para planta alta", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-red mb-3"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg> },
              { name: "Acceso controlado", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-red mb-3"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg> },
              { name: "Carritos de apoyo", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-red mb-3"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> },
              { name: "Asistencia a mujeres y adultos", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-red mb-3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
            ].map((ben, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-6 bg-brand-black rounded-lg border border-gray-800 hover:border-brand-red transition-colors">
                {ben.icon}
                <span className="font-semibold text-sm md:text-base">{ben.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería de Instalaciones */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-brand-red font-bold uppercase tracking-wider text-sm mb-2 block">Instalaciones reales</span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-3">Así son nuestras bodegas</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Instalaciones limpias, seguras y accesibles. Entra, carga y sal — así de fácil.</p>
          </div>

          <GaleriaHome />
        </div>
      </section>

      {/* Calculadora de Espacio CTA */}
      <section className="py-20 bg-brand-black text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
          <div className="absolute top-4 left-8 text-[120px] font-black text-white leading-none">m²</div>
          <div className="absolute bottom-4 right-8 text-[120px] font-black text-white leading-none">3D</div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Preview canvas mockup */}
            <div className="lg:w-1/2 shrink-0">
              <div className="bg-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-700">
                <div className="flex gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="bg-slate-100 rounded-xl p-3 grid grid-cols-5 gap-1.5 aspect-video items-end">
                  {/* Simulated items on canvas */}
                  <div className="col-span-2 row-span-2 bg-pink-300 rounded opacity-90 flex items-center justify-center text-[8px] font-bold text-slate-800 h-16">Cama</div>
                  <div className="bg-yellow-300 rounded opacity-90 flex items-center justify-center text-[8px] font-bold text-slate-800 h-8">Caja</div>
                  <div className="bg-yellow-300 rounded opacity-90 flex items-center justify-center text-[8px] font-bold text-slate-800 h-8">Caja</div>
                  <div className="bg-purple-300 rounded opacity-90 flex items-center justify-center text-[8px] font-bold text-slate-800 h-16 row-span-2">Arch.</div>
                  <div className="bg-red-300 rounded opacity-90 flex items-center justify-center text-[8px] font-bold text-slate-800 col-span-2 h-8">Sillón</div>
                  <div className="bg-green-300 rounded opacity-90 flex items-center justify-center text-[8px] font-bold text-slate-800 col-span-2 h-8">Mesa</div>
                  <div className="bg-blue-200 rounded opacity-90 flex items-center justify-center text-[8px] font-bold text-slate-800 col-span-2 h-10">Refrigerador</div>
                  <div className="bg-gray-300 rounded opacity-90 flex items-center justify-center text-[8px] font-bold text-slate-800 h-10 col-span-3">Bicicleta</div>
                </div>
              </div>
            </div>
            {/* Text */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <span className="text-brand-red font-bold tracking-wider uppercase text-sm mb-4 block">Nueva herramienta interactiva</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                ¿Cuánto espacio necesitas realmente?
              </h2>
              <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                Arrastra tus muebles y objetos en nuestro simulador 2D. Ve exactamente cómo caben en cada tamaño de bodega antes de contratar.
              </p>
              <ul className="text-gray-400 text-sm space-y-2 mb-8">
                <li className="flex items-center gap-2"><span className="text-brand-red font-bold">✓</span> Drag & drop de objetos (sillón, cama, cajas, bici...)</li>
                <li className="flex items-center gap-2"><span className="text-brand-red font-bold">✓</span> Simulación de apilamiento con física real</li>
                <li className="flex items-center gap-2"><span className="text-brand-red font-bold">✓</span> Métricas de volumen, altura y área en tiempo real</li>
                <li className="flex items-center gap-2"><span className="text-brand-red font-bold">✓</span> Análisis con IA de tu acomodo</li>
              </ul>
              <Link href="/calculadora" className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-brand-red/30">
                Probar Calculadora
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promociones */}
      <PromotionsSection />

      {/* Tamaños y Sucursales */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Tamaños */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-brand-black">Encuentra el tamaño ideal</h2>
              <p className="text-gray-600 mb-8">Bodegas desde 1.75 m² hasta 30 m² adaptables a tus requerimientos específicos.</p>
              
              <div className="space-y-4 mb-8">
                {[
                  { size:"1.75 m²", desc:"Ideal para cajas pequeñas, archivo, maletas." },
                  { size:"3.5 m²", desc:"Equivalente a medio cuarto vacío o un clóset grande." },
                  { size:"7 m²", desc:"Perfecto para los muebles de un departamento de 1 recámara." },
                  { size:"15 m²", desc:"Ideal para inventario de negocio o mudanza grande." },
                ].map((t, i) => (
                  <div key={i} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brand-red transition-colors">
                    <div className="bg-red-50 text-brand-red font-bold p-3 rounded mr-4 w-20 text-center">{t.size}</div>
                    <div className="text-gray-700 text-sm">{t.desc}</div>
                  </div>
                ))}
              </div>
              <Button href="/tamanos">Ver todos los tamaños</Button>
            </div>

            {/* Sucursales */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-brand-black">Ubicaciones Estratégicas</h2>
              <p className="text-gray-600 mb-8">Nuestras instalaciones están situadas en puntos clave para facilitar tu logística.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { name: "Av Vallarta", id: "av-vallarta", img: "/images/sucursales/av-vallarta/hero.jpg" },
                  { name: "Zona Real", id: "zona-real", img: "/images/sucursales/zona-real/hero.jpg" },
                  { name: "Punto Sur", id: "punto-sur", img: "/images/sucursales/punto-sur/hero.jpg" },
                  { name: "Bucerías", id: "bucerias", img: "/images/sucursales/bucerias/hero.jpg" }
                ].map((suc, i) => (
                  <Link href={`/sucursales/${suc.id}`} key={i} className="group relative h-40 rounded-lg overflow-hidden flex items-end p-4">
                    <Image src={suc.img} alt={`Sucursal ${suc.name}`} fill className="object-cover bg-gray-200 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <span className="relative z-10 text-white font-bold text-lg">{suc.name}</span>
                  </Link>
                ))}
              </div>
              <Button href="/sucursales" variant="secondary">Explorar Sucursales</Button>
            </div>

          </div>
        </div>
      </section>

      {/* Como Contratar CTA */}
      <section className="py-24 bg-brand-red text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Contrata hoy de manera rápida y segura</h2>
          <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">Selecciona tu tamaño, firma tu contrato de manera ágil y comienza a utilizar tu espacio en menos de 24 horas.</p>
          <div className="flex justify-center gap-4">
            <Button href="/como-contratar" variant="secondary">Pasos para contratar</Button>
            <Button href="/contacto" variant="white">Solicitar Información</Button>
          </div>
        </div>
      </section>
    </>
  );
}
