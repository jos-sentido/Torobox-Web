import SucursalPage from '@/components/SucursalPage';

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
        heroSrc: '/images/sucursales/zona-real/hero.jpg',
        gallery: [
          '/images/sucursales/zona-real/hero.jpg',
          '/images/sucursales/zona-real/hero2.jpg',
          '/images/sucursales/zona-real/img1.jpg',
          '/images/sucursales/zona-real/img2.jpg',
          '/images/sucursales/zona-real/img3.jpg',
          '/images/sucursales/zona-real/IMG_20240104_125826.jpg',
          '/images/sucursales/zona-real/IMG_20240104_125832__01.jpg',
          '/images/sucursales/zona-real/IMG_20240104_125832__02.jpg',
        ],
        servicios: [
          'Wifi de Alta Velocidad',
          'Vigilancia Armada 24/7',
          'Circuito Cerrado HD',
          'Amplio Estacionamiento',
          'Montacargas disponible',
          'Control de Plagas',
          'Facturación disponible',
          'Personal de apoyo y logística',
        ],
      }}
    />
  );
}
