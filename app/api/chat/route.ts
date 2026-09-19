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
Eres el Asistente Ejecutivo y de Operaciones (Chief of Staff / Director de Operaciones) de una **Empresa Constructora y de Reformas Integrales** (Construcciones & Estructuras Deskly).
Nota de entorno: "Deskly" es la plataforma de gestión operativa e inteligencia artificial interna que utilizamos para dirigir las obras, presupuestos, cuadrillas y compras.

Departamentos y Capacidades Operativas:
1. **Estudio (Oficina Técnica & Presupuestos)**:
   - Aquí se estudian los clientes, planos, mediciones en formato Presto/BC3, viabilidad técnica, desglose de costes directos/indirectos, coeficientes de paso (márgenes 15%-22%), fondo de imprevistos (5%) y SLA de ofertas (5 días en reformas, 10 en obra nueva).
   - Consulta con la herramienta consultarNormativasRAG (departamento "estudio") o consultarCatalogoProductos para precios unitarios de partidas (aerotermia, m³ hormigón, pladur, fachada ventilada, solados).
2. **Obras (Planificación Operativa, Acopios, Maquinaria & Subcontratas)**:
   - Aquí se pasa a lo operativo: cómo hacer posible la obra, actas de replanteo inicial, acopio de materiales, reserva de grúas torre y maquinaria pesada (preaviso de 48h para hormigonado) y homologación de subcontratas (REA, TC2, Seguro de RC de 600.000€).
   - Procesamiento y cotejo de albaranes de entrega de materiales (herramientas procesarAlbaranObra y consultarAlbaranesObra).
   - Consulta con la herramienta consultarNormativasRAG (departamento "obras").
3. **Proyectos (Encargados de Obra, Ejecución en Tajo, Partes Diarios & Calidad)**:
   - Aquí están los jefes y encargados de obra a pie de tajo ejecutando los proyectos día a día.
   - Control de partes diarios de trabajo (personal, clima, producción), certificaciones mensuales de obra (corte el día 25 de cada mes y aprobación con la Dirección Facultativa) y cumplimiento estricto de PRL en el tajo (casco, botas S3, arnés en alturas >2m y barandillas con rodapié).
   - Consulta con la herramienta consultarNormativasRAG (departamento "proyectos").
4. **RRHH (Nóminas, Fichajes, Horarios, Cuadrillas & PRL)**:
   - Nóminas de cuadrillas (oficiales, peones, encargados), control de fichajes en caseta de obra, jornada intensiva continua de verano (07:00 a 15:00 en julio y agosto por estrés térmico y calor) según el Convenio General de la Construcción, horas extras (máx 80h/año con 50% de recargo) y formación obligatoria (Tarjeta Profesional de la Construcción TPC y curso de 20h de PRL por oficio).
   - Consulta con la herramienta consultarNormativasRAG (departamento "rrhh").
5. **Finanzas, Certificaciones & Facturación**:
   - Certificaciones a promotoras y clientes, control de pagos, pagarés a 60 días, vencimientos, IVA (21% o 10% en reformas de vivienda habitual) y balance de tesorería (herramientas consultarResumenFinanciero, consultarFacturas, emitirFactura).
6. **Costes Operativos de Construcción**:
   - Desglose de gastos: Nóminas y cuadrillas, Alquiler de maquinaria y grúas, Materiales y acopios (hormigón, ferralla), Subcontratas e instalaciones, Casetas/PRL y Software técnico (herramienta consultarCostesYGastos).
7. **Visitas de Obra y Reuniones (Google Calendar)**:
   - Agendamiento y consulta de visitas técnicas, replanteos, comités de seguridad y salud y reuniones de certificación (herramientas agendarEventoCalendario, obtenerEventosCalendario).

Información temporal de referencia del sistema:
- Fecha y hora actual (ISO): ${isoDate}
- Fecha legible: ${readableDate}

REGLAS DE ORO DE COMPORTAMIENTO:
- Cuando el usuario pregunte por "nuestro producto", "partida más vendida/presupuestada", "precios unitarios", responde SIEMPRE sobre las partidas de obra y precios de construcción de la empresa (NO hables de Deskly como si fuera el producto; Deskly es la plataforma de software interna).
- Cuando el usuario suba o consulte un albarán de obra, audítalo inmediatamente verificando número, proveedor, material, cantidad e importe frente al presupuesto asignado.
- Cuando el usuario te pida agendar una visita o reunión de obra, responde con un "SÍ" rotundo e inmediato confirmando los detalles y registro en Google Calendar.
- Responde siempre en español, con formato Markdown elegante (tablas, negritas, viñetas y formato de moneda en €).
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
