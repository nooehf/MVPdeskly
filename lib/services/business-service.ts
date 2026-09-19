import {
  CLIENTES_DB,
  FACTURAS_DB,
  GASTOS_DB,
  PRODUCTOS_Y_SERVICIOS,
  NORMATIVAS_RAG_DB,
  MOCK_CALENDAR_EVENTS,
  MOCK_HUBSPOT_DEALS,
  Cliente,
  Factura,
  GastoCoste,
  ProductoServicio,
  NormativaRAG,
  MetricasFinancieras,
} from '../data/business-database';

// Listas mutables en memoria para permitir agendamiento y creación durante la sesión
const eventosEnMemoria = [...MOCK_CALENDAR_EVENTS];
const dealsEnMemoria = [...MOCK_HUBSPOT_DEALS];
const facturasEnMemoria = [...FACTURAS_DB];
const gastosEnMemoria = [...GASTOS_DB];
const clientesEnMemoria = [...CLIENTES_DB];
const productosEnMemoria = [...PRODUCTOS_Y_SERVICIOS];

/**
 * Calcula y devuelve el resumen ejecutivo de métricas financieras de Deskly.
 */
export function obtenerResumenFinanciero(): {
  kpis: MetricasFinancieras;
  resumenTexto: string;
  desglosePorCategorias: Record<string, number>;
} {
  const mrrTotal = clientesEnMemoria.filter((c) => c.estado === 'Activo').reduce((acc, c) => acc + c.mrr, 0);
  const arrTotal = mrrTotal * 12;

  const costesMensualesTotales = gastosEnMemoria.reduce((acc, g) => acc + g.importeMensual, 0);
  const ebitdaMensual = mrrTotal - costesMensualesTotales;
  const margenNetoPorcentaje = mrrTotal > 0 ? Number(((ebitdaMensual / mrrTotal) * 100).toFixed(2)) : 0;
  const margenBrutoPorcentaje = 84.5;

  const cashEnBanco = 185000;
  const gastoNetoMensual = costesMensualesTotales > mrrTotal ? costesMensualesTotales - mrrTotal : 0;
  const runwayMeses = gastoNetoMensual > 0 ? Number((cashEnBanco / gastoNetoMensual).toFixed(1)) : 36;

  const facturasPendientesCobroTotal = facturasEnMemoria.filter((f) => f.estado === 'Pendiente').reduce(
    (acc, f) => acc + f.total,
    0
  );
  const facturasVencidasTotal = facturasEnMemoria.filter((f) => f.estado === 'Vencida').reduce(
    (acc, f) => acc + f.total,
    0
  );

  const desglosePorCategorias = gastosEnMemoria.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] || 0) + g.importeMensual;
    return acc;
  }, {} as Record<string, number>);

  const kpis: MetricasFinancieras = {
    mrrTotal,
    arrTotal,
    ingresosMensualesTotales: mrrTotal,
    costesMensualesTotales,
    ebitdaMensual,
    margenNetoPorcentaje,
    margenBrutoPorcentaje,
    cashEnBanco,
    runwayMeses,
    cacPromedio: 1450,
    ltvPromedio: 28900,
    churnRateMensual: 1.2,
    facturasPendientesCobroTotal,
    facturasVencidasTotal,
  };

  const resumenTexto = `
- **MRR (Ingresos Recurrentes Mensuales)**: €${mrrTotal.toLocaleString('es-ES')} / mes
- **ARR (Anualizado)**: €${arrTotal.toLocaleString('es-ES')} / año
- **Costes Operativos Mensuales**: €${costesMensualesTotales.toLocaleString('es-ES')} / mes
- **EBITDA / Beneficio Neto Operativo**: €${ebitdaMensual.toLocaleString('es-ES')} / mes (Margen neto: ${margenNetoPorcentaje}%)
- **Tesorería / Cash en Banco**: €${cashEnBanco.toLocaleString('es-ES')}
- **Runway Estimado**: ${runwayMeses >= 36 ? 'Más de 36 meses (Flujo de caja positivo)' : `${runwayMeses} meses`}
- **Facturas Pendientes de Cobro**: €${facturasPendientesCobroTotal.toLocaleString('es-ES')}
- **Facturas Vencidas / En mora**: €${facturasVencidasTotal.toLocaleString('es-ES')}
`.trim();

  return {
    kpis,
    resumenTexto,
    desglosePorCategorias,
  };
}

/**
 * Consulta facturas emitidas por estado, cliente o fechas.
 */
export function consultarFacturas(filtro?: {
  estado?: 'Pagada' | 'Pendiente' | 'Vencida' | 'todas';
  cliente?: string;
  limite?: number;
}): {
  totalFacturas: number;
  importeTotal: number;
  facturas: Factura[];
} {
  let resultado = [...facturasEnMemoria];

  if (filtro?.estado && filtro.estado !== 'todas') {
    resultado = resultado.filter((f) => f.estado.toLowerCase() === filtro.estado?.toLowerCase());
  }

  if (filtro?.cliente) {
    const q = filtro.cliente.toLowerCase();
    resultado = resultado.filter(
      (f) => f.nombreCliente.toLowerCase().includes(q) || f.clienteId.toLowerCase().includes(q)
    );
  }

  const limite = filtro?.limite || 20;
  const facturas = resultado.slice(0, limite);
  const importeTotal = facturas.reduce((acc, f) => acc + f.total, 0);

  return {
    totalFacturas: resultado.length,
    importeTotal: Number(importeTotal.toFixed(2)),
    facturas,
  };
}

/**
 * Consulta y desglose de costes y gastos operativos.
 */
export function consultarCostesYGastos(filtro?: {
  categoria?:
    | 'Nominas_y_Personal'
    | 'Infraestructura_Cloud'
    | 'Software_y_SaaS'
    | 'Oficina_y_Suministros'
    | 'Marketing_y_Ventas'
    | 'Legal_y_Gestoria'
    | 'todas';
}): {
  totalMensual: number;
  gastos: GastoCoste[];
  distribucionPorcentaje: Record<string, string>;
} {
  let resultado = [...gastosEnMemoria];

  if (filtro?.categoria && filtro.categoria !== 'todas') {
    resultado = resultado.filter((g) => g.categoria.toLowerCase() === filtro.categoria?.toLowerCase());
  }

  const totalMensual = resultado.reduce((acc, g) => acc + g.importeMensual, 0);
  const totalGlobal = gastosEnMemoria.reduce((acc, g) => acc + g.importeMensual, 0);

  const distribucionPorcentaje: Record<string, string> = {};
  const categoriasUnicas = Array.from(new Set(gastosEnMemoria.map((g) => g.categoria)));
  for (const cat of categoriasUnicas) {
    const subtotal = gastosEnMemoria.filter((g) => g.categoria === cat).reduce((acc, g) => acc + g.importeMensual, 0);
    distribucionPorcentaje[cat] = `${((subtotal / totalGlobal) * 100).toFixed(1)}% (€${subtotal.toLocaleString('es-ES')})`;
  }

  return {
    totalMensual: Number(totalMensual.toFixed(2)),
    gastos: resultado,
    distribucionPorcentaje,
  };
}

/**
 * Consulta la cartera de clientes de Deskly.
 */
export function consultarCarteraClientes(filtro?: {
  query?: string;
  estado?: 'Activo' | 'En Riesgo' | 'Pausado' | 'En Onboarding' | 'todos';
  plan?: 'Starter' | 'Growth' | 'Enterprise' | 'Custom' | 'todos';
}): {
  totalClientes: number;
  mrrTotalFiltrado: number;
  clientes: Cliente[];
} {
  let resultado = [...clientesEnMemoria];

  if (filtro?.estado && filtro.estado !== 'todos') {
    resultado = resultado.filter((c) => c.estado.toLowerCase() === filtro.estado?.toLowerCase());
  }

  if (filtro?.plan && filtro.plan !== 'todos') {
    resultado = resultado.filter((c) => c.planSuscripcion.toLowerCase() === filtro.plan?.toLowerCase());
  }

  if (filtro?.query) {
    const q = filtro.query.toLowerCase().trim();
    resultado = resultado.filter(
      (c) =>
        c.nombreEmpresa.toLowerCase().includes(q) ||
        c.contactoPrincipal.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q)
    );
  }

  const mrrTotalFiltrado = resultado.reduce((acc, c) => acc + c.mrr, 0);

  return {
    totalClientes: resultado.length,
    mrrTotalFiltrado,
    clientes: resultado,
  };
}

/**
 * Analiza la rentabilidad y relación comercial de un cliente concreto.
 */
export function analizarRentabilidadCliente(identificador: string): {
  encontrado: boolean;
  cliente?: Cliente;
  facturasHistoricas?: Factura[];
  costeEstimadoSoporteServicio?: number;
  margenBeneficioEstimado?: string;
  diagnostico?: string;
} {
  const q = identificador.toLowerCase().trim();
  const cliente = clientesEnMemoria.find(
    (c) =>
      c.id.toLowerCase() === q ||
      c.nombreEmpresa.toLowerCase().includes(q) ||
      c.contactoPrincipal.toLowerCase().includes(q)
  );

  if (!cliente) {
    return {
      encontrado: false,
      diagnostico: `No se encontró ningún cliente que coincida con "${identificador}".`,
    };
  }

  const facturasCliente = facturasEnMemoria.filter((f) => f.clienteId === cliente.id);
  const totalFacturado = facturasCliente.reduce((acc, f) => acc + f.baseImponible, 0);

  const costeServicioMensual =
    cliente.planSuscripcion === 'Custom'
      ? 450
      : cliente.planSuscripcion === 'Enterprise'
      ? 280
      : cliente.planSuscripcion === 'Growth'
      ? 120
      : 45;

  const margenMensual = cliente.mrr - costeServicioMensual;
  const porcentajeMargen = ((margenMensual / cliente.mrr) * 100).toFixed(1);

  let diagnostico = '';
  if (cliente.estado === 'En Riesgo') {
    diagnostico = `⚠️ ALERTA: El cliente está clasificado en 'En Riesgo'. NPS actual: ${cliente.nps}/10. Requiere atención inmediata del gestor ${cliente.gestorCuenta}.`;
  } else if (cliente.nps >= 9) {
    diagnostico = `🌟 EXCELENTE: Cuenta muy fidelizada y de alta satisfacción (NPS ${cliente.nps}/10). Candidato ideal para testimonios, referidos o upselling.`;
  } else {
    diagnostico = `Cuenta estable y operativa con gestor asignado: ${cliente.gestorCuenta}.`;
  }

  return {
    encontrado: true,
    cliente,
    facturasHistoricas: facturasCliente,
    costeEstimadoSoporteServicio: costeServicioMensual,
    margenBeneficioEstimado: `${porcentajeMargen}% (Margen neto: €${margenMensual}/mes)`,
    diagnostico,
  };
}

// -------------------------------------------------------------
// FUNCIONES OPERATIVAS Y DE EJECUCIÓN (ESCRITURA / AGENDAMIENTO)
// -------------------------------------------------------------

/**
 * Agenda y confirma una nueva reunión o evento en el calendario.
 */
export function agendarNuevoEventoCalendario(params: {
  titulo: string;
  inicio: string;
  fin?: string;
  descripcion?: string;
  asistentes?: string[];
  ubicacion?: string;
}) {
  const eventId = `cal-evt-${Date.now()}`;
  const ubicacion = params.ubicacion || 'Google Calendar';

  // Si no se especifica fin, sumar 45 minutos por defecto
  const inicioDate = new Date(params.inicio || Date.now());
  const finDate = params.fin ? new Date(params.fin) : new Date(inicioDate.getTime() + 45 * 60000);

  const nuevoEvento = {
    id: eventId,
    titulo: params.titulo || 'Reunión Operativa Deskly',
    descripcion: params.descripcion || 'Reunión agendada en Deskly',
    inicio: inicioDate.toISOString(),
    fin: finDate.toISOString(),
    ubicacion: ubicacion,
    estado: 'confirmado',
    asistentes: params.asistentes || ['usuario@empresa.com'],
  };

  eventosEnMemoria.unshift(nuevoEvento);

  return {
    success: true,
    mensaje: `✅ Evento agendado y confirmado en Google Calendar.`,
    evento: nuevoEvento,
    detalles: {
      titulo: nuevoEvento.titulo,
      fechaHoraInicio: inicioDate.toLocaleString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      fechaHoraFin: finDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      ubicacion: ubicacion,
      asistentesNotificados: nuevoEvento.asistentes,
      idCalendario: eventId,
      recordatorio: 'Activado recordatorio en Google Calendar.',
    },
  };
}

/**
 * Crea o actualiza un contacto en el CRM de Deskly / HubSpot.
 */
export function crearOActualizarContactoCRM(params: {
  nombreCompleto: string;
  email: string;
  telefono?: string;
  empresa?: string;
  cargo?: string;
  sector?: string;
}) {
  const contactId = `crm-cnt-${Date.now()}`;
  const nuevoContacto = {
    id: contactId,
    nombreCompleto: params.nombreCompleto,
    email: params.email,
    telefono: params.telefono || '+34 600 000 000',
    etapaCicloDeVida: 'Lead Calificado (SQL)',
    estadoLead: 'Asignado a Ventas | Contactado por IA',
    empresa: params.empresa || 'Empresa B2B',
  };

  return {
    success: true,
    mensaje: `✅ Contacto guardado y sincronizado en el CRM.`,
    contacto: nuevoContacto,
  };
}

/**
 * Registra una nueva oportunidad o deal comercial en el CRM.
 */
export function crearNuevoDealCRM(params: {
  nombreNegocio: string;
  monto: string | number;
  etapa?: string;
  pipeline?: string;
  fechaCierre?: string;
}) {
  const dealId = `deal-${Date.now()}`;
  const montoFormateado = typeof params.monto === 'number' ? `€${params.monto.toLocaleString('es-ES')}` : params.monto;
  const nuevoDeal = {
    id: dealId,
    nombreNegocio: params.nombreNegocio,
    monto: montoFormateado,
    etapa: params.etapa || 'Propuesta Comercial Enviada',
    pipeline: params.pipeline || 'Enterprise Sales',
    fechaCierre: params.fechaCierre || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    fechaCreacion: new Date().toISOString().split('T')[0],
  };

  dealsEnMemoria.unshift(nuevoDeal);

  return {
    success: true,
    mensaje: `✅ Oportunidad comercial registrada con éxito en el pipeline de ventas.`,
    deal: nuevoDeal,
  };
}

/**
 * Emite y registra una nueva factura con desglose fiscal.
 */
export function emitirNuevaFactura(params: {
  nombreCliente: string;
  baseImponible: number;
  concepto: string;
  metodoPago?: 'Transferencia Bancaria' | 'Domiciliación SEPA' | 'Tarjeta Stripe';
  diasVencimiento?: number;
}) {
  const numeroFactura = `FAC-2025-${String(facturasEnMemoria.length + 80).padStart(3, '0')}`;
  const ivaPorcentaje = 21;
  const ivaImporte = Number((params.baseImponible * 0.21).toFixed(2));
  const total = Number((params.baseImponible + ivaImporte).toFixed(2));
  const dias = params.diasVencimiento || 30;

  const fechaEmision = new Date().toISOString().split('T')[0];
  const fechaVencimiento = new Date(Date.now() + dias * 86400000).toISOString().split('T')[0];

  const nuevaFactura: Factura = {
    id: `fac-${Date.now()}`,
    numeroFactura,
    clienteId: `cli-custom-${Date.now()}`,
    nombreCliente: params.nombreCliente,
    fechaEmision,
    fechaVencimiento,
    baseImponible: params.baseImponible,
    ivaPorcentaje,
    ivaImporte,
    total,
    estado: 'Pendiente',
    metodoPago: params.metodoPago || 'Transferencia Bancaria',
    concepto: params.concepto,
  };

  facturasEnMemoria.unshift(nuevaFactura);

  return {
    success: true,
    mensaje: `✅ Factura ${numeroFactura} generada y registrada en el sistema contable.`,
    factura: nuevaFactura,
  };
}

export function obtenerEventosCalendarioMock() {
  return eventosEnMemoria;
}

export function obtenerDealsHubspotMock() {
  return dealsEnMemoria;
}

/**
  * Consulta el catálogo de productos y servicios que comercializa la empresa.
  */
export function consultarCatalogoProductos(params?: {
  categoria?: string;
  soloMasVendidos?: boolean;
  busqueda?: string;
}) {
  let resultado = [...productosEnMemoria];

  if (params?.categoria) {
    resultado = resultado.filter((p) =>
      p.categoria.toLowerCase().includes(params.categoria!.toLowerCase())
    );
  }

  if (params?.soloMasVendidos) {
    resultado = resultado.filter((p) => p.esMasVendido);
  }

  if (params?.busqueda) {
    const q = params.busqueda.toLowerCase();
    resultado = resultado.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  const productoEstrella = productosEnMemoria.find((p) => p.esMasVendido) || productosEnMemoria[0];

  return {
    totalProductos: resultado.length,
    productoMasVendido: {
      nombre: productoEstrella.nombre,
      sku: productoEstrella.sku,
      precioUnitarioSinIva: `€${productoEstrella.precioUnitario}`,
      precioConIva: `€${productoEstrella.precioConIva}`,
      unidadesVendidas: productoEstrella.unidadesVendidasTotal,
      facturacionAcumulada: `€${productoEstrella.facturacionTotalAcumulada.toLocaleString('es-ES')}`,
      margen: `${productoEstrella.margenBeneficioPorcentaje}%`,
      descripcion: productoEstrella.descripcion,
    },
    productos: resultado,
  };
}

/**
 * Sistema RAG: Consulta la base de conocimiento y normativas departamentales
 * utilizando búsqueda por departamento, categoría o términos clave.
 */
export function consultarNormativasRAG(params?: {
  consulta?: string;
  departamento?: 'marketing' | 'contabilidad' | 'ventas' | 'produccion' | 'rrhh' | string;
  categoria?: string;
}) {
  let documentos = [...NORMATIVAS_RAG_DB];

  // Filtrado por departamento si se especifica
  if (params?.departamento) {
    const depFilter = params.departamento.toLowerCase();
    documentos = documentos.filter(
      (d) =>
        d.departamentoId.toLowerCase() === depFilter ||
        d.departamentoNombre.toLowerCase().includes(depFilter)
    );
  }

  // Filtrado por categoría si se especifica
  if (params?.categoria) {
    const catFilter = params.categoria.toLowerCase();
    documentos = documentos.filter((d) =>
      d.categoria.toLowerCase().includes(catFilter)
    );
  }

  // Búsqueda por términos de consulta (RAG matching)
  if (params?.consulta) {
    const q = params.consulta.toLowerCase().trim();
    const tokens = q.split(/\s+/).filter((t) => t.length > 2);

    documentos = documentos.filter((doc) => {
      const textoCompleto = `${doc.titulo} ${doc.codigo} ${doc.categoria} ${doc.resumen} ${doc.contenidoCompleto} ${doc.tags.join(' ')} ${doc.puntosClave.join(' ')}`.toLowerCase();

      // Coincidencia directa de la frase o de al menos un token significativo
      if (textoCompleto.includes(q)) return true;
      return tokens.some((token) => textoCompleto.includes(token));
    });
  }

  return {
    totalNormativasEncontradas: documentos.length,
    normativas: documentos.map((d) => ({
      codigo: d.codigo,
      departamento: d.departamentoNombre,
      titulo: d.titulo,
      categoria: d.categoria,
      vigencia: d.vigencia,
      resumen: d.resumen,
      contenidoCompleto: d.contenidoCompleto,
      puntosClave: d.puntosClave,
    })),
  };
}


