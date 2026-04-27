import type { Metadata } from 'next';
import SucursalPage from '@/components/SucursalPage';
import JsonLd from '@/components/JsonLd';
import { sucursalesSeo, localBusinessJsonLd } from '@/lib/sucursales-data';

const seo = sucursalesSeo.find((s) => s.id === 'bucerias')!;

export const metadata: Metadata = {
  title: 'Mini Bodegas Bucerías, Nayarit — ToroBox',
  description:
    'Almacenamiento vacacional y clima controlado en Bucerías, Nayarit. Espacios para botes, motos y equipos marinos. Cotiza hoy.',
  alternates: { canonical: '/sucursales/bucerias' },
};

export default function SucursalBuceriasPage() {
  return (
    <>
    <JsonLd data={localBusinessJsonLd(seo)} />
    <SucursalPage
      data={{
        sucursalId: 'bucerias',
        nombre: 'Bucerías',
        etiqueta: 'Sucursal Costa',
        descripcion:
          'Espacios adaptados para el clima de la costa. Ideal para desarrollos turísticos, equipos marinos y almacenamiento vacacional.',
        telefono: '322-510-00-51',
        email: 'ventasbucerias@torobox.com.mx',
        direccion: 'Heroes De Nacozari 210, Col. Los Mangos y Flamingos Residencial, C.P. 63732, Bucerías, Nayarit',
        mapQuery: 'Heroes+De+Nacozari+210,+Bucer%C3%ADas,+Nayarit,+M%C3%A9xico',
        heroSrc: '/images/sucursales/bucerias/hero.webp',
        heroPosition: 'center 30%',
        gallery: [
          '/images/sucursales/bucerias/hero.webp',
          '/images/sucursales/bucerias/hero2.webp',
          '/images/sucursales/bucerias/img20260210162048.webp',
          '/images/sucursales/bucerias/img20260210162055.webp',
          '/images/sucursales/bucerias/img20260210162058.webp',
          '/images/sucursales/bucerias/img20260210162126.webp',
          '/images/sucursales/bucerias/img20260210162147.webp',
          '/images/sucursales/bucerias/img20260210162153.webp',
        ],
        servicios: [
          'Acceso controlado',
          'Acceso Lun–Vie 9am a 6pm, Sáb 9am a 2pm',
          'Cámaras de vigilancia 24/7',
          'Wifi',
          'Circuito cerrado',
          'Carritos de carga disponible',
          'Atención personalizada Lun–Sáb',
          'Amplio estacionamiento',
          'Cerca de vías rápidas',
          'Control de plagas',
          'Perros de detección para sustancias prohibidas',
          'Venta de accesorios',
          'Ideal turismo y zona costera',
          'Espacio para botes y motos',
          'Bodegas con oficina',
        ],
      }}
    />
    </>
  );
}
