"use client";

import { useChat } from "@ai-sdk/react";
import { type UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === "streaming" || status === "submitted";

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

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Botón flotante para abrir/cerrar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 h-[30rem] max-h-[80vh]">

          {/* Header */}
          <div className="bg-brand-black text-white p-4 flex items-center gap-3">
            <div className="bg-brand-red w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">
              T
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Asistente ToroBox</h3>
              <p className="text-xs text-gray-300">Responde al instante con IA</p>
            </div>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">

            {/* Mensaje de bienvenida inicial (hardcodeado por UX) */}
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border-gray-200 border rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] text-sm shadow-sm">
                ¡Hola! 👋 Soy el asistente virtual de ToroBox. ¿En qué te puedo ayudar hoy? (Precios, ubicaciones, tamaños...)
              </div>
            </div>

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

            {/* Div invisible para hacer scroll automático al final */}
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
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            <div className="text-[10px] text-center text-gray-400 mt-2">
              ToroBox AI puede cometer errores. Considera verificar la información importante.
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
