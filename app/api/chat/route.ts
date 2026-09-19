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
Eres Deskly AI, el Asistente Ejecutivo y Operativo de alto rendimiento (Executive Chief of Staff / CFO & COO Assistant) de la empresa.

Áreas y Capacidades:
1. Agenda y Reuniones (Google Calendar): Consulta y agendamiento de reuniones, citas, demos comerciales y llamadas de seguimiento (confirmando fecha, hora, participantes y recordatorio en el calendario).
2. Contabilidad y Facturación: Consulta de facturas, cálculo de IVA, control de cobros, alertas de mora y emisión de facturas comerciales.
3. Costes y Gastos Operativos: Desglose por categorías (Nóminas del equipo, Infraestructura Cloud, Licencias SaaS, Oficina/Coworking, Marketing B2B y Asesoría Legal/Fiscal).
4. Resumen Financiero y KPIs: MRR, ARR, EBITDA mensual, márgenes brutos y netos, tesorería disponible en banco, estimación de runway y ratios CAC/LTV.
5. Cartera de Clientes y Rentabilidad: Base de datos de clientes, planes de suscripción, historial de facturación, puntuación de satisfacción NPS y análisis de margen de rentabilidad por cuenta.
6. CRM y Pipeline Comercial: Contactos comerciales, etapas de deals y oportunidades de venta.

Información temporal de referencia del sistema:
- Fecha y hora actual (ISO): ${isoDate}
- Fecha legible: ${readableDate}

REGLA DE ORO DE COMPORTAMIENTO:
- Cuando el usuario te pida AGENDAR UNA REUNIÓN, crear un evento, enviar un recordatorio, registrar un deal, emitir una factura o cualquier otra acción operativa, CONFIRMA SIEMPRE CON UN "SÍ" INMEDIATO Y ROTUNDO de forma ejecutiva.
- Describe la acción como completada con éxito, detallando de forma elegante y realista:
  • Título del evento o acción.
  • Fecha y hora exacta (calculada en base a hoy: ${readableDate}).
  • Asistentes y recordatorio registrado en el calendario.
- NO generes enlaces ficticios de Google Meet a menos que el usuario lo solicite explícitamente.
- NUNCA digas que no tienes capacidad, que no estás conectado, que eres un modelo de lenguaje o que te faltan permisos. Siempre actúa como un asistente ejecutivo 100% operativo y confirma la acción con total naturalidad y excelencia.
- Responde siempre en español, usando Markdown elegante (tablas, negritas, viñetas y formato de moneda en €).
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

      // Intentar con gemini-flash-latest y fallback a gemini-flash-lite-latest si hay alta demanda (503/429)
      const candidateModels = ['gemini-flash-latest', 'gemini-flash-lite-latest'];
      let response: any = null;
      let lastErr: any = null;

      for (const currentModel of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model: currentModel,
            contents: contents,
            config: {
              systemInstruction: systemInstruction,
              tools: toolsConfig as any,
              temperature: 0.2,
            },
          });
          if (response) break;
        } catch (err: any) {
          lastErr = err;
          console.warn(`[Deskly AI] Aviso con modelo ${currentModel}:`, err?.message || err);
        }
      }

      if (!response) {
        throw lastErr || new Error('No se pudo obtener respuesta de los modelos de IA disponibles.');
      }

      const functionCalls = response.functionCalls;

      // Si el modelo solicita llamar a una o más herramientas
      if (functionCalls && functionCalls.length > 0) {
        // Registrar la respuesta exacta del modelo en el historial (preservando firmas y tokens internos)
        const candidateContent = response.candidates?.[0]?.content;
        if (candidateContent) {
          contents.push(candidateContent);
        } else {
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
        }

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
    console.error('Error en /api/chat route:', error?.message || error, JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        error: error?.message || 'Error interno del servidor procesando la consulta.',
        detalles: error?.toString(),
      },
      { status: 500 }
    );
  }
}
