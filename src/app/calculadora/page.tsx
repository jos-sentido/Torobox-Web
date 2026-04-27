import type { Metadata } from 'next';
import CalculadoraClient from './CalculadoraClient';

export const metadata: Metadata = {
  title: 'Calculadora de Espacio - ToroBox',
  description: 'Simula el espacio de tu mini bodega. Arrastra objetos en el canvas 2D y descubre qué tamaño de bodega necesitas.',
  alternates: { canonical: '/calculadora' },
};

export default function CalculadoraPage() {
  return <CalculadoraClient />;
}
