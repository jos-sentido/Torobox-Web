import type { Metadata } from 'next';
import SucursalPage from '@/components/SucursalPage';
import JsonLd from '@/components/JsonLd';
import { sucursalesSeo, localBusinessJsonLd } from '@/lib/sucursales-data';

const seo = sucursalesSeo.find((s) => s.id === 'juan-gil-preciado')!;

export const metadata: Metadata = {
  title: 'Mini Bodegas Juan Gil Preciado, Zapopan — ToroBox',
  description:
    'Renta de mini bodegas tipo contenedor en Av. Juan Gil Preciado 7676, Zapopan. Acceso controlado y circuito cerrado. Cotiza hoy.',
  alternates: { canonical: '/sucursales/juan-gil-preciado' },
};

const base = '/images/sucursales/juan-gil-preciado';

export default function SucursalJuanGilPreciadoPage() {
  return (
    <>
    <JsonLd data={localBusinessJsonLd(seo)} />
    <SucursalPage
      data={{
        sucursalId: 'juan-gil-preciado',
        nombre: 'Juan Gil Preciado',
        etiqueta: 'Sucursal Norte',
        descripcion:
          'Bodegas tipo contenedor sobre Av. Juan Gil Preciado, al norte de Zapopan. Acceso controlado y monitoreo por circuito cerrado.',
        telefono: '33-12-82-66-09',
        email: 'ventasjuangil@torobox.com.mx',
        direccion: 'Av. Juan Gil Preciado 7676, Zapopan, Jalisco',
        mapQuery: 'Torobox+Av.+Juan+Gil+Preciado+7676,+Zapopan,+Jal.,+M%C3%A9xico',
        heroSrc: `${base}/hero.webp`,
        gallery: [
          `${base}/hero.webp`,
          `${base}/hero2.webp`,
          `${base}/img1.webp`,
          `${base}/img2.webp`,
          `${base}/unidades.webp`,
          `${base}/escaleras.webp`,
          `${base}/seguridad.webp`,
          `${base}/pasillo.webp`,
        ],
        servicios: [
          'Bodegas con oficina',
          'Acceso controlado',
          'Circuito cerrado (CCTV)',
          'Vigilancia',
          'Planta alta y baja',
          'Amplios pasillos de maniobra',
          'Oficina de atención',
          'Estacionamiento',
        ],
      }}
    />
    </>
  );
}
