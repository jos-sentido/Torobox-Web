import SucursalPage from '@/components/SucursalPage';

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
        heroSrc: '/images/sucursales/bucerias/hero.jpg',
        gallery: [
          '/images/sucursales/bucerias/hero.jpg',
          '/images/sucursales/bucerias/hero2.jpg',
          '/images/sucursales/bucerias/IMG20260210162048.jpg',
          '/images/sucursales/bucerias/IMG20260210162055.jpg',
          '/images/sucursales/bucerias/IMG20260210162058.jpg',
          '/images/sucursales/bucerias/IMG20260210162126.jpg',
          '/images/sucursales/bucerias/IMG20260210162147.jpg',
          '/images/sucursales/bucerias/IMG20260210162153.jpg',
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
