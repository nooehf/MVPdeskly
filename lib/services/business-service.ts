import {
  CLIENTES_DB,
  FACTURAS_DB,
  GASTOS_DB,
  PRODUCTOS_Y_SERVICIOS,
  ALBARANES_OBRA_DB,
  NORMATIVAS_RAG_DB,
  MOCK_CALENDAR_EVENTS,
  MOCK_HUBSPOT_DEALS,
  Cliente,
  Factura,
  GastoCoste,
  ProductoServicio,
  AlbaranObra,
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
const albaranesEnMemoria = [...ALBARANES_OBRA_DB];

/**
 * Calcula y devuelve el resumen ejecutivo de métricas financieras de la constructora.
 */
export function obtenerResumenFinanciero(): {
  kpis: MetricasFinancieras;
  resumenTexto: string;
  desglosePorCategorias: Record<string, number>;
} {
  const facturacionMensualMedia = clientesEnMemoria
    .filter((c) => c.estado === 'Activo')
    .reduce((acc, c) => acc + c.mrr, 0);
  const arrTotal = facturacionMensualMedia * 12;

  const costesMensualesTotales = gastosEnMemoria.reduce((acc, g) => acc + g.importeMensual, 0);
  const ebitdaMensual = facturacionMensualMedia - costesMensualesTotales;
  const margenNetoPorcentaje =
    facturacionMensualMedia > 0
      ? Number(((ebitdaMensual / facturacionMensualMedia) * 100).toFixed(2))
      : 0;
  const margenBrutoPorcentaje = 26.5;

  const cashEnBanco = 320000;
  const gastoNetoMensual =
    costesMensualesTotales > facturacionMensualMedia
      ? costesMensualesTotales - facturacionMensualMedia
      : 0;
  const runwayMeses = gastoNetoMensual > 0 ? Number((cashEnBanco / gastoNetoMensual).toFixed(1)) : 48;

  const facturasPendientesCobroTotal = facturasEnMemoria
    .filter((f) => f.estado === 'Pendiente')
    .reduce((acc, f) => acc + f.total, 0);
  const facturasVencidasTotal = facturasEnMemoria
    .filter((f) => f.estado === 'Vencida')
    .reduce((acc, f) => acc + f.total, 0);

  const desglosePorCategorias = gastosEnMemoria.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] || 0) + g.importeMensual;
    return acc;
  }, {} as Record<string, number>);

  const kpis: MetricasFinancieras = {
    mrrTotal: facturacionMensualMedia,
    arrTotal,
    ingresosMensualesTotales: facturacionMensualMedia,
    costesMensualesTotales,
    ebitdaMensual,
    margenNetoPorcentaje,
    margenBrutoPorcentaje,
    cashEnBanco,
    runwayMeses,
    cacPromedio: 3200,
    ltvPromedio: 145000,
    churnRateMensual: 0.5,
    facturasPendientesCobroTotal,
    facturasVencidasTotal,
  };

  const resumenTexto = `
- **Facturación Mensual Media**: €${facturacionMensualMedia.toLocaleString('es-ES')} / mes
- **Volumen de Contratación Anual (ARR)**: €${arrTotal.toLocaleString('es-ES')} / año
- **Costes Operativos Mensuales de Construcción**: €${costesMensualesTotales.toLocaleString('es-ES')} / mes
- **EBITDA / Margen Operativo**: €${ebitdaMensual.toLocaleString('es-ES')} / mes (Margen neto: ${margenNetoPorcentaje}%)
- **Tesorería / Cash en Banco**: €${cashEnBanco.toLocaleString('es-ES')}
- **Certificaciones Pendientes de Cobro**: €${facturasPendientesCobroTotal.toLocaleString('es-ES')}
- **Facturas / Pagarés Vencidos**: €${facturasVencidasTotal.toLocaleString('es-ES')}
`.trim();

  return {
    kpis,
    resumenTexto,
    desglosePorCategorias,
  };
}

/**
 * Consulta facturas y certificaciones emitidas por estado, cliente o fechas.
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
 * Consulta y desglose de costes y gastos operativos de construcción.
 */
export function consultarCostesYGastos(filtro?: {
  categoria?:
    | 'Nominas_y_Cuadrillas'
    | 'Maquinaria_y_Gruas'
    | 'Materiales_y_Acopios'
    | 'Subcontratas_e_Instalaciones'
    | 'Seguridad_PRL_y_Casetas'
    | 'Software_Tecnico_y_Licencias'
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
  const sumaTotalEmpresa = gastosEnMemoria.reduce((acc, g) => acc + g.importeMensual, 0);

  const distribucionPorcentaje = resultado.reduce((acc, g) => {
    const pct = sumaTotalEmpresa > 0 ? ((g.importeMensual / sumaTotalEmpresa) * 100).toFixed(1) : '0';
    acc[g.categoria] = `${pct}%`;
    return acc;
  }, {} as Record<string, string>);

  return {
    totalMensual: Number(totalMensual.toFixed(2)),
    gastos: resultado,
    distribucionPorcentaje,
  };
}

/**
 * Consulta la cartera de clientes y promociones activas.
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
    const q = filtro.query.toLowerCase();
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
 * Analiza la rentabilidad de una obra o cliente promotor.
 */
export function analizarRentabilidadCliente(identificador: string) {
  const q = identificador.toLowerCase();
  const cliente = clientesEnMemoria.find(
    (c) =>
      c.id.toLowerCase() === q ||
      c.nombreEmpresa.toLowerCase().includes(q) ||
      c.cif.toLowerCase().includes(q)
  );

  if (!cliente) {
    return {
      encontrado: false,
      mensaje: `No se encontró ningún cliente o promoción coincidente con "${identificador}".`,
    };
  }

  const facturasCliente = facturasEnMemoria.filter((f) => f.clienteId === cliente.id);
  const totalFacturado = facturasCliente.reduce((acc, f) => acc + f.total, 0);
  const facturasPendientes = facturasCliente.filter((f) => f.estado === 'Pendiente');
  const facturasVencidas = facturasCliente.filter((f) => f.estado === 'Vencida');

  return {
    encontrado: true,
    cliente: {
      id: cliente.id,
      nombreEmpresa: cliente.nombreEmpresa,
      cif: cliente.cif,
      contacto: `${cliente.contactoPrincipal} (${cliente.cargo})`,
      estado: cliente.estado,
      nps: `${cliente.nps} / 10`,
      facturacionTotalAcumulada: `€${cliente.facturacionTotalAcumulada.toLocaleString('es-ES')}`,
      volumenMensual: `€${cliente.mrr.toLocaleString('es-ES')}`,
      gestorAsignado: cliente.gestorCuenta,
      notasTecnicas: cliente.notas,
    },
    analisisEconomico: {
      totalCertificacionesEmitidas: facturasCliente.length,
      importeCertificadoTotal: `€${totalFacturado.toLocaleString('es-ES')}`,
      certificacionesPendientesCobro: facturasPendientes.length,
      certificacionesVencidas: facturasVencidas.length,
      saludFinanciera:
        facturasVencidas.length > 0
          ? '⚠️ RIESGO POR MORA: Existen certificaciones vencidas pendientes de cobro.'
          : '✅ EXCELENTE: Cuenta al día en pagos y certificaciones aprobadas.',
    },
    historicoCertificaciones: facturasCliente.map((f) => ({
      numero: f.numeroFactura,
      concepto: f.concepto,
      importe: `€${f.total.toLocaleString('es-ES')}`,
      estado: f.estado,
      emision: f.fechaEmision,
      vencimiento: f.fechaVencimiento,
    })),
  };
}

/**
 * Agenda y confirma una nueva visita técnica o reunión en Google Calendar.
 */
export function agendarNuevoEventoCalendario(params: {
  titulo: string;
  inicio?: string;
  fin?: string;
  descripcion?: string;
  asistentes?: string[];
  ubicacion?: string;
}) {
  const inicioFecha = params.inicio ? new Date(params.inicio) : new Date(Date.now() + 86400000);
  const finFecha = params.fin ? new Date(params.fin) : new Date(inicioFecha.getTime() + 45 * 60000);

  const nuevoEvento = {
    id: `evt-${Date.now()}`,
    summary: params.titulo,
    start: { dateTime: inicioFecha.toISOString() },
    end: { dateTime: finFecha.toISOString() },
    description: params.descripcion || 'Visita técnica / reunión de seguimiento de obra.',
    location: params.ubicacion || 'Oficina Técnica / Caseta de Obra',
    attendees: (params.asistentes || []).map((email) => ({ email })),
  };

  eventosEnMemoria.unshift(nuevoEvento);

  return {
    success: true,
    mensaje: `✅ Visita técnica / evento agendado exitosamente en Google Calendar.`,
    evento: {
      id: nuevoEvento.id,
      titulo: nuevoEvento.summary,
      inicio: inicioFecha.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }),
      fin: finFecha.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }),
      ubicacion: nuevoEvento.location,
      asistentes: nuevoEvento.attendees.map((a) => a.email),
      descripcion: nuevoEvento.description,
    },
  };
}

/**
 * Crea o actualiza un contacto en el CRM.
 */
export function crearOActualizarContactoCRM(params: {
  nombreCompleto: string;
  email: string;
  telefono?: string;
  empresa?: string;
  cargo?: string;
}) {
  const contacto = {
    id: `cnt-${Date.now()}`,
    name: params.nombreCompleto,
    email: params.email,
    phone: params.telefono || '+34 910 000 000',
    company: params.empresa || 'Empresa Constructora / Promotora',
    jobtitle: params.cargo || 'Responsable Técnico',
  };

  return {
    success: true,
    mensaje: `✅ Contacto guardado y sincronizado en el CRM.`,
    contacto,
  };
}

/**
 * Registra una nueva oportunidad de licitación u obra en el CRM.
 */
export function crearNuevoDealCRM(params: {
  nombreNegocio: string;
  monto: string | number;
  etapa?: string;
  pipeline?: string;
}) {
  const montoNumerico =
    typeof params.monto === 'number'
      ? params.monto
      : Number(String(params.monto).replace(/[^0-9.-]+/g, '')) || 50000;

  const nuevoDeal = {
    id: `deal-${Date.now()}`,
    dealname: params.nombreNegocio,
    amount: String(montoNumerico),
    dealstage: params.etapa || 'Estudio de Viabilidad y Mediciones',
    pipeline: params.pipeline || 'Licitaciones y Obras',
    fechaCierre: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    fechaCreacion: new Date().toISOString().split('T')[0],
  };

  dealsEnMemoria.unshift(nuevoDeal);

  return {
    success: true,
    mensaje: `✅ Oportunidad comercial registrada con éxito en el pipeline de proyectos.`,
    deal: nuevoDeal,
  };
}

/**
 * Emite y registra una nueva factura o certificación con desglose fiscal.
 */
export function emitirNuevaFactura(params: {
  nombreCliente: string;
  baseImponible: number;
  concepto: string;
  metodoPago?: 'Transferencia Bancaria' | 'Domiciliación SEPA' | 'Pagaré a 60 días';
  diasVencimiento?: number;
}) {
  const numeroFactura = `CERT-2025-${String(facturasEnMemoria.length + 42).padStart(3, '0')}`;
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
    mensaje: `✅ Certificación/Factura ${numeroFactura} generada y registrada en el sistema contable de la obra.`,
    factura: nuevaFactura,
  };
}

/**
 * Consulta el catálogo de partidas y unidades de obra presupuestadas.
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

  const partidaEstrella = productosEnMemoria.find((p) => p.esMasVendido) || productosEnMemoria[0];

  return {
    totalPartidas: resultado.length,
    partidaMasPresupuestada: {
      nombre: partidaEstrella.nombre,
      sku: partidaEstrella.sku,
      precioUnitarioSinIva: `€${partidaEstrella.precioUnitario}`,
      precioConIva: `€${partidaEstrella.precioConIva}`,
      unidadesEjecutadas: partidaEstrella.unidadesVendidasTotal,
      facturacionAcumulada: `€${partidaEstrella.facturacionTotalAcumulada.toLocaleString('es-ES')}`,
      margen: `${partidaEstrella.margenBeneficioPorcentaje}%`,
      descripcion: partidaEstrella.descripcion,
    },
    partidas: resultado,
  };
}

/**
 * Consulta y gestión de albaranes de materiales y obras.
 */
export function consultarAlbaranesObra(params?: {
  obra?: string;
  proveedor?: string;
  estado?: string;
}) {
  let resultado = [...albaranesEnMemoria];

  if (params?.obra) {
    const q = params.obra.toLowerCase();
    resultado = resultado.filter((a) => a.obraDestino.toLowerCase().includes(q));
  }

  if (params?.proveedor) {
    const q = params.proveedor.toLowerCase();
    resultado = resultado.filter((a) => a.proveedor.toLowerCase().includes(q));
  }

  if (params?.estado) {
    resultado = resultado.filter((a) => a.estado.toLowerCase() === params.estado!.toLowerCase());
  }

  const importeTotal = resultado.reduce((acc, a) => acc + a.importeTotal, 0);

  return {
    totalAlbaranes: resultado.length,
    importeTotal: `€${importeTotal.toLocaleString('es-ES')}`,
    albaranes: resultado,
  };
}

/**
 * Registra y procesa un nuevo albarán subido mediante foto u OCR.
 */
export function registrarAlbaranObra(params: {
  numeroAlbaran: string;
  proveedor: string;
  obraDestino: string;
  material: string;
  cantidad: string;
  importeTotal: number;
  firmadoPor?: string;
  observaciones?: string;
}) {
  const nuevoAlbaran: AlbaranObra = {
    id: `alb-${Date.now()}`,
    numeroAlbaran: params.numeroAlbaran,
    proveedor: params.proveedor,
    cifProveedor: 'B-PROV-' + Math.floor(100000 + Math.random() * 900000),
    obraDestino: params.obraDestino,
    fechaEntrega: new Date().toISOString().split('T')[0],
    material: params.material,
    cantidad: params.cantidad,
    precioUnitario: params.importeTotal > 0 ? Number((params.importeTotal / 1).toFixed(2)) : 0,
    importeTotal: params.importeTotal,
    estado: 'Recibido_Conforme',
    firmadoPor: params.firmadoPor || 'Encargado de Obra',
    observaciones: params.observaciones || 'Albarán digitalizado mediante captura fotográfica Deskly.',
  };

  albaranesEnMemoria.unshift(nuevoAlbaran);

  return {
    success: true,
    mensaje: `✅ Albarán ${nuevoAlbaran.numeroAlbaran} registrado, cotejado con el presupuesto de obra y archivado con éxito.`,
    albaran: nuevoAlbaran,
  };
}

/**
 * Sistema RAG: Consulta la base de conocimiento y normativas de la constructora
 * para los 4 departamentos (Estudio, Obras, Proyectos, RRHH).
 */
export function consultarNormativasRAG(params?: {
  consulta?: string;
  departamento?: 'estudio' | 'obras' | 'proyectos' | 'rrhh' | string;
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

export function obtenerEventosCalendarioMock() {
  return eventosEnMemoria;
}

export function obtenerDealsHubspotMock() {
  return dealsEnMemoria;
}
