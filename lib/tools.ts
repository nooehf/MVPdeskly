import { buscarContactoHubspot, obtenerDealsHubspot } from './hubspot';
import { obtenerEventosCalendario } from './google-calendar';
import {
  obtenerResumenFinanciero,
  consultarFacturas,
  consultarCostesYGastos,
  consultarCarteraClientes,
  analizarRentabilidadCliente,
  agendarNuevoEventoCalendario,
  crearOActualizarContactoCRM,
  crearNuevoDealCRM,
  emitirNuevaFactura,
  consultarCatalogoProductos,
  consultarAlbaranesObra,
  registrarAlbaranObra,
  consultarNormativasRAG,
} from './services/business-service';

/**
 * Esquemas de herramientas (Function Declarations) para el modelo Gemini
 */
export const toolsConfig = [
  {
    functionDeclarations: [
      {
        name: 'agendarEventoCalendario',
        description:
          'Agenda y sincroniza una visita técnica, inspección de obra, reunión de replanteo o cita de seguimiento en Google Calendar.',
        parameters: {
          type: 'OBJECT',
          properties: {
            titulo: {
              type: 'STRING',
              description: 'Título o motivo de la visita/reunión (ej. "Visita de Replanteo Residencial Mirasierra", "Comité de Seguridad y Salud").',
            },
            inicio: {
              type: 'STRING',
              description: 'Fecha y hora de inicio en formato ISO 8601 (ej. "2025-05-20T10:00:00Z").',
            },
            fin: {
              type: 'STRING',
              description: 'Fecha y hora de finalización en formato ISO 8601 (opcional).',
            },
            asistentes: {
              type: 'ARRAY',
              items: { type: 'STRING' },
              description: 'Lista de correos o nombres de los técnicos, arquitectos o aparejadores participantes.',
            },
            descripcion: {
              type: 'STRING',
              description: 'Puntos a tratar, inspección de armaduras o actas de obra.',
            },
            ubicacion: {
              type: 'STRING',
              description: 'Ubicación o dirección de la obra (ej. "Calle de la Senda 42, Mirasierra").',
            },
          },
          required: ['titulo'],
        },
      },
      {
        name: 'obtenerEventosCalendario',
        description: 'Consulta los eventos, visitas de obra y reuniones de la agenda en Google Calendar para un rango de tiempo.',
        parameters: {
          type: 'OBJECT',
          properties: {
            timeMin: {
              type: 'STRING',
              description: 'Fecha y hora de inicio en formato ISO 8601 (ej. "2025-05-15T00:00:00Z").',
            },
            timeMax: {
              type: 'STRING',
              description: 'Fecha y hora de finalización en formato ISO 8601 (ej. "2025-05-15T23:59:59Z").',
            },
          },
        },
      },
      {
        name: 'procesarAlbaranObra',
        description:
          'Registra y procesa un albarán de entrega de materiales de obra (hormigón, ferralla, áridos, pladur, mortero, maquinaria), cotejando las cantidades e importes con el presupuesto asignado.',
        parameters: {
          type: 'OBJECT',
          properties: {
            numeroAlbaran: { type: 'STRING', description: 'Número del albarán (ej. "ALB-2025-8842").' },
            proveedor: { type: 'STRING', description: 'Nombre de la empresa proveedora de materiales.' },
            obraDestino: { type: 'STRING', description: 'Nombre de la obra o promoción de destino (ej. "Residencial Mirasierra").' },
            material: { type: 'STRING', description: 'Descripción del material recibido (ej. "Hormigón HA-25/B/20/IIa").' },
            cantidad: { type: 'STRING', description: 'Cantidad y unidad de medida (ej. "24 m³", "4.850 kg").' },
            importeTotal: { type: 'NUMBER', description: 'Importe total del albarán en Euros (€).' },
            firmadoPor: { type: 'STRING', description: 'Nombre del Encargado o Jefe de Obra que recibe el material.' },
            observaciones: { type: 'STRING', description: 'Notas técnicas, ensayos de probetas o control de descarga.' },
          },
          required: ['numeroAlbaran', 'proveedor', 'obraDestino', 'material', 'importeTotal'],
        },
      },
      {
        name: 'consultarAlbaranesObra',
        description:
          'Consulta los albaranes de entrega de materiales registrados en las obras activas, filtrando por obra, proveedor o estado de validación.',
        parameters: {
          type: 'OBJECT',
          properties: {
            obra: { type: 'STRING', description: 'Nombre de la obra a consultar (opcional).' },
            proveedor: { type: 'STRING', description: 'Nombre del proveedor a filtrar (opcional).' },
            estado: { type: 'STRING', description: 'Estado: "Recibido_Conforme", "Pendiente_Validacion" o "Con_Incidencia".' },
          },
        },
      },
      {
        name: 'emitirFactura',
        description: 'Genera y emite una nueva certificación o factura de obra con cálculo automático de base imponible e IVA (21% o 10%).',
        parameters: {
          type: 'OBJECT',
          properties: {
            nombreCliente: { type: 'STRING', description: 'Nombre de la promotora o cliente.' },
            baseImponible: { type: 'NUMBER', description: 'Importe neto de la certificación en Euros (€).' },
            concepto: { type: 'STRING', description: 'Concepto o capítulo de la certificación de obra.' },
            metodoPago: { type: 'STRING', description: 'Método de pago: "Transferencia Bancaria", "Domiciliación SEPA" o "Pagaré a 60 días".' },
          },
          required: ['nombreCliente', 'baseImponible', 'concepto'],
        },
      },
      {
        name: 'consultarResumenFinanciero',
        description:
          'Consulta el resumen financiero ejecutivo de la constructora: facturación mensual, volumen anual contratado (ARR), costes operativos de obra (maquinaria, cuadrillas, subcontratas), margen neto/bruto, EBITDA, tesorería disponible y certificaciones pendientes.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'consultarFacturas',
        description:
          'Consulta y filtra las certificaciones y facturas emitidas por estado (Pagada, Pendiente, Vencida) o nombre de la promotora/cliente.',
        parameters: {
          type: 'OBJECT',
          properties: {
            estado: {
              type: 'STRING',
              description: 'Filtrar por estado: "Pagada", "Pendiente", "Vencida" o "todas".',
            },
            cliente: {
              type: 'STRING',
              description: 'Nombre de la empresa o promotora (opcional).',
            },
            limite: {
              type: 'INTEGER',
              description: 'Número máximo de registros a retornar (por defecto 15).',
            },
          },
        },
      },
      {
        name: 'consultarCostesYGastos',
        description:
          'Consulta el desglose detallado de costes operativos de construcción: Nóminas y Cuadrillas, Maquinaria y Grúas, Materiales y Acopios, Subcontratas e Instalaciones, Seguridad PRL/Casetas y Software Técnico.',
        parameters: {
          type: 'OBJECT',
          properties: {
            categoria: {
              type: 'STRING',
              description:
                'Categoría de gasto a filtrar: "Nominas_y_Cuadrillas", "Maquinaria_y_Gruas", "Materiales_y_Acopios", "Subcontratas_e_Instalaciones", "Seguridad_PRL_y_Casetas", "Software_Tecnico_y_Licencias" o "todas".',
            },
          },
        },
      },
      {
        name: 'consultarCarteraClientes',
        description:
          'Consulta y busca en la cartera de clientes, promotoras inmobiliarias y cooperativas de la constructora.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'Término de búsqueda: nombre de la promotora, contacto, email o sector.',
            },
            estado: {
              type: 'STRING',
              description: 'Estado: "Activo", "En Riesgo", "Pausado", "En Onboarding" o "todos".',
            },
          },
        },
      },
      {
        name: 'analizarRentabilidadCliente',
        description:
          'Realiza un análisis de rentabilidad y seguimiento de una promoción o cliente promotor: certificaciones acumuladas, pagos, mora y estado de ejecución.',
        parameters: {
          type: 'OBJECT',
          properties: {
            identificador: {
              type: 'STRING',
              description: 'Nombre de la promotora o ID del cliente (ej. "Mirasierra", "cli-001").',
            },
          },
          required: ['identificador'],
        },
      },
      {
        name: 'consultarCatalogoProductos',
        description:
          'Consulta el cuadro de precios unitarios y partidas de obra (ej. aerotermia con suelo radiante, m³ hormigón armado, m² tabiquería pladur, m² fachada ventilada, solados porcelánicos), precios con IVA, margen y cuál es la partida más presupuestada.',
        parameters: {
          type: 'OBJECT',
          properties: {
            categoria: {
              type: 'STRING',
              description: 'Filtrar por capítulo o categoría (ej. "Instalaciones & Eficiencia Energética", "Estructuras y Cimentación", "Albañilería").',
            },
            soloMasVendidos: {
              type: 'BOOLEAN',
              description: 'Si es true, devuelve la partida más ejecutada o con mayor facturación.',
            },
            busqueda: {
              type: 'STRING',
              description: 'Término de búsqueda (ej. "aerotermia", "hormigon", "pladur", "porcelanico").',
            },
          },
        },
      },
      {
        name: 'consultarNormativasRAG',
        description:
          'Sistema RAG de la Constructora: Consulta las normativas internas, protocolos operativos (SOPs), pliegos técnicos, convenios y reglas de los 4 departamentos:\n1. ESTUDIO (Mediciones, presupuestos Presto/BC3, coeficientes de paso 15-22%, imprevistos 5%, SLA 5 días).\n2. OBRAS (Replanteo inicial, acopio, maquinaria, grúas preaviso 48h hormigón, homologación subcontratas REA y seguro RC 600.000€).\n3. PROYECTOS (Encargados de obra, partes diarios en tajo, certificaciones mensuales corte día 25, PRL, barandillas y arnés >2m).\n4. RRHH (Convenio de la Construcción 1.736h, jornada continua intensiva de verano 07:00-15:00, fichaje en caseta, tarjeta TPC y curso 20h PRL).',
        parameters: {
          type: 'OBJECT',
          properties: {
            consulta: {
              type: 'STRING',
              description: 'Pregunta o término a buscar en la base RAG (ej. "coeficiente margen estudio", "homologacion subcontratas REA", "corte certificaciones dia 25", "jornada intensiva verano calor", "tarjeta TPC 20 horas").',
            },
            departamento: {
              type: 'STRING',
              description: 'Filtrar por departamento: "estudio", "obras", "proyectos" o "rrhh".',
            },
            categoria: {
              type: 'STRING',
              description: 'Filtrar por categoría técnica (opcional).',
            },
          },
        },
      },
      {
        name: 'crearOActualizarContactoCRM',
        description: 'Crea o actualiza un contacto técnico o promotor en el CRM con su empresa, teléfono, email y cargo.',
        parameters: {
          type: 'OBJECT',
          properties: {
            nombreCompleto: { type: 'STRING', description: 'Nombre y apellido del contacto.' },
            email: { type: 'STRING', description: 'Correo electrónico.' },
            telefono: { type: 'STRING', description: 'Teléfono de contacto.' },
            empresa: { type: 'STRING', description: 'Empresa promotora o constructora.' },
            cargo: { type: 'STRING', description: 'Cargo (ej. "Director de Obras", "Arquitecto Técnico").' },
          },
          required: ['nombreCompleto', 'email'],
        },
      },
      {
        name: 'crearDealCRM',
        description: 'Registra una nueva licitación u oportunidad de obra en el pipeline comercial.',
        parameters: {
          type: 'OBJECT',
          properties: {
            nombreNegocio: { type: 'STRING', description: 'Nombre del proyecto u obra (ej. "Construcción 32 Viviendas en Boadilla").' },
            monto: { type: 'STRING', description: 'Presupuesto total estimado (ej. "€1.850.000").' },
            etapa: { type: 'STRING', description: 'Etapa (ej. "Estudio de Viabilidad", "Oferta Presentada", "Negociación").' },
          },
          required: ['nombreNegocio', 'monto'],
        },
      },
      {
        name: 'buscarContactoHubspot',
        description: 'Busca contactos y promotores en el CRM por nombre, apellido, correo electrónico o empresa.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'Término de búsqueda: nombre, apellido, correo o empresa.',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'obtenerDealsHubspot',
        description: 'Obtiene las licitaciones y proyectos en curso registrados en el pipeline.',
        parameters: {
          type: 'OBJECT',
          properties: {
            limit: {
              type: 'INTEGER',
              description: 'Cantidad máxima de negocios a consultar (por defecto 10).',
            },
          },
        },
      },
    ],
  },
];

/**
 * Ejecutor central de herramientas. Ejecuta la lógica correspondiente
 * y devuelve un objeto formateado para el contexto de FunctionResponse de Gemini.
 */
export async function executeToolCall(name: string, args: Record<string, any> = {}): Promise<any> {
  try {
    switch (name) {
      case 'agendarEventoCalendario': {
        const resultado = agendarNuevoEventoCalendario({
          titulo: args.titulo,
          inicio: args.inicio,
          fin: args.fin,
          descripcion: args.descripcion,
          asistentes: args.asistentes,
          ubicacion: args.ubicacion,
        });
        return resultado;
      }

      case 'procesarAlbaranObra': {
        return registrarAlbaranObra({
          numeroAlbaran: args.numeroAlbaran,
          proveedor: args.proveedor,
          obraDestino: args.obraDestino,
          material: args.material,
          cantidad: args.cantidad,
          importeTotal: Number(args.importeTotal) || 0,
          firmadoPor: args.firmadoPor,
          observaciones: args.observaciones,
        });
      }

      case 'consultarAlbaranesObra': {
        return consultarAlbaranesObra({
          obra: args.obra,
          proveedor: args.proveedor,
          estado: args.estado,
        });
      }

      case 'crearOActualizarContactoCRM': {
        return crearOActualizarContactoCRM({
          nombreCompleto: args.nombreCompleto,
          email: args.email,
          telefono: args.telefono,
          empresa: args.empresa,
          cargo: args.cargo,
        });
      }

      case 'crearDealCRM': {
        return crearNuevoDealCRM({
          nombreNegocio: args.nombreNegocio,
          monto: args.monto,
          etapa: args.etapa,
          pipeline: args.pipeline,
        });
      }

      case 'emitirFactura': {
        return emitirNuevaFactura({
          nombreCliente: args.nombreCliente,
          baseImponible: Number(args.baseImponible),
          concepto: args.concepto,
          metodoPago: args.metodoPago,
        });
      }

      case 'consultarResumenFinanciero': {
        const resumen = obtenerResumenFinanciero();
        return {
          resumenEjecutivo: resumen.resumenTexto,
          metricas: resumen.kpis,
          distribucionCostes: resumen.desglosePorCategorias,
        };
      }

      case 'consultarFacturas': {
        const resultado = consultarFacturas({
          estado: args.estado,
          cliente: args.cliente,
          limite: args.limite ? Number(args.limite) : 15,
        });
        return {
          totalFacturasEncontradas: resultado.totalFacturas,
          importeTotalFacturas: `€${resultado.importeTotal.toLocaleString('es-ES')}`,
          facturas: resultado.facturas,
        };
      }

      case 'consultarCostesYGastos': {
        const resultado = consultarCostesYGastos({
          categoria: args.categoria,
        });
        return {
          totalCostesMensuales: `€${resultado.totalMensual.toLocaleString('es-ES')}`,
          distribucionPorcentaje: resultado.distribucionPorcentaje,
          desgloseGastos: resultado.gastos,
        };
      }

      case 'consultarCarteraClientes': {
        const resultado = consultarCarteraClientes({
          query: args.query,
          estado: args.estado,
          plan: args.plan,
        });
        return {
          totalClientes: resultado.totalClientes,
          facturacionMediaCartera: `€${resultado.mrrTotalFiltrado.toLocaleString('es-ES')}`,
          clientes: resultado.clientes,
        };
      }

      case 'analizarRentabilidadCliente': {
        const identificador = args.identificador;
        if (!identificador) {
          return { error: 'Debe especificar el nombre o ID de la promotora/cliente a analizar.' };
        }
        return analizarRentabilidadCliente(identificador);
      }

      case 'consultarCatalogoProductos': {
        return consultarCatalogoProductos({
          categoria: args.categoria,
          soloMasVendidos: args.soloMasVendidos,
          busqueda: args.busqueda,
        });
      }

      case 'consultarNormativasRAG': {
        return consultarNormativasRAG({
          consulta: args.consulta,
          departamento: args.departamento,
          categoria: args.categoria,
        });
      }

      case 'buscarContactoHubspot': {
        const query = args.query;
        if (!query) {
          return { error: 'El parámetro "query" es obligatorio para buscar contactos.' };
        }
        const contactos = await buscarContactoHubspot(query);
        return {
          total: contactos.length,
          contactos: contactos.length > 0 ? contactos : 'No se encontraron contactos coincidentes.',
        };
      }

      case 'obtenerDealsHubspot': {
        const limit = args.limit ? Number(args.limit) : 10;
        const deals = await obtenerDealsHubspot(limit);
        return {
          total: deals.length,
          deals: deals.length > 0 ? deals : 'No hay licitaciones registradas actualmente.',
        };
      }

      case 'obtenerEventosCalendario': {
        const timeMin = args.timeMin;
        const timeMax = args.timeMax;
        const eventos = await obtenerEventosCalendario(timeMin, timeMax);
        return {
          total: eventos.length,
          eventos: eventos.length > 0 ? eventos : 'No se encontraron visitas técnicas en el período solicitado.',
        };
      }

      default:
        return { error: `La herramienta "${name}" no está reconocida.` };
    }
  } catch (error: any) {
    return {
      error: `Error al ejecutar ${name}: ${error?.message || 'Error desconocido'}`,
    };
  }
}
