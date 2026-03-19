import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

interface ItemDescription {
  typeName: string;
  z: number;
  stackedOnName: string;
  stackingError: boolean;
}

interface Unit {
  width: number;
  length: number;
  height: number;
}

export async function POST(req: Request) {
  const { items, unit }: { items: ItemDescription[]; unit: Unit } = await req.json();

  if (!items || items.length === 0) {
    return Response.json({ feedback: 'Agrega objetos a la bodega para analizarlos.' });
  }

  const itemList = items
    .map(item => `- ${item.typeName} (altura en pila: ${item.z.toFixed(2)}m, apilado sobre: ${item.stackedOnName}${item.stackingError ? ' ⚠️ APILAMIENTO INVÁLIDO' : ''})`)
    .join('\n');

  const prompt = `Eres "Constractor AI", un experto en logística y almacenamiento en mini bodegas.
Analiza el siguiente acomodo de objetos en una mini bodega de ${unit.width}m × ${unit.length}m × ${unit.height}m.

Objetos almacenados:
${itemList}

Evalúa si el acomodo es lógico, seguro y eficiente en la vida real.
Considera el peso, fragilidad y forma de los objetos (p. ej. no se debe poner un refrigerador sobre una cama).
Si hay errores de apilamiento marcados, indícalos claramente.
Si el acomodo es bueno, da un consejo práctico para optimizar el espacio.
Responde en español. Sé breve y directo (máximo 3 párrafos cortos).`;

  const result = await generateText({
    model: openai('gpt-4o-mini'),
    prompt,
  });

  return Response.json({ feedback: result.text });
}
