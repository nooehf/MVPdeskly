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
          'Agenda, programa y sincroniza una nueva reunión, cita o evento en el calendario de Google Calendar con los detalles de confirmación.',
        parameters: {
          type: 'OBJECT',
          properties: {
            titulo: {
              type: 'STRING',
              description: 'Título o motivo de la reunión (ej. "Demo Comercial con Fintech Solutions", "Revisión Q3").',
            },
            inicio: {
              type: 'STRING',
              description: 'Fecha y hora de inicio en formato ISO 8601 o fecha descriptiva (ej. "2025-05-20T10:00:00Z").',
            },
            fin: {
              type: 'STRING',
              description: 'Fecha y hora de finalización en formato ISO 8601 (opcional, por defecto 45 minutos después).',
            },
            asistentes: {
              type: 'ARRAY',
              items: { type: 'STRING' },
              description: 'Lista de correos o nombres de los participantes que asistirán.',
            },
            descripcion: {
              type: 'STRING',
              description: 'Orden del día o detalles adicionales de la sesión.',
            },
            ubicacion: {
              type: 'STRING',
              description: 'Ubicación o canal de la reunión (opcional).',
            },
          },
          required: ['titulo'],
        },
      },
      {
        name: 'obtenerEventosCalendario',
        description: 'Consulta los eventos, reuniones y citas de la agenda en Google Calendar para un rango de tiempo.',
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
        name: 'crearOActualizarContactoCRM',
        description: 'Crea o actualiza un contacto comercial en el CRM con su empresa, teléfono, email y estado.',
        parameters: {
          type: 'OBJECT',
          properties: {
            nombreCompleto: { type: 'STRING', description: 'Nombre y apellido del contacto.' },
            email: { type: 'STRING', description: 'Correo electrónico.' },
            telefono: { type: 'STRING', description: 'Teléfono de contacto.' },
            empresa: { type: 'STRING', description: 'Empresa a la que pertenece.' },
            cargo: { type: 'STRING', description: 'Cargo o posición del contacto.' },
          },
          required: ['nombreCompleto', 'email'],
        },
      },
      {
        name: 'crearDealCRM',
        description: 'Registra una nueva oportunidad comercial o deal en el pipeline de ventas.',
        parameters: {
          type: 'OBJECT',
          properties: {
            nombreNegocio: { type: 'STRING', description: 'Nombre del deal u oportunidad.' },
            monto: { type: 'STRING', description: 'Importe económico del negocio (ej. "€25.000").' },
            etapa: { type: 'STRING', description: 'Etapa del embudo comercial (ej. "Propuesta Enviada", "Negociación").' },
          },
          required: ['nombreNegocio', 'monto'],
        },
      },
      {
        name: 'emitirFactura',
        description: 'Genera y emite una nueva factura comercial con cálculo automático de base imponible e IVA (21%).',
        parameters: {
          type: 'OBJECT',
          properties: {
            nombreCliente: { type: 'STRING', description: 'Nombre de la empresa cliente.' },
            baseImponible: { type: 'NUMBER', description: 'Importe neto antes de impuestos en Euros (€).' },
            concepto: { type: 'STRING', description: 'Concepto del servicio o suscripción.' },
            metodoPago: { type: 'STRING', description: 'Método de pago: "Transferencia Bancaria", "Domiciliación SEPA" o "Tarjeta Stripe".' },
          },
          required: ['nombreCliente', 'baseImponible', 'concepto'],
        },
      },
      {
        name: 'consultarResumenFinanciero',
        description:
          'Consulta el resumen financiero ejecutivo de Deskly: MRR, ARR, costes mensuales totales, margen neto/bruto, EBITDA, runway de tesorería, facturas pendientes y métricas de salud financiera.',
        parameters: {
          type: 'OBJECT',
          properties: {},
        },
      },
      {
        name: 'consultarFacturas',
        description:
          'Consulta y filtra las facturas emitidas por estado (Pagada, Pendiente, Vencida), nombre del cliente o importe total.',
        parameters: {
          type: 'OBJECT',
          properties: {
            estado: {
              type: 'STRING',
              description: 'Filtrar por estado: "Pagada", "Pendiente", "Vencida" o "todas".',
            },
            cliente: {
              type: 'STRING',
              description: 'Nombre de la empresa o cliente a filtrar (opcional).',
            },
            limite: {
              type: 'INTEGER',
              description: 'Número máximo de facturas a retornar (por defecto 15).',
            },
          },
        },
      },
      {
        name: 'consultarCostesYGastos',
        description:
          'Consulta el desglose detallado de costes y gastos operativos de la empresa: Nóminas y personal, Infraestructura Cloud, Software SaaS, Oficina/Coworking, Marketing/Ads y Legal/Gestoría.',
        parameters: {
          type: 'OBJECT',
          properties: {
            categoria: {
              type: 'STRING',
              description:
                'Categoría de gasto a filtrar: "Nominas_y_Personal", "Infraestructura_Cloud", "Software_y_SaaS", "Oficina_y_Suministros", "Marketing_y_Ventas", "Legal_y_Gestoria" o "todas".',
            },
          },
        },
      },
      {
        name: 'consultarCarteraClientes',
        description:
          'Consulta y busca en la cartera de clientes de Deskly. Permite filtrar por estado (Activo, En Riesgo, Pausado, En Onboarding), plan de suscripción (Starter, Growth, Enterprise, Custom) o término de búsqueda.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'Término de búsqueda: nombre de la empresa, contacto, email o sector.',
            },
            estado: {
              type: 'STRING',
              description: 'Estado del cliente: "Activo", "En Riesgo", "Pausado", "En Onboarding" o "todos".',
            },
            plan: {
              type: 'STRING',
              description: 'Plan de suscripción: "Starter", "Growth", "Enterprise", "Custom" o "todos".',
            },
          },
        },
      },
      {
        name: 'analizarRentabilidadCliente',
        description:
          'Realiza un análisis profundo de rentabilidad y salud comercial de un cliente concreto: ingresos generados vs costes de servidor/soporte, margen de contribución, facturas históricas y nivel de satisfacción NPS.',
        parameters: {
          type: 'OBJECT',
          properties: {
            identificador: {
              type: 'STRING',
              description: 'Nombre de la empresa cliente o ID del cliente (ej. "CyberGuard", "cli-001").',
            },
          },
          required: ['identificador'],
        },
      },
      {
        name: 'buscarContactoHubspot',
        description: 'Busca contactos en HubSpot CRM o en el CRM de Deskly por nombre, apellido, correo electrónico o empresa.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: {
              type: 'STRING',
              description: 'Término de búsqueda: nombre, apellido, correo o empresa del contacto.',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'consultarCatalogoProductos',
        description:
          'Consulta el catálogo de productos y servicios que comercializa la empresa a sus clientes, incluyendo precios unitarios, IVA, unidades vendidas, ingresos acumulados, márgenes de beneficio y cuál es el producto estrella más vendido.',
        parameters: {
          type: 'OBJECT',
          properties: {
            categoria: {
              type: 'STRING',
              description: 'Filtrar por categoría (ej. "Servicios Profesionales", "Suscripciones", "Licencias").',
            },
            soloMasVendidos: {
              type: 'BOOLEAN',
              description: 'Si es true, devuelve prioritariamente el producto más vendido o con mayor facturación.',
            },
            busqueda: {
              type: 'STRING',
              description: 'Texto o palabra clave para buscar productos o servicios específicos.',
            },
          },
        },
      },
      {
        name: 'obtenerDealsHubspot',
        description: 'Obtiene las oportunidades y deals de venta comerciales registrados recientemente en el pipeline.',
        parameters: {
          type: 'OBJECT',
          properties: {
            limit: {
              type: 'INTEGER',
              description: 'Cantidad máxima de negocios a consultar (opcional, por defecto 10).',
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
          mrrTotalCartera: `€${resultado.mrrTotalFiltrado.toLocaleString('es-ES')}`,
          clientes: resultado.clientes,
        };
      }

      case 'analizarRentabilidadCliente': {
        const identificador = args.identificador;
        if (!identificador) {
          return { error: 'Debe especificar el nombre o ID del cliente a analizar.' };
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
          deals: deals.length > 0 ? deals : 'No hay negocios registrados actualmente.',
        };
      }

      case 'obtenerEventosCalendario': {
        const timeMin = args.timeMin;
        const timeMax = args.timeMax;
        const eventos = await obtenerEventosCalendario(timeMin, timeMax);
        return {
          total: eventos.length,
          eventos: eventos.length > 0 ? eventos : 'No se encontraron eventos en el período solicitado.',
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
