import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import PromotionsSection from "@/components/PromotionsSection";
import GaleriaHome from "@/components/GaleriaHome";
import {
  PiHouseDuotone,
  PiPackageDuotone,
  PiArchiveDuotone,
  PiWrenchDuotone,
  PiWifiHighDuotone,
  PiShieldCheckDuotone,
  PiSecurityCameraDuotone,
  PiCarProfileDuotone,
  PiStairsDuotone,
  PiKeyDuotone,
  PiTrolleyDuotone,
  PiHandshakeDuotone,
  PiDeskDuotone,
  PiArrowRightDuotone,
} from "react-icons/pi";

export const metadata: Metadata = {
  title: "Torobox",
  description:
    "Renta de mini bodegas seguras, limpias y accesibles en Guadalajara, Zapopan, Tlajomulco y Bucerías. Vigilancia 24/7, acceso controlado y bodegas desde 1.75 m². Cotiza hoy.",
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-brand-black text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sucursales/av-vallarta/hero.webp"
            alt="Pasillo iluminado de mini bodegas ToroBox con puertas rojas y vigilancia"
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 to-brand-black/40" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start text-left">
          <span className="text-brand-red font-bold tracking-wider uppercase text-sm mb-4">Almacenamiento Seguro y Profesional</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 max-w-3xl leading-tight">
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
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">¿Para qué necesitas espacio?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Soluciones de almacenamiento diseñadas para cubrir cualquier necesidad, desde tu hogar hasta tu corporativo.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[
              {
                title: "Hogar y Mudanza",
                desc: "El sitio seguro para tus muebles y cajas mientras te instalas.",
                icon: <PiHouseDuotone className="w-8 h-8" />,
              },
              {
                title: "Negocio e Inventario",
                desc: "Libera espacio valioso almacenando tu mercancía o equipo.",
                icon: <PiPackageDuotone className="w-8 h-8" />,
              },
              {
                title: "Archivo Muerto",
                desc: "Cumple con las leyes resguardando tus documentos importantes de forma organizada.",
                icon: <PiArchiveDuotone className="w-8 h-8" />,
              },
              {
                title: "Herramientas",
                desc: "Tus equipos de trabajo seguros y listos para tu próximo proyecto.",
                icon: <PiWrenchDuotone className="w-8 h-8" />,
              },
            ].map((uso, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-5 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="mb-6 bg-brand-black text-brand-red w-16 h-16 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
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
      <section className="py-12 md:py-20 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tu tranquilidad está incluida</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Nuestras instalaciones cuentan con los más altos estándares de seguridad y servicios complementarios sin costo extra.</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-center">
            {[
              { name: "Wifi", icon: <PiWifiHighDuotone className="w-8 h-8 text-brand-red mb-3" /> },
              { name: "Vigilancia 24/7", icon: <PiShieldCheckDuotone className="w-8 h-8 text-brand-red mb-3" /> },
              { name: "Circuito cerrado", icon: <PiSecurityCameraDuotone className="w-8 h-8 text-brand-red mb-3" /> },
              { name: "Área de estacionamiento", icon: <PiCarProfileDuotone className="w-8 h-8 text-brand-red mb-3" /> },
              { name: "Escaleras para planta alta", icon: <PiStairsDuotone className="w-8 h-8 text-brand-red mb-3" /> },
              { name: "Acceso controlado", icon: <PiKeyDuotone className="w-8 h-8 text-brand-red mb-3" /> },
              { name: "Carritos de apoyo", icon: <PiTrolleyDuotone className="w-8 h-8 text-brand-red mb-3" /> },
              { name: "Asistencia personalizada", icon: <PiHandshakeDuotone className="w-8 h-8 text-brand-red mb-3" /> },
              { name: "Cowork", icon: <PiDeskDuotone className="w-8 h-8 text-brand-red mb-3" /> },
            ].map((ben, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-3 md:p-6 bg-brand-black rounded-lg border border-gray-800 hover:border-brand-red transition-colors">
                {ben.icon}
                <span className="font-semibold text-sm md:text-base">{ben.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería de Instalaciones */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-brand-red font-bold uppercase tracking-wider text-sm mb-2 block">Instalaciones reales</span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-3">Así son nuestras bodegas</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Instalaciones limpias, seguras y accesibles. Entra, carga y sal — así de fácil.</p>
          </div>

          <GaleriaHome />
        </div>
      </section>

      {/* Bodega con Oficina — Diferenciador */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <span className="inline-flex items-center gap-2 bg-brand-red/20 text-brand-red border border-brand-red/30 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                ★ Exclusivo — Disponible en 2 sucursales
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Bodega + Oficina<br /><span className="text-brand-red">en un solo espacio</span>
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                La única bodega del mercado que incluye una <strong className="text-white">oficina privada integrada</strong> en 30 m² totales. Almacena tu mercancía y opera tu negocio desde el mismo lugar — sin pagar dos rentas distintas.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "30 m² totales — Oficina privada dentro de tu misma bodega",
                  "Fondo 2.44m · Bodega 8.60m · Oficina 3.40m · Alto 2.78m",
                  "Planta baja — carga y descarga sin escaleras",
                  "Wi-Fi, seguridad 24/7 y acceso controlado incluidos",
                  "Una sola renta, doble funcionalidad",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="text-brand-red font-bold mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/tamanos#bodega-con-oficina" className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg">
                Ver disponibilidad y precios
                <PiArrowRightDuotone className="w-5 h-5" />
              </Link>
            </div>
            <div className="lg:w-1/2 w-full space-y-4">
              <div className="bg-brand-black border border-gray-700 rounded-xl p-6 hover:border-brand-red transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-brand-red text-sm font-bold uppercase tracking-wide mb-1">Sucursal Av. Vallarta</div>
                    <div className="text-gray-400 text-sm">Guadalajara, Jalisco</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-2xl">$18,000</div>
                    <div className="text-gray-400 text-sm">/mes</div>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4 flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Fondo 2.44m · Bodega 8.60m · Oficina 3.40m · Alto 2.78m</span>
                  <Link href="/sucursales/av-vallarta" className="text-brand-red text-sm font-semibold hover:underline inline-flex items-center gap-1">
                    Ver sucursal <PiArrowRightDuotone className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="bg-brand-black border border-gray-700 rounded-xl p-6 hover:border-brand-red transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-brand-red text-sm font-bold uppercase tracking-wide mb-1">Sucursal Bucerías</div>
                    <div className="text-gray-400 text-sm">Nayarit</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-2xl">$15,000</div>
                    <div className="text-gray-400 text-sm">/mes</div>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4 flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Fondo 2.44m · Bodega 8.60m · Oficina 3.40m · Alto 2.78m</span>
                  <Link href="/sucursales/bucerias" className="text-brand-red text-sm font-semibold hover:underline inline-flex items-center gap-1">
                    Ver sucursal <PiArrowRightDuotone className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculadora de Espacio CTA */}
      <section className="py-12 md:py-20 bg-brand-black text-white overflow-hidden relative">
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
                <PiArrowRightDuotone className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promociones */}
      <PromotionsSection />

      {/* Tamaños y Sucursales */}
      <section className="py-12 md:py-20 bg-white">
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
                  { name: "Av Vallarta", id: "av-vallarta", img: "/images/sucursales/av-vallarta/hero.webp", alt: "Fachada de mini bodegas ToroBox sucursal Av. Vallarta en Zapopan" },
                  { name: "Zona Real", id: "zona-real", img: "/images/sucursales/zona-real/hero.webp", alt: "Instalaciones de mini bodegas ToroBox sucursal Zona Real en Zapopan" },
                  { name: "Punto Sur", id: "punto-sur", img: "/images/sucursales/punto-sur/hero.webp", alt: "Entrada de mini bodegas ToroBox sucursal Punto Sur en Tlajomulco" },
                  { name: "Bucerías", id: "bucerias", img: "/images/sucursales/bucerias/hero.webp", alt: "Mini bodegas ToroBox sucursal Bucerías en Nayarit, zona costera" }
                ].map((suc, i) => (
                  <Link href={`/sucursales/${suc.id}`} key={i} className="group relative h-40 rounded-lg overflow-hidden flex items-end p-4">
                    <Image src={suc.img} alt={suc.alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover bg-gray-200 group-hover:scale-105 transition-transform duration-500" />
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
