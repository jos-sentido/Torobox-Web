import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';

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

const responseSchema = z.object({
  summary: z.string().describe('Resumen breve de 1-2 oraciones sobre el acomodo'),
  canOptimize: z.boolean().describe('true si el acomodo puede mejorarse significativamente'),
  itemsToRemove: z.array(z.string()).describe('Nombres de objetos que se recomienda quitar si no caben. Array vacío si todo cabe.'),
});

export async function POST(req: Request) {
  try {
    const { items, unit }: { items: ItemDescription[]; unit: Unit } = await req.json();

    if (!items || items.length === 0) {
      return Response.json({
        summary: 'Agrega objetos a la bodega para analizarlos.',
        canOptimize: false,
        itemsToRemove: [],
      });
    }

    const itemList = items
      .map(item => `- ${item.typeName} (z: ${item.z.toFixed(2)}m, sobre: ${item.stackedOnName}${item.stackingError ? ' ⚠️ INVÁLIDO' : ''})`)
      .join('\n');

    const prompt = `Eres "Constractor AI", experto en almacenamiento en mini bodegas.
Bodega: ${unit.width}m × ${unit.length}m × ${unit.height}m (${(unit.width * unit.length).toFixed(1)}m² de piso, ${(unit.width * unit.length * unit.height).toFixed(1)}m³ de volumen).

Objetos:
${itemList}

Analiza brevemente: ¿el acomodo es seguro y eficiente? Si hay apilamientos inválidos, menciónalo.
Si hay demasiados objetos para el espacio, indica cuáles quitar (los menos prioritarios primero: bicicletas, sillas sueltas, etc.).
Sé MUY breve: máximo 2 oraciones cortas para el resumen.`;

    const result = await generateObject({
      model: anthropic('claude-haiku-4-5-20251001'),
      prompt,
      schema: responseSchema,
    });

    return Response.json(result.object);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('calculadora-ai error:', msg);
    return Response.json(
      { summary: 'Error al analizar. Intenta de nuevo.', canOptimize: false, itemsToRemove: [] },
      { status: 500 },
    );
  }
}
