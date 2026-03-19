"use client";

import { useState } from "react";
import Button from "@/components/Button";

export default function FAQPage() {
  const faqs = [
    { q: "¿Necesito contrato mínimo?", a: "No, en ToroBox ofrecemos esquemas flexibles de arrendamiento mensual. Puedes rentar tu mini bodega por el tiempo que realmente la necesites, desde un mes hasta plazos anuales." },
    { q: "¿Puedo cambiar de tamaño?", a: "¡Absolutamente! Si tus necesidades cambian, puedes hacer un upgrade o downgrade de tu espacio de almacenamiento sujeto a disponibilidad, sin penalizaciones abusivas." },
    { q: "¿Puedo acceder todos los días?", a: "Nuestras instalaciones operan con amplios horarios e incluso acceso 24/7 en sucursales seleccionadas para que siempre puedas disponer de tus pertenencias o inventarios." },
    { q: "¿Qué seguridad tienen las bodegas?", a: "Contamos con sistemas de circuito cerrado de TV (CCTV) monitoreando las 24 horas, personal de seguridad calificado, control de accesos estricto y excelente iluminación en pasillos." },
    { q: "¿Puedo contratar como empresa?", a: "Sí, emitimos facturas fiscales y contamos con esquemas especiales ideales para inventarios comerciales, archivo muerto de notarías, corporativos y equipos." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <div className="bg-brand-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Preguntas Frecuentes</h1>
          <p className="text-xl text-gray-300">
            Resolvemos todas tus dudas sobre nuestro servicio de renta de mini bodegas.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-10">
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200">
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className={`w-full text-left px-6 py-5 focus:outline-none flex justify-between items-center ${isOpen ? 'bg-red-50' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <span className={`font-bold text-lg ${isOpen ? 'text-brand-red' : 'text-brand-black'}`}>{faq.q}</span>
                    <span className={`ml-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-red' : 'text-gray-400'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </span>
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 py-5 opacity-100 bg-white' : 'max-h-0 py-0 opacity-0'}`}
                  >
                    <p className="text-gray-600 leading-relaxed text-base">{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-8 bg-gray-50 rounded-xl text-center border border-gray-200">
            <h3 className="text-xl font-bold mb-3 text-brand-black">¿Tienes alguna otra duda?</h3>
            <p className="text-gray-600 mb-6">Nuestro equipo de atención al cliente está listo para escucharte.</p>
            <Button href="/contacto" variant="primary">Contáctanos directamente</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
