export type SucursalSeo = {
  id: string;
  nombre: string;
  telefono: string;
  telefonoIntl: string;
  email: string;
  street: string;
  locality: string;
  region: string;
  postalCode: string;
  country: string;
  url: string;
  image: string;
  description: string;
  latitude: number;
  longitude: number;
};

export const sucursalesSeo: SucursalSeo[] = [
  {
    id: "av-vallarta",
    nombre: "ToroBox Av. Vallarta",
    telefono: "33-31-15-43-51",
    telefonoIntl: "+523331154351",
    email: "ventasvallarta@torobox.com.mx",
    street: "Av. Vallarta 7529, Col. Ciudad Granja",
    locality: "Zapopan",
    region: "Jalisco",
    postalCode: "45010",
    country: "MX",
    url: "https://torobox.mx/sucursales/av-vallarta",
    image: "https://torobox.mx/images/sucursales/av-vallarta/hero.webp",
    description:
      "Renta de mini bodegas desde 1.75 m² en Av. Vallarta, Zapopan. Acceso 24/7 y vigilancia CCTV.",
    latitude: 20.6899083,
    longitude: -103.4490999,
  },
  {
    id: "zona-real",
    nombre: "ToroBox Zona Real",
    telefono: "33-31-31-21-64",
    telefonoIntl: "+523331312164",
    email: "karen.diaz@torobox.com.mx",
    street: "Prol. Jesús 3777, Col. Los Girasoles",
    locality: "Zapopan",
    region: "Jalisco",
    postalCode: "45136",
    country: "MX",
    url: "https://torobox.mx/sucursales/zona-real",
    image: "https://torobox.mx/images/sucursales/zona-real/hero.webp",
    description:
      "Bodegas premium y corporativas en Zona Real, Zapopan. Vigilancia armada 24/7, montacargas y wifi.",
    latitude: 20.735824,
    longitude: -103.4270418,
  },
  {
    id: "punto-sur",
    nombre: "ToroBox Punto Sur",
    telefono: "33-32-58-26-36",
    telefonoIntl: "+523332582636",
    email: "ventaspuntosur@torobox.com.mx",
    street: "Av. Adolfo López Mateos Sur 5540, Col. Los Gavilanes",
    locality: "Tlajomulco de Zúñiga",
    region: "Jalisco",
    postalCode: "45645",
    country: "MX",
    url: "https://torobox.mx/sucursales/punto-sur",
    image: "https://torobox.mx/images/sucursales/punto-sur/hero.webp",
    description:
      "Mini bodegas en Tlajomulco con acceso controlado y seguridad privada, sobre López Mateos Sur.",
    latitude: 20.5733912,
    longitude: -103.4544733,
  },
  {
    id: "bucerias",
    nombre: "ToroBox Bucerías",
    telefono: "322-510-00-51",
    telefonoIntl: "+523225100051",
    email: "ventasbucerias@torobox.com.mx",
    street: "Héroes De Nacozari 210, Col. Los Mangos y Flamingos Residencial",
    locality: "Bucerías",
    region: "Nayarit",
    postalCode: "63732",
    country: "MX",
    url: "https://torobox.mx/sucursales/bucerias",
    image: "https://torobox.mx/images/sucursales/bucerias/hero.webp",
    description:
      "Almacenamiento vacacional en Bucerías. Espacios para botes, motos y equipos marinos.",
    latitude: 20.7513858,
    longitude: -105.3244334,
  },
];

export function localBusinessJsonLd(s: SucursalSeo) {
  return {
    "@context": "https://schema.org",
    "@type": "SelfStorage",
    "@id": s.url,
    name: s.nombre,
    description: s.description,
    url: s.url,
    image: s.image,
    telephone: s.telefonoIntl,
    email: s.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.street,
      addressLocality: s.locality,
      addressRegion: s.region,
      postalCode: s.postalCode,
      addressCountry: s.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: s.latitude,
      longitude: s.longitude,
    },
    areaServed: s.locality,
    parentOrganization: {
      "@type": "Organization",
      name: "ToroBox",
      url: "https://torobox.mx",
    },
  };
}
