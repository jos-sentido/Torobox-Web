"use client";

import { useChat } from "@ai-sdk/react";
import { type UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";

const SUGGESTED_QUESTIONS: Record<string, { label: string; question: string }[]> = {
  "/": [
    { label: "¿Qué tamaños de bodega tienen?", question: "¿Qué tamaños de bodega manejan y para qué sirve cada uno?" },
    { label: "¿Qué incluye la renta?", question: "¿Qué beneficios están incluidos sin costo extra al rentar una bodega?" },
    { label: "¿Dónde están ubicados?", question: "¿En qué ciudades y zonas tienen sucursales?" },
  ],
  "/soluciones": [
    { label: "¿Cómo funciona la bodega con oficina?", question: "¿Cómo funciona la bodega con oficina integrada? ¿Qué incluye?" },
    { label: "¿Tienen pensión vehicular?", question: "¿Ofrecen servicio de pensión o resguardo vehicular? ¿Qué tipo de vehículos aceptan?" },
    { label: "¿Cuánto cuesta una bodega con oficina?", question: "¿Cuál es el precio de una bodega con oficina integrada?" },
  ],
  "/sucursales": [
    { label: "¿Cuál sucursal me queda más cerca?", question: "¿Cuáles son las direcciones exactas de todas las sucursales?" },
    { label: "¿Qué diferencia hay entre sucursales?", question: "¿Qué diferencia hay entre las sucursales? ¿Cuál es la mejor opción?" },
    { label: "¿Cuáles son los teléfonos de contacto?", question: "¿Cuáles son los teléfonos y correos de cada sucursal?" },
  ],
  "/sucursales/av-vallarta": [
    { label: "¿Qué precios maneja Av. Vallarta?", question: "¿Cuáles son los precios de las bodegas en la sucursal Av. Vallarta?" },
    { label: "¿Qué servicios tiene esta sucursal?", question: "¿Qué servicios y características tiene la sucursal Av. Vallarta?" },
    { label: "¿Cómo llego a Av. Vallarta?", question: "¿Cuál es la dirección exacta de la sucursal Av. Vallarta?" },
  ],
  "/sucursales/zona-real": [
    { label: "¿Qué precios maneja Zona Real?", question: "¿Cuáles son los precios de las bodegas en la sucursal Zona Real?" },
    { label: "¿Por qué es la sucursal Premium?", question: "¿Qué tiene de especial la sucursal Zona Real que la hace Premium?" },
    { label: "¿Tienen montacargas disponible?", question: "¿La sucursal Zona Real cuenta con montacargas y apoyo logístico?" },
  ],
  "/sucursales/punto-sur": [
    { label: "¿Qué precios maneja Punto Sur?", question: "¿Cuáles son los precios de las bodegas en la sucursal Punto Sur?" },
    { label: "¿Tienen pensión vehicular aquí?", question: "¿La sucursal Punto Sur ofrece pensión vehicular? ¿Cómo funciona?" },
    { label: "¿Tienen app de acceso?", question: "¿Cómo funciona la app de control de acceso en Punto Sur?" },
  ],
  "/sucursales/bucerias": [
    { label: "¿Qué precios maneja Bucerías?", question: "¿Cuáles son los precios de las bodegas en la sucursal Bucerías?" },
    { label: "¿Puedo guardar mi lancha ahí?", question: "¿Puedo guardar lanchas, motos o vehículos recreativos en Bucerías?" },
    { label: "¿Tienen control de humedad?", question: "¿Cómo manejan la humedad y el salitre en la sucursal de Bucerías?" },
  ],
  "/calculadora": [
    { label: "¿Cómo funciona la calculadora?", question: "¿Cómo funciona la calculadora de espacio? ¿Cómo la uso?" },
    { label: "¿Qué bodega necesito para una mudanza?", question: "Me voy a mudar de un departamento de 2 recámaras, ¿qué tamaño de bodega necesito?" },
    { label: "¿Puedo guardar muebles y cajas juntos?", question: "¿Puedo guardar muebles grandes y cajas en la misma bodega? ¿Cómo optimizo el espacio?" },
  ],
  "/faq": [
    { label: "¿Puedo rentar solo un mes?", question: "¿Puedo rentar una bodega solo por un mes o necesito contrato largo?" },
    { label: "¿Qué documentos necesito?", question: "¿Qué documentos necesito para contratar una bodega?" },
    { label: "¿Tienen descuentos por pago anual?", question: "¿Qué descuentos ofrecen si pago por varios meses por adelantado?" },
  ],
  "/contacto": [
    { label: "¿Cómo puedo contratar?", question: "¿Cuál es el proceso para contratar una bodega paso a paso?" },
    { label: "¿Atienden por WhatsApp?", question: "¿Puedo contactarlos por WhatsApp? ¿Cuál es el número?" },
    { label: "¿Cuánto tarda el proceso?", question: "¿Cuánto tiempo tarda todo el proceso desde que contacto hasta que puedo usar la bodega?" },
  ],
  "/como-contratar": [
    { label: "¿Qué identificación aceptan?", question: "¿Qué tipo de identificación oficial aceptan para contratar?" },
    { label: "¿Puedo contratar como empresa?", question: "¿Puedo contratar como persona moral? ¿Facturan?" },
    { label: "¿El contrato tiene penalización?", question: "¿El contrato tiene penalización si quiero cancelar antes de tiempo?" },
  ],
  "/que-puedes-guardar": [
    { label: "¿Puedo guardar electrodomésticos?", question: "¿Puedo guardar electrodomésticos como refrigeradores o lavadoras en la bodega?" },
    { label: "¿Aceptan inventario de negocio?", question: "¿Puedo guardar inventario de mi tienda en línea o e-commerce?" },
    { label: "¿Guardan archivo muerto?", question: "¿Ofrecen servicio para guardar archivo muerto de empresas o notarías?" },
  ],
  "/articulos-no-permitidos": [
    { label: "¿Puedo guardar pintura?", question: "¿Puedo guardar latas de pintura o solventes en mi bodega?" },
    { label: "¿Puedo guardar alimentos?", question: "¿Se permite guardar alimentos enlatados o no perecederos?" },
    { label: "¿Por qué hay restricciones?", question: "¿Por qué existen restricciones sobre lo que se puede guardar?" },
  ],
};

function getSuggestedQuestions(pathname: string) {
  // Exact match first
  if (SUGGESTED_QUESTIONS[pathname]) return SUGGESTED_QUESTIONS[pathname];
  // Default
  return SUGGESTED_QUESTIONS["/"];
}

const WHATSAPP_SUCURSALES = [
  { nombre: "Av. Vallarta", numero: "5213331154351" },
  { nombre: "Zona Real", numero: "5213331312164" },
  { nombre: "Punto Sur", numero: "5213332582636" },
  { nombre: "Bucerías", numero: "523225100051" },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === "streaming" || status === "submitted";
  const pathname = usePathname();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    await sendMessage({ text });
  };

  const handleSuggestion = async (question: string) => {
    if (isLoading) return;
    await sendMessage({ text: question });
  };

  const suggestions = getSuggestedQuestions(pathname);
  const showSuggestions = messages.length === 0;

  const whatsappMessage = encodeURIComponent("Hola, me interesa rentar una mini bodega en ToroBox. ¿Me pueden dar más información?");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Selector de sucursales para WhatsApp */}
      {isWhatsAppOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-64 animate-in slide-in-from-bottom-3 fade-in duration-200">
          <p className="text-sm font-bold text-brand-black mb-3">¿A qué sucursal deseas escribir?</p>
          <div className="flex flex-col gap-2">
            {WHATSAPP_SUCURSALES.map((suc) => (
              <a
                key={suc.numero}
                href={`https://wa.me/${suc.numero}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsWhatsAppOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 border border-gray-100 hover:border-green-200 transition-colors text-sm text-gray-700 font-medium"
              >
                <span className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </span>
                {suc.nombre}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Botón de WhatsApp */}
      <button
        onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
        className="bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-[#1da851] transition-transform hover:scale-105 active:scale-95"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>

      {/* Botón flotante para abrir/cerrar chatbot */}
      <button
        onClick={() => { setIsOpen(!isOpen); setIsWhatsAppOpen(false); }}
        className="bg-brand-red text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-brand-red-hover transition-transform hover:scale-105 active:scale-95 z-50 relative"
        aria-label="Abrir chat de ToroBox"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="fixed inset-4 sm:inset-auto sm:absolute sm:bottom-20 sm:right-0 sm:w-[32rem] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 sm:h-[42rem] sm:max-h-[90vh] z-50">

          {/* Header */}
          <div className="bg-brand-black text-white p-4 flex items-center gap-3">
            <img
              src="/logos/perfil_f.jpg"
              alt="ToroBox"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold text-lg leading-tight">Asistente ToroBox</h3>
              <p className="text-xs text-gray-300">Responde al instante con IA</p>
            </div>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">

            {/* Mensaje de bienvenida inicial */}
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border-gray-200 border rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] text-sm shadow-sm">
                ¡Hola! 👋 Soy el asistente virtual de ToroBox. ¿En qué te puedo ayudar hoy?
              </div>
            </div>

            {/* Preguntas sugeridas — solo si no hay mensajes aún */}
            {showSuggestions && (
              <div className="flex flex-col gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(s.question)}
                    disabled={isLoading}
                    className="text-left text-xs bg-white border border-indigo-200 text-indigo-700 rounded-xl px-3 py-2 hover:bg-indigo-50 hover:border-indigo-300 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m: UIMessage) => {
              const text = m.parts
                .filter((p) => p.type === "text")
                .map((p) => (p as { type: "text"; text: string }).text)
                .join("");
              return (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                      m.role === "user"
                        ? "bg-brand-red text-white rounded-tr-sm"
                        : "bg-white text-gray-800 border-gray-200 border rounded-tl-sm"
                    }`}
                  >
                    <div className="prose prose-sm prose-p:leading-relaxed prose-pre:bg-transparent prose-pre:p-0">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Animación de "escribiendo" */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border-gray-200 border rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] text-sm shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de entrada */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:bg-white transition-colors"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-brand-black hover:bg-black text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
            <div className="text-[10px] text-center text-gray-400 mt-2">
              ToroBox AI puede cometer errores. Verifica información importante.
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
