import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes — ToroBox",
  description:
    "Resolvemos tus dudas sobre renta de mini bodegas: contratos, acceso, seguridad, facturación y más. Consulta nuestras preguntas frecuentes.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
