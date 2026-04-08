import type { Metadata } from 'next';
import SucursalPage from '@/components/SucursalPage';

export const metadata: Metadata = {
  title: 'Mini Bodegas Zona Real, Zapopan — ToroBox',
  description:
    'Bodegas premium y corporativas en Prol. Jesús 3777, Zapopan. Vigilancia armada 24/7, montacargas y wifi de alta velocidad. Cotiza hoy.',
};

export default function SucursalZonaRealPage() {
  return (
    <SucursalPage
      data={{
        sucursalId: 'zona-real',
        nombre: 'Zona Real',
        etiqueta: 'Sucursal Premium',
        descripcion:
          'Bodegas premium y corporativas con la más alta seguridad para tu negocio en la zona de mayor plusvalía de Zapopan.',
        telefono: '33-31-31-21-64',
        email: 'karen.diaz@torobox.com.mx',
        direccion: 'Prol. Jesús 3777, Col. Los Girasoles, C.P. 45136, Zapopan, Jalisco',
        mapQuery: 'Torobox+Prol.+Jes%C3%BAs+3777,+Los+Girasoles,+45136+Zapopan,+Jal.,+M%C3%A9xico',
        heroSrc: '/images/sucursales/zona-real/hero.webp',
        gallery: [
          '/images/sucursales/zona-real/hero.webp',
          '/images/sucursales/zona-real/hero2.webp',
          '/images/sucursales/zona-real/img1.webp',
          '/images/sucursales/zona-real/img2.webp',
          '/images/sucursales/zona-real/img3.webp',
          '/images/sucursales/zona-real/img_20240104_125826.webp',
          '/images/sucursales/zona-real/img_20240104_125832__01.webp',
          '/images/sucursales/zona-real/img_20240104_125832__02.webp',
        ],
        servicios: [
          'Acceso controlado',
          'Acceso 24/7',
          'Vigilancia 24/7',
          'Wifi',
          'Circuito cerrado',
          'Carritos de carga disponible',
          'Atención personalizada Lun–Sáb',
          'Amplio estacionamiento',
          'Cerca de vías rápidas',
          'Control de plagas',
          'Perros de detección para sustancias prohibidas',
          'Venta de accesorios',
        ],
      }}
    />
  );
}
