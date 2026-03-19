import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="space-y-6">
            <Link href="/" className="inline-block bg-white p-2 rounded">
              <Image
                src="/logos/TOROBOX PNG.PNG"
                alt="Logo ToroBox"
                width={120}
                height={40}
                className="object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              ToroBox ofrece renta de mini bodegas seguras y accesibles para almacenamiento personal o empresarial en las mejores ubicaciones.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-brand-white">Navegación</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-brand-red transition-colors">Inicio</Link></li>
              <li><Link href="/tamanos" className="hover:text-brand-red transition-colors">Tamaños de Bodegas</Link></li>
              <li><Link href="/sucursales" className="hover:text-brand-red transition-colors">Sucursales</Link></li>
              <li><Link href="/como-contratar" className="hover:text-brand-red transition-colors">Cómo Contratar</Link></li>
              <li><Link href="/faq" className="hover:text-brand-red transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-brand-white">Información Útil</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/que-puedes-guardar" className="hover:text-brand-red transition-colors">Qué puedes guardar</Link></li>
              <li><Link href="/articulos-no-permitidos" className="hover:text-brand-red transition-colors">Artículos no permitidos</Link></li>
              <li><Link href="/soluciones" className="hover:text-brand-red transition-colors">Soluciones Adicionales</Link></li>
              <li><Link href="/contacto" className="hover:text-brand-red transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-brand-white">Contacto Directo</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 text-brand-red flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>info@torobox.mx</span>
              </li>
              <li className="flex items-start">
                 <Link href="/contacto" className="inline-flex items-center text-brand-white bg-brand-red hover:bg-brand-red-hover px-4 py-2 rounded-md font-medium transition-colors">
                    Contáctanos
                 </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} ToroBox. Todos los derechos reservados.</p>
          <div className="mt-4 md:mt-0 space-x-4">
             <Link href="#" className="hover:text-gray-300">Aviso de Privacidad</Link>
             <Link href="#" className="hover:text-gray-300">Términos y Condiciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
