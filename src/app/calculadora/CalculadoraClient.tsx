'use client';

import dynamic from 'next/dynamic';

const CalculadoraApp = dynamic(
  () => import('@/components/calculadora/CalculadoraApp'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[calc(100dvh-5rem)] bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Cargando simulador...</p>
        </div>
      </div>
    ),
  }
);

export default function CalculadoraClient() {
  return <CalculadoraApp />;
}
