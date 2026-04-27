import type { MetadataRoute } from "next";

const BASE_URL = "https://torobox.mx";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/soluciones", priority: 0.9, changeFrequency: "monthly" },
    { path: "/sucursales", priority: 0.9, changeFrequency: "monthly" },
    { path: "/sucursales/zona-real", priority: 0.8, changeFrequency: "monthly" },
    { path: "/sucursales/av-vallarta", priority: 0.8, changeFrequency: "monthly" },
    { path: "/sucursales/punto-sur", priority: 0.8, changeFrequency: "monthly" },
    { path: "/sucursales/bucerias", priority: 0.8, changeFrequency: "monthly" },
    { path: "/tamanos", priority: 0.9, changeFrequency: "monthly" },
    { path: "/calculadora", priority: 0.8, changeFrequency: "monthly" },
    { path: "/como-contratar", priority: 0.7, changeFrequency: "monthly" },
    { path: "/que-puedes-guardar", priority: 0.7, changeFrequency: "monthly" },
    { path: "/articulos-no-permitidos", priority: 0.6, changeFrequency: "yearly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contacto", priority: 0.8, changeFrequency: "monthly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
