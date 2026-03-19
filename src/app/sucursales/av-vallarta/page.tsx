import SucursalPage from '@/components/SucursalPage';

const e = (f: string) =>
  `/images/sucursales/av-vallarta/${f.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')}`;

export default function SucursalAvVallartaPage() {
  return (
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
        heroSrc: '/images/sucursales/av-vallarta/hero.jpg',
        gallery: [
          e('hero.jpg'),
          e('hero2.jpg'),
          e('WhatsApp Image 2025-06-09 at 5.46.33 PM.jpeg'),
          e('WhatsApp Image 2025-06-09 at 5.48.01 PM.jpeg'),
          e('WhatsApp Image 2025-06-10 at 10.16.31 AM.jpeg'),
          e('WhatsApp Image 2025-06-10 at 10.16.32 AM.jpeg'),
          e('WhatsApp Image 2025-07-15 at 3.11.07 PM.jpeg'),
          e('WhatsApp Image 2025-07-22 at 9.50.16 AM.jpeg'),
        ],
        servicios: [
          'Acceso 24/7',
          'Patio de maniobras',
          'Carritos de carga disponibles',
          'Vigilancia y CCTV',
          'Bodegas desde 1.75 m²',
          'Cerca de vías rápidas',
          'Cerraduras de seguridad incluidas',
          'Atención personalizada Lun–Sáb',
        ],
      }}
    />
  );
}
