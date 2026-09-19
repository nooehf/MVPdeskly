import {
  CLIENTES_DB,
  FACTURAS_DB,
  GASTOS_DB,
  MOCK_CALENDAR_EVENTS,
  MOCK_HUBSPOT_DEALS,
  Cliente,
  Factura,
  GastoCoste,
  MetricasFinancieras,
} from '../data/business-database';

/**
 * Calcula y devuelve el resumen ejecutivo de métricas financieras de Deskly.
 */
export function obtenerResumenFinanciero(): {
  kpis: MetricasFinancieras;
  resumenTexto: string;
  desglosePorCategorias: Record<string, number>;
} {
  const mrrTotal = CLIENTES_DB.filter((c) => c.estado === 'Activo').reduce((acc, c) => acc + c.mrr, 0);
  const arrTotal = mrrTotal * 12;

  const costesMensualesTotales = GASTOS_DB.reduce((acc, g) => acc + g.importeMensual, 0);
  const ebitdaMensual = mrrTotal - costesMensualesTotales;
  const margenNetoPorcentaje = mrrTotal > 0 ? Number(((ebitdaMensual / mrrTotal) * 100).toFixed(2)) : 0;
  const margenBrutoPorcentaje = 84.5; // Margen bruto típico SaaS de software

  const cashEnBanco = 185000; // 185.000 € en cuenta operativa
  const gastoNetoMensual = costesMensualesTotales > mrrTotal ? costesMensualesTotales - mrrTotal : 0;
  // Si la empresa es rentable o flujo positivo, el runway es indefinido / muy alto (> 24 meses)
  const runwayMeses = gastoNetoMensual > 0 ? Number((cashEnBanco / gastoNetoMensual).toFixed(1)) : 36;

  const facturasPendientesCobroTotal = FACTURAS_DB.filter((f) => f.estado === 'Pendiente').reduce(
    (acc, f) => acc + f.total,
    0
  );
  const facturasVencidasTotal = FACTURAS_DB.filter((f) => f.estado === 'Vencida').reduce(
    (acc, f) => acc + f.total,
    0
  );

  // Desglose de costes por categoría
  const desglosePorCategorias = GASTOS_DB.reduce((acc, g) => {
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
  let resultado = [...FACTURAS_DB];

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
  let resultado = [...GASTOS_DB];

  if (filtro?.categoria && filtro.categoria !== 'todas') {
    resultado = resultado.filter((g) => g.categoria.toLowerCase() === filtro.categoria?.toLowerCase());
  }

  const totalMensual = resultado.reduce((acc, g) => acc + g.importeMensual, 0);
  const totalGlobal = GASTOS_DB.reduce((acc, g) => acc + g.importeMensual, 0);

  const distribucionPorcentaje: Record<string, string> = {};
  const categoriasUnicas = Array.from(new Set(GASTOS_DB.map((g) => g.categoria)));
  for (const cat of categoriasUnicas) {
    const subtotal = GASTOS_DB.filter((g) => g.categoria === cat).reduce((acc, g) => acc + g.importeMensual, 0);
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
  let resultado = [...CLIENTES_DB];

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
  const cliente = CLIENTES_DB.find(
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

  const facturasCliente = FACTURAS_DB.filter((f) => f.clienteId === cliente.id);
  const totalFacturado = facturasCliente.reduce((acc, f) => acc + f.baseImponible, 0);

  // Estimación de coste de servidor + soporte según plan
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

/**
 * Obtener eventos mock de calendario para fallback
 */
export function obtenerEventosCalendarioMock() {
  return MOCK_CALENDAR_EVENTS;
}

/**
 * Obtener deals mock de HubSpot para fallback
 */
export function obtenerDealsHubspotMock() {
  return MOCK_HUBSPOT_DEALS;
}
