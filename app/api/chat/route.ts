import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';
import { toolsConfig, executeToolCall } from '@/lib/tools';

export const runtime = 'nodejs';
export const maxDuration = 60; // Hasta 60s en serverless functions de Vercel

interface IncomingMessage {
  role: 'user' | 'model';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], currentMessage } = body as {
      messages: IncomingMessage[];
      currentMessage?: string;
    };

    if (!currentMessage && messages.length === 0) {
      return NextResponse.json(
        { error: 'Debe proporcionar al menos un mensaje.' },
        { status: 400 }
      );
    }

    const ai = getGeminiClient();

    // Inyectar fecha y hora actual para consultas contextuales (ej. "¿qué tengo hoy?", "¿qué reuniones tengo mañana?")
    const now = new Date();
    const isoDate = now.toISOString();
    const readableDate = now.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    const systemInstruction = `
Eres Deskly AI, un Asistente Operativo, Financiero y Ejecutivo de alto rendimiento (Executive Chief of Staff / CFO & COO Assistant) con acceso directo en tiempo real a todas las operaciones y finanzas del negocio:

Áreas y Capacidades Disponibles:
1. Contabilidad y Facturación: Consulta de facturas emitidas, desglose de importes e IVA, control de cobros pendientes y detección de facturas vencidas (mora).
2. Costes y Gastos Operativos: Desglose por categorías (Nóminas del equipo, Infraestructura Cloud, Licencias SaaS, Oficina/Coworking, Marketing B2B y Asesoría Legal/Fiscal).
3. Resumen Financiero y KPIs: MRR, ARR, EBITDA mensual, márgenes brutos y netos, tesorería disponible en banco, estimación de runway y ratios CAC/LTV.
4. Cartera de Clientes y Rentabilidad: Base de datos de clientes, planes de suscripción, historial de facturación, puntuación de satisfacción NPS y análisis de margen de rentabilidad por cuenta.
5. Agenda y Reuniones: Google Calendar en tiempo real (citas, demos con clientes, comités).
6. CRM y Pipeline Comercial: Búsqueda de contactos, etapas del ciclo de vida y deals/oportunidades de venta.

Información temporal de referencia del sistema:
- Fecha y hora actual (ISO): ${isoDate}
- Fecha legible: ${readableDate}

Instrucciones de comportamiento:
- Cuando el usuario pregunte por finanzas, facturas, costes, clientes, rentabilidad, agenda o CRM, utiliza SIEMPRE las herramientas correspondientes mediante Function Calling para obtener datos precisos y actualizados.
- Si el usuario menciona "hoy", "mañana", "este mes", "esta semana" o fechas relativas, calcula los rangos temporales adecuados.
- Presenta las respuestas de forma sumamente ejecutiva, elegante y clara con Markdown (usando tablas comparativas, listas con viñetas, formato de moneda en € con separadores de miles y negritas estratégicas).
- Si detectas riesgos (ej. facturas vencidas, clientes en riesgo o costes disparados), proporciona alertas proactivas y recomendaciones estratégicas.
- Responde siempre en español con un tono profesional, ágil y servicial.
`;

    // Preparar el historial de contenidos para el SDK
    const contents: any[] = [];

    // Historial previo
    for (const msg of messages) {
      contents.push({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }

    // Agregar el mensaje actual si viene separado
    if (currentMessage) {
      contents.push({
        role: 'user',
        parts: [{ text: currentMessage }],
      });
    }

    // Bucle de resolución de Function Calling (máximo 5 iteraciones de seguridad)
    let maxToolIterations = 5;
    let finalAnswer = '';
    const executedToolLogs: Array<{ tool: string; args: any; result: any }> = [];

    while (maxToolIterations > 0) {
      maxToolIterations--;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          tools: toolsConfig as any,
          temperature: 0.2,
        },
      });

      const functionCalls = response.functionCalls;

      // Si el modelo solicita llamar a una o más herramientas
      if (functionCalls && functionCalls.length > 0) {
        // Registrar la respuesta del modelo con las llamadas a funciones en el historial
        const modelParts: any[] = [];
        for (const call of functionCalls) {
          modelParts.push({
            functionCall: {
              name: call.name,
              args: call.args || {},
            },
          });
        }
        contents.push({
          role: 'model',
          parts: modelParts,
        });

        // Ejecutar las herramientas solicitadas y registrar las respuestas
        const toolResponseParts: any[] = [];
        for (const call of functionCalls) {
          const fnName = call.name || '';
          if (!fnName) continue;

          const fnArgs = (call.args as Record<string, any>) || {};

          const executionResult = await executeToolCall(fnName, fnArgs);

          executedToolLogs.push({
            tool: fnName,
            args: fnArgs,
            result: executionResult,
          });

          toolResponseParts.push({
            functionResponse: {
              name: fnName,
              response: { result: executionResult },
            },
          });
        }

        // Agregar las respuestas de las herramientas al historial como turno 'user'
        contents.push({
          role: 'user',
          parts: toolResponseParts,
        });

        // El loop continuará para que Gemini reciba la respuesta de las herramientas y formule la respuesta textual final
      } else {
        // No hay más llamadas a herramientas, obtuvimos la respuesta textual final
        finalAnswer = response.text || 'Sin respuesta textual del modelo.';
        break;
      }
    }

    if (!finalAnswer && maxToolIterations === 0) {
      finalAnswer = 'Se excedió el límite de llamadas consecutivas a herramientas sin respuesta final.';
    }

    return NextResponse.json({
      role: 'model',
      content: finalAnswer,
      toolLogs: executedToolLogs,
    });
  } catch (error: any) {
    console.error('Error en /api/chat route:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Ocurrió un error inesperado al procesar la solicitud.',
      },
      { status: 500 }
    );
  }
}
