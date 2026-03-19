import type { Metadata } from 'next';
import SucursalPage from '@/components/SucursalPage';

export const metadata: Metadata = {
  title: 'Mini Bodegas Bucerías, Nayarit — ToroBox',
  description:
    'Almacenamiento vacacional y clima controlado en Bucerías, Nayarit. Espacios para botes, motos y equipos marinos. Cotiza hoy.',
};

export default function SucursalBuceriasPage() {
  return (
    <SucursalPage
      data={{
        sucursalId: 'bucerias',
        nombre: 'Bucerías',
        etiqueta: 'Sucursal Costa',
        descripcion:
          'Espacios adaptados para el clima de la costa. Ideal para desarrollos turísticos, equipos marinos y almacenamiento vacacional.',
        telefono: null,
        email: null,
        direccion: 'Carr. Tepic-Vallarta, Bucerías, Nayarit',
        mapQuery: 'Buce%C3%ADas,+Nayarit,+M%C3%A9xico',
        heroSrc: '/images/sucursales/bucerias/hero.webp',
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
          'Control de humedad',
          'Protección contra salitre',
          'Espacios para botes y motos',
          'Acceso para remolques',
          'Almacén vacacional',
          'Clima controlado',
          'Seguridad 24/7',
          'Ideal para turismo y zona costera',
        ],
      }}
    />
  );
}
