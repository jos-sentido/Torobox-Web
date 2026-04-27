"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { PiCaretDownDuotone } from "react-icons/pi";
import { faqs } from "./faqs";

export default function FaqClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
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
                    <PiCaretDownDuotone className="w-6 h-6" />
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
  );
}
