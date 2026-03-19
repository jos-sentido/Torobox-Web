import SucursalPage from '@/components/SucursalPage';

const e = (f: string) =>
  `/images/sucursales/punto-sur/${f.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29')}`;

export default function SucursalPuntoSurPage() {
  return (
    <SucursalPage
      data={{
        sucursalId: 'punto-sur',
        nombre: 'Punto Sur',
        etiqueta: 'Sucursal Sur',
        descripcion:
          'Nuestra ubicación al sur de la ciudad. Ideal para desarrollos residenciales, pensión vehicular y negocios locales.',
        telefono: '33-32-58-26-36',
        email: 'ventaspuntosur@torobox.com.mx',
        direccion: 'Av. Adolfo López Mateos Sur 5540, Col. Los Gavilanes, C.P. 45645, Tlajomulco, Jalisco',
        mapQuery: 'Torobox+Av.+Adolfo+L%C3%B3pez+Mateos+Sur+5540,+Los+Gavilanes,+45645+Tlajomulco+de+Z%C3%BA%C3%B1iga,+Jal.,+M%C3%A9xico',
        heroSrc: '/images/sucursales/punto-sur/hero.jpg',
        gallery: [
          e('hero.jpg'),
          e('hero2.jpg'),
          e('img1.jpg'),
          e('img2.jpg'),
          e('TOROLOPEZ.jpg'),
          e('WhatsApp Image 2025-07-15 at 3.13.56 PM.jpeg'),
          e('WhatsApp Image 2025-07-28 at 11.04.54 AM.jpeg'),
          e('WhatsApp Image 2025-08-29 at 10.18.23 AM.jpeg'),
        ],
        servicios: [
          'Pensión vehicular disponible',
          'Bodegas domésticas y comerciales',
          'Acceso controlado',
          'Seguridad Privada',
          'App de control de acceso',
          'Ideal para zona residencial',
          'Carritos de carga disponibles',
          'Atención personalizada Lun–Sáb',
        ],
      }}
    />
  );
}
