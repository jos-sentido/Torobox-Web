import type { Metadata } from 'next';
import SucursalPage from '@/components/SucursalPage';
import JsonLd from '@/components/JsonLd';
import { sucursalesSeo, localBusinessJsonLd } from '@/lib/sucursales-data';

const seo = sucursalesSeo.find((s) => s.id === 'av-vallarta')!;

export const metadata: Metadata = {
  title: 'Mini Bodegas Av. Vallarta, Zapopan — ToroBox',
  description:
    'Renta de mini bodegas desde 1.75 m² en Av. Vallarta 7529, Zapopan. Acceso 24/7, vigilancia CCTV y cerca de vías rápidas. Cotiza hoy.',
  alternates: { canonical: '/sucursales/av-vallarta' },
};

const base = '/images/sucursales/av-vallarta';

export default function SucursalAvVallartaPage() {
  return (
    <>
    <JsonLd data={localBusinessJsonLd(seo)} />
    <SucursalPage
      data={{
        sucursalId: 'av-vallarta',
        nombre: 'Av. Vallarta',
        etiqueta: 'Sucursal Principal',
        descripcion:
          'Nuestra sucursal más céntrica, ideal para almacenamiento rápido con acceso directo desde las principales vías de la ciudad.',
        telefono: '33-31-15-43-51',
        email: 'ventasvallarta@torobox.com.mx',
        direccion: 'Av. Vallarta 7529, Col. Ciudad Granja, C.P. 45010, Zapopan, Jalisco',
        mapQuery: 'Torobox+Av.+Ignacio+L.+Vallarta+7529,+Granja,+45010+Zapopan,+Jal.,+M%C3%A9xico',
        heroSrc: `${base}/hero.webp`,
        gallery: [
          `${base}/hero.webp`,
          `${base}/hero2.webp`,
          `${base}/2025-06-09-5.46.33-pm.webp`,
          `${base}/2025-06-09-5.48.01-pm.webp`,
          `${base}/2025-06-10-10.16.31-am.webp`,
          `${base}/2025-06-10-10.16.32-am.webp`,
          `${base}/2025-07-15-3.11.07-pm.webp`,
          `${base}/2025-07-22-9.50.16-am.webp`,
        ],
        servicios: [
          'Pensión vehicular',
          'Acceso controlado',
          'Acceso 24/7',
          'Vigilancia 24/7',
          'Circuito cerrado',
          'Wifi',
          'Carritos de carga disponible',
          'Atención personalizada Lun–Sáb',
          'Amplio estacionamiento',
          'Cerca de vías rápidas',
          'Control de plagas',
          'Perros de detección para sustancias prohibidas',
          'Venta de accesorios',
          'Bodegas con oficina',
        ],
      }}
    />
    </>
  );
}
