import type { Metadata } from 'next';
import SucursalPage from '@/components/SucursalPage';
import JsonLd from '@/components/JsonLd';
import { sucursalesSeo, localBusinessJsonLd } from '@/lib/sucursales-data';

const seo = sucursalesSeo.find((s) => s.id === 'punto-sur')!;

export const metadata: Metadata = {
  title: 'Mini Bodegas Punto Sur, Tlajomulco — ToroBox',
  description:
    'Renta de mini bodegas en López Mateos Sur 5540, Tlajomulco. Acceso controlado y seguridad privada. Cotiza hoy.',
  alternates: { canonical: '/sucursales/punto-sur' },
};

const base = '/images/sucursales/punto-sur';

export default function SucursalPuntoSurPage() {
  return (
    <>
    <JsonLd data={localBusinessJsonLd(seo)} />
    <SucursalPage
      data={{
        sucursalId: 'punto-sur',
        nombre: 'Punto Sur',
        etiqueta: 'Sucursal Sur',
        descripcion:
          'Nuestra ubicación al sur de la ciudad. Ideal para desarrollos residenciales y negocios locales.',
        telefono: '33-32-58-26-36',
        email: 'ventaspuntosur@torobox.com.mx',
        direccion: 'Av. Adolfo López Mateos Sur 5540, Col. Los Gavilanes, C.P. 45645, Tlajomulco, Jalisco',
        mapQuery: 'Torobox+Av.+Adolfo+L%C3%B3pez+Mateos+Sur+5540,+Los+Gavilanes,+45645+Tlajomulco+de+Z%C3%BA%C3%B1iga,+Jal.,+M%C3%A9xico',
        heroSrc: `${base}/hero.webp`,
        gallery: [
          `${base}/hero.webp`,
          `${base}/hero2.webp`,
          `${base}/img1.webp`,
          `${base}/img2.webp`,
          `${base}/torolopez.webp`,
          `${base}/2025-07-15-3.13.56-pm.webp`,
          `${base}/2025-07-28-11.04.54-am.webp`,
          `${base}/2025-08-29-10.18.23-am.webp`,
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
    </>
  );
}
