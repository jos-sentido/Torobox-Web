import type { Metadata } from "next";
import FaqClient from "./FaqClient";
import { faqs } from "./faqs";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes — Mini Bodegas",
  description:
    "Resolvemos tus dudas sobre renta de mini bodegas: contrato, seguridad, acceso, cambio de tamaño y facturación empresarial. ToroBox Guadalajara y Bucerías.",
  alternates: { canonical: "/faq" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export default function FAQPage() {
  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="bg-brand-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Preguntas Frecuentes</h1>
          <p className="text-xl text-gray-300">
            Resolvemos todas tus dudas sobre nuestro servicio de renta de mini bodegas.
          </p>
        </div>
      </div>

      <FaqClient />
    </div>
  );
}
