/**
 * Base de Datos Integral para Deskly - Empresa Constructora & Reformas Integrales
 * Contiene datos realistas de Clientes (Promotoras, Particulares, Sector Público),
 * Facturas y Certificaciones de Obra, Costes Operativos de Construcción (Maquinaria, Subcontratas, Cuadrillas),
 * Partidas de Presupuesto / Unidades de Obra, Albaranes de Materiales y Base de Conocimiento RAG.
 */

export interface Cliente {
  id: string;
  nombreEmpresa: string;
  cif: string;
  contactoPrincipal: string;
  cargo: string;
  email: string;
  telefono: string;
  sector: string;
  planSuscripcion: 'Starter' | 'Growth' | 'Enterprise' | 'Custom';
  mrr: number; // Facturación mensual recurrente / mantenimiento (€)
  arr: number; // Facturación anual (€)
  fechaAlta: string;
  estado: 'Activo' | 'En Riesgo' | 'Pausado' | 'En Onboarding';
  nps: number; // Net Promoter Score (1 a 10)
  facturacionTotalAcumulada: number;
  gestorCuenta: string;
  notas: string;
}

export interface Factura {
  id: string;
  numeroFactura: string;
  clienteId: string;
  nombreCliente: string;
  fechaEmision: string;
  fechaVencimiento: string;
  baseImponible: number; // €
  ivaPorcentaje: number; // 21% general (o 10% en reformas de vivienda habitual)
  ivaImporte: number;
  total: number; // €
  estado: 'Pagada' | 'Pendiente' | 'Vencida';
  metodoPago: 'Transferencia Bancaria' | 'Domiciliación SEPA' | 'Pagaré a 60 días';
  concepto: string;
  fechaPagoReal?: string;
}

export interface GastoCoste {
  id: string;
  categoria:
    | 'Nominas_y_Cuadrillas'
    | 'Maquinaria_y_Gruas'
    | 'Materiales_y_Acopios'
    | 'Subcontratas_e_Instalaciones'
    | 'Seguridad_PRL_y_Casetas'
    | 'Software_Tecnico_y_Licencias';
  concepto: string;
  proveedor: string;
  importeMensual: number; // €
  frecuencia: 'Mensual' | 'Anual' | 'Puntual';
  responsable: string;
  fechaUltimoPago: string;
  estado: 'Al día' | 'Pendiente';
  descripcion: string;
}

export interface MetricasFinancieras {
  mrrTotal: number;
  arrTotal: number;
  ingresosMensualesTotales: number;
  costesMensualesTotales: number;
  ebitdaMensual: number;
  margenNetoPorcentaje: number;
  margenBrutoPorcentaje: number;
  cashEnBanco: number;
  runwayMeses: number;
  cacPromedio: number;
  ltvPromedio: number;
  churnRateMensual: number;
  facturasPendientesCobroTotal: number;
  facturasVencidasTotal: number;
}

export interface AlbaranObra {
  id: string;
  numeroAlbaran: string;
  proveedor: string;
  cifProveedor: string;
  obraDestino: string;
  fechaEntrega: string;
  material: string;
  cantidad: string;
  precioUnitario: number;
  importeTotal: number;
  estado: 'Recibido_Conforme' | 'Pendiente_Validacion' | 'Con_Incidencia';
  firmadoPor: string;
  observaciones: string;
}

// -------------------------------------------------------------
// 1. CARTERA DE CLIENTES Y PROMOTORAS
// -------------------------------------------------------------
export const CLIENTES_DB: Cliente[] = [
  {
    id: 'cli-001',
    nombreEmpresa: 'Promociones Residenciales Mirasierra S.L.',
    cif: 'B87654321',
    contactoPrincipal: 'Carlos Méndez',
    cargo: 'Director de Promociones',
    email: 'carlos.mendez@promirasierra.es',
    telefono: '+34 912 345 678',
    sector: 'Promoción Inmobiliaria Residencial',
    planSuscripcion: 'Enterprise',
    mrr: 12500,
    arr: 150000,
    fechaAlta: '2024-02-15',
    estado: 'Activo',
    nps: 9,
    facturacionTotalAcumulada: 385000,
    gestorCuenta: 'Elena Gómez (Dpto. Estudio)',
    notas: 'Promoción de 24 chalets pareados en fase de estructura y cerramientos. Certificaciones mensuales puntuales.',
  },
  {
    id: 'cli-002',
    nombreEmpresa: 'Grupo Inmobiliario Castellana Prime S.A.',
    cif: 'A28991234',
    contactoPrincipal: 'Marta Rivas',
    cargo: 'Directora de Activos & Obras',
    email: 'marta.rivas@castellanaprime.com',
    telefono: '+34 933 456 789',
    sector: 'Rehabilitación de Edificios & Oficinas',
    planSuscripcion: 'Enterprise',
    mrr: 9800,
    arr: 117600,
    fechaAlta: '2024-04-10',
    estado: 'Activo',
    nps: 10,
    facturacionTotalAcumulada: 245000,
    gestorCuenta: 'David Morales (Dpto. Obras)',
    notas: 'Rehabilitación integral de edificio de oficinas en Paseo de la Castellana 140. Calificación LEED Gold.',
  },
  {
    id: 'cli-003',
    nombreEmpresa: 'Logística & Suelo Industrial San Fernando S.L.',
    cif: 'B98112233',
    contactoPrincipal: 'Javier Navarro',
    cargo: 'Director Técnico de Infraestructuras',
    email: 'jnavarro@logisticasanfernando.es',
    telefono: '+34 961 234 567',
    sector: 'Naves Industriales y Centros Logísticos',
    planSuscripcion: 'Growth',
    mrr: 7500,
    arr: 90000,
    fechaAlta: '2024-06-01',
    estado: 'Activo',
    nps: 9,
    facturacionTotalAcumulada: 180000,
    gestorCuenta: 'Elena Gómez (Dpto. Estudio)',
    notas: 'Construcción de nave logística de 8.500 m² con solera de alta planimetría y muelles de carga.',
  },
  {
    id: 'cli-004',
    nombreEmpresa: 'Corporación Inmobiliaria Gran Vía S.L.',
    cif: 'B45678901',
    contactoPrincipal: 'Lucía Santos',
    cargo: 'Head of Architecture & Retail',
    email: 'lucia.santos@granviacorp.es',
    telefono: '+34 911 887 654',
    sector: 'Reformas Comerciales y Retail Premium',
    planSuscripcion: 'Growth',
    mrr: 4500,
    arr: 54000,
    fechaAlta: '2024-09-01',
    estado: 'En Riesgo',
    nps: 6,
    facturacionTotalAcumulada: 68000,
    gestorCuenta: 'David Morales (Dpto. Obras)',
    notas: 'Reforma de flag-ship store. Hubo retraso de 1 semana por entrega de carpintería metálica de subcontrata.',
  },
  {
    id: 'cli-005',
    nombreEmpresa: 'Residencial Los Álamos - Cooperativa de Viviendas',
    cif: 'B82334455',
    contactoPrincipal: 'Fernando Ruiz',
    cargo: 'Presidente del Consejo Rector',
    email: 'fernando.ruiz@cooperativaalamos.es',
    telefono: '+34 954 123 987',
    sector: 'Cooperativas de Vivienda',
    planSuscripcion: 'Starter',
    mrr: 3200,
    arr: 38400,
    fechaAlta: '2024-11-15',
    estado: 'Activo',
    nps: 9,
    facturacionTotalAcumulada: 42000,
    gestorCuenta: 'Elena Gómez (Dpto. Estudio)',
    notas: 'Construcción de 16 viviendas unifamiliares en régimen de cooperativa. Estudio geotécnico validado.',
  },
];

// -------------------------------------------------------------
// 2. CERTIFICACIONES Y FACTURAS DE OBRA
// -------------------------------------------------------------
export const FACTURAS_DB: Factura[] = [
  {
    id: 'fac-2025-091',
    numeroFactura: 'CERT-2025-041',
    clienteId: 'cli-001',
    nombreCliente: 'Promociones Residenciales Mirasierra S.L.',
    fechaEmision: '2025-05-01',
    fechaVencimiento: '2025-05-31',
    baseImponible: 48500.0,
    ivaPorcentaje: 21,
    ivaImporte: 10185.0,
    total: 58685.0,
    estado: 'Pendiente',
    metodoPago: 'Transferencia Bancaria',
    concepto: 'Certificación nº 4: Ejecución de Estructura de Hormigón y Forjados Niveles 1-3',
  },
  {
    id: 'fac-2025-090',
    numeroFactura: 'CERT-2025-040',
    clienteId: 'cli-002',
    nombreCliente: 'Grupo Inmobiliario Castellana Prime S.A.',
    fechaEmision: '2025-05-01',
    fechaVencimiento: '2025-05-31',
    baseImponible: 36200.0,
    ivaPorcentaje: 21,
    ivaImporte: 7602.0,
    total: 43802.0,
    estado: 'Pendiente',
    metodoPago: 'Transferencia Bancaria',
    concepto: 'Certificación nº 6: Instalaciones de Climatización VRF y Falsos Techos Acústicos',
  },
  {
    id: 'fac-2025-089',
    numeroFactura: 'CERT-2025-039',
    clienteId: 'cli-003',
    nombreCliente: 'Logística & Suelo Industrial San Fernando S.L.',
    fechaEmision: '2025-04-20',
    fechaVencimiento: '2025-05-20',
    baseImponible: 52000.0,
    ivaPorcentaje: 21,
    ivaImporte: 10920.0,
    total: 62920.0,
    estado: 'Pagada',
    metodoPago: 'Transferencia Bancaria',
    concepto: 'Certificación nº 2: Cimentación Especial y Montaje de Estructura Prefabricada',
    fechaPagoReal: '2025-05-10',
  },
  {
    id: 'fac-2025-088',
    numeroFactura: 'CERT-2025-038',
    clienteId: 'cli-004',
    nombreCliente: 'Corporación Inmobiliaria Gran Vía S.L.',
    fechaEmision: '2025-04-01',
    fechaVencimiento: '2025-04-30',
    baseImponible: 18500.0,
    ivaPorcentaje: 21,
    ivaImporte: 3885.0,
    total: 22385.0,
    estado: 'Vencida',
    metodoPago: 'Pagaré a 60 días',
    concepto: 'Certificación final de Demoliciones, Refuerzo Estructural e Instalación Eléctrica',
  },
];

// -------------------------------------------------------------
// 3. COSTES Y GASTOS OPERATIVOS DE CONSTRUCCIÓN
// -------------------------------------------------------------
export const GASTOS_DB: GastoCoste[] = [
  // 1. Nóminas y Cuadrillas de Obra
  {
    id: 'gst-001',
    categoria: 'Nominas_y_Cuadrillas',
    concepto: 'Nóminas Oficiales de 1ª, Encofradores y Albañilería (Cuadrilla Directa)',
    proveedor: 'Personal Propio de Obra',
    importeMensual: 14500.0,
    frecuencia: 'Mensual',
    responsable: 'Lucía Benítez (RRHH)',
    fechaUltimoPago: '2025-04-30',
    estado: 'Al día',
    descripcion: 'Cuadrilla de 6 oficiales de primera y 3 peones especialistas con tarjeta TPC.',
  },
  {
    id: 'gst-002',
    categoria: 'Nominas_y_Cuadrillas',
    concepto: 'Nóminas Jefes de Obra y Encargados Generales de Proyectos',
    proveedor: 'Personal Técnico de Proyectos',
    importeMensual: 9200.0,
    frecuencia: 'Mensual',
    responsable: 'Lucía Benítez (RRHH)',
    fechaUltimoPago: '2025-04-30',
    estado: 'Al día',
    descripcion: '2 Jefes de Obra (Arquitectos Técnicos) y 1 Encargado General a pie de tajo.',
  },
  {
    id: 'gst-003',
    categoria: 'Nominas_y_Cuadrillas',
    concepto: 'Seguridad Social Régimen General de la Construcción',
    proveedor: 'Tesorería General de la Seguridad Social',
    importeMensual: 7800.0,
    frecuencia: 'Mensual',
    responsable: 'Gestoría Laboral',
    fechaUltimoPago: '2025-04-30',
    estado: 'Al día',
    descripcion: 'Cuotas patronales de la plantilla técnica y cuadrillas operativas.',
  },

  // 2. Maquinaria Pesada y Grúas
  {
    id: 'gst-004',
    categoria: 'Maquinaria_y_Gruas',
    concepto: 'Alquiler Grúa Torre 45m y Mantenimiento Preventivo Mensual',
    proveedor: 'Grúas & Elevación Ibérica S.A.',
    importeMensual: 2850.0,
    frecuencia: 'Mensual',
    responsable: 'David Morales (Dpto. Obras)',
    fechaUltimoPago: '2025-05-02',
    estado: 'Al día',
    descripcion: 'Grúa torre fija instalada en Residencial Mirasierra con seguro e ITV técnica en regla.',
  },
  {
    id: 'gst-005',
    categoria: 'Maquinaria_y_Gruas',
    concepto: 'Alquiler Retroexcavadora Mixta y Dumper Autocargable',
    proveedor: 'Maquinaria de Movimiento de Tierras Madrid S.L.',
    importeMensual: 1950.0,
    frecuencia: 'Mensual',
    responsable: 'David Morales (Dpto. Obras)',
    fechaUltimoPago: '2025-05-03',
    estado: 'Al día',
    descripcion: 'Movimiento de tierras, zanjas de saneamiento y carga de escombros en contenedores.',
  },

  // 3. Materiales y Acopios
  {
    id: 'gst-006',
    categoria: 'Materiales_y_Acopios',
    concepto: 'Hormigón Preparado HA-25/B/20/IIa y Morteros de Cemento',
    proveedor: 'Hormigones & Áridos Madrid S.L.',
    importeMensual: 11400.0,
    frecuencia: 'Mensual',
    responsable: 'Elena Gómez (Dpto. Estudio / Compras)',
    fechaUltimoPago: '2025-05-04',
    estado: 'Al día',
    descripcion: 'Suministro de hormigón en camión cuba con aditivos plastificantes para losas y pilares.',
  },
  {
    id: 'gst-007',
    categoria: 'Materiales_y_Acopios',
    concepto: 'Acero Corrugado B-500S Cortado y Doblado para Ferralla',
    proveedor: 'Ferrallas del Henares S.A.',
    importeMensual: 6800.0,
    frecuencia: 'Mensual',
    responsable: 'Elena Gómez (Dpto. Estudio)',
    fechaUltimoPago: '2025-05-01',
    estado: 'Al día',
    descripcion: 'Barras y armaduras electrosoldadas según plano de despiece estructural.',
  },

  // 4. Subcontratas e Instalaciones
  {
    id: 'gst-008',
    categoria: 'Subcontratas_e_Instalaciones',
    concepto: 'Subcontrata de Instalaciones de Climatización, Fontanería y Aerotermia',
    proveedor: 'Instalaciones Técnicas ClimaSol S.L.',
    importeMensual: 8500.0,
    frecuencia: 'Mensual',
    responsable: 'David Morales (Dpto. Obras)',
    fechaUltimoPago: '2025-05-05',
    estado: 'Al día',
    descripcion: 'Tendido de conductos, suelo radiante y montaje de bombas de calor aerotérmicas.',
  },

  // 5. Seguridad PRL y Casetas de Obra
  {
    id: 'gst-009',
    categoria: 'Seguridad_PRL_y_Casetas',
    concepto: 'Alquiler de Módulos Prefabricados (Caseta de Oficina y Vestuario con Aseos)',
    proveedor: 'Alco Alquiler de Casetas S.A.',
    importeMensual: 650.0,
    frecuencia: 'Mensual',
    responsable: 'Lucía Benítez (RRHH)',
    fechaUltimoPago: '2025-05-01',
    estado: 'Al día',
    descripcion: 'Casetas climatizadas para dirección de obra y vestuarios de cuadrillas con duchas.',
  },
  {
    id: 'gst-010',
    categoria: 'Seguridad_PRL_y_Casetas',
    concepto: 'Servicio de Prevención Ajeno, Redes Horizontales y EPIs',
    proveedor: 'Quirónprevención Construcción S.L.',
    importeMensual: 890.0,
    frecuencia: 'Mensual',
    responsable: 'Lucía Benítez (RRHH)',
    fechaUltimoPago: '2025-04-28',
    estado: 'Al día',
    descripcion: 'Revisiones médicas anuales, reposición de cascos, arneses y líneas de vida tipo EN 795.',
  },

  // 6. Software Técnico y Licencias
  {
    id: 'gst-011',
    categoria: 'Software_Tecnico_y_Licencias',
    concepto: 'Licencias Presto Presupuestos, BC3 & Revit BIM Autodesk',
    proveedor: 'RIB Software / Autodesk Inc.',
    importeMensual: 420.0,
    frecuencia: 'Mensual',
    responsable: 'Elena Gómez (Dpto. Estudio)',
    fechaUltimoPago: '2025-05-01',
    estado: 'Al día',
    descripcion: 'Software de medición, cuadro de precios unitarios y modelado BIM 3D.',
  },
];

// -------------------------------------------------------------
// 4. PARTIDAS DE PRESUPUESTO / PRECIOS UNITARIOS
// -------------------------------------------------------------
export interface ProductoServicio {
  id: string;
  nombre: string;
  sku: string;
  categoria: string;
  precioUnitario: number; // €
  precioConIva: number; // € (21%)
  unidadesVendidasTotal: number;
  facturacionTotalAcumulada: number; // €
  margenBeneficioPorcentaje: number; // %
  esMasVendido: boolean;
  stockDisponible?: number;
  descripcion: string;
}

export const PRODUCTOS_Y_SERVICIOS: ProductoServicio[] = [
  {
    id: 'part-001',
    nombre: 'Instalación Completa de Climatización Aerotérmica con Suelo Radiante / Refrescante',
    sku: 'OBR-AERO-SRAD',
    categoria: 'Instalaciones & Eficiencia Energética',
    precioUnitario: 14500.0, // € por vivienda tipo 120m²
    precioConIva: 17545.0, // 21% IVA
    unidadesVendidasTotal: 34,
    facturacionTotalAcumulada: 493000,
    margenBeneficioPorcentaje: 24.5,
    esMasVendido: true,
    descripcion: 'Nuestra partida y servicio técnico estrella más contratado en promociones y reformas de alto standing. Bomba de calor inverter con suelo radiante de alta inercia térmica y termostatos independientes por zona.',
  },
  {
    id: 'part-002',
    nombre: 'm³ Estructura de Hormigón Armado HA-25 con Acero B-500S en Pilares y Forjados',
    sku: 'OBR-ESTR-HA25',
    categoria: 'Estructuras y Cimentación',
    precioUnitario: 240.0, // €/m³
    precioConIva: 290.4,
    unidadesVendidasTotal: 1650,
    facturacionTotalAcumulada: 396000,
    margenBeneficioPorcentaje: 18.0,
    esMasVendido: false,
    descripcion: 'Elaboración y vertido de hormigón con bomba, vibrado mecánico, encofrado recuperable y ferralla homologada.',
  },
  {
    id: 'part-003',
    nombre: 'm² Tabiquería de Placa de Yeso Laminado (Pladur) con Aislamiento Acústico de Lana de Roca',
    sku: 'OBR-TAB-PLADUR',
    categoria: 'Albañilería y Falsos Techos',
    precioUnitario: 48.0, // €/m²
    precioConIva: 58.08,
    unidadesVendidasTotal: 4200,
    facturacionTotalAcumulada: 201600,
    margenBeneficioPorcentaje: 26.5,
    esMasVendido: false,
    descripcion: 'Sistema de tabiquería seca autoportante 15+46+15 con aislamiento de lana de roca 40mm para aislamiento de 45 dBA.',
  },
  {
    id: 'part-004',
    nombre: 'm² Fachada Ventilada con Cerámica Porcelánica Rectificada y Fijación Oculta',
    sku: 'OBR-FACH-VENT',
    categoria: 'Envolvente y Fachadas',
    precioUnitario: 165.0, // €/m²
    precioConIva: 199.65,
    unidadesVendidasTotal: 1800,
    facturacionTotalAcumulada: 297000,
    margenBeneficioPorcentaje: 22.0,
    esMasVendido: false,
    descripcion: 'Subestructura de aluminio anodizado, aislamiento de lana mineral 80mm e impermeabilización transpirable.',
  },
  {
    id: 'part-005',
    nombre: 'm² Solado Porcelánico Rectificado Gran Formato (120x60cm) con Cemento Cola C2TE S1',
    sku: 'OBR-PAV-PORC',
    categoria: 'Acabados y Revestimientos',
    precioUnitario: 62.0, // €/m²
    precioConIva: 75.02,
    unidadesVendidasTotal: 2900,
    facturacionTotalAcumulada: 179800,
    margenBeneficioPorcentaje: 29.0,
    esMasVendido: false,
    descripcion: 'Colocación con cuñas autonivelantes, rejuntado fino hidrófugo y sellado perimetral con juntas elásticas.',
  },
  {
    id: 'part-006',
    nombre: 'Proyecto de Ejecución Técnica, Dirección Facultativa y Estudio Geotécnico Completo',
    sku: 'OBR-DIR-TECNIC',
    categoria: 'Estudio y Oficina Técnica',
    precioUnitario: 8900.0,
    precioConIva: 10769.0,
    unidadesVendidasTotal: 12,
    facturacionTotalAcumulada: 106800,
    margenBeneficioPorcentaje: 45.0,
    esMasVendido: false,
    descripcion: 'Cálculo de estructuras, mediciones en formato BC3, visado colegial y plan de control de calidad.',
  },
];

// -------------------------------------------------------------
// 5. BASE DE ALBARANES DE MATERIALES Y OBRA
// -------------------------------------------------------------
export const ALBARANES_OBRA_DB: AlbaranObra[] = [
  {
    id: 'alb-001',
    numeroAlbaran: 'ALB-2025-8842',
    proveedor: 'Hormigones & Áridos Madrid S.L.',
    cifProveedor: 'B82119944',
    obraDestino: 'Residencial Mirasierra - Fase II (Losa Nivel +2)',
    fechaEntrega: '2025-05-15',
    material: 'Hormigón HA-25/B/20/IIa con plastificante',
    cantidad: '24 m³ (3 camiones cuba)',
    precioUnitario: 110.0,
    importeTotal: 2640.0,
    estado: 'Recibido_Conforme',
    firmadoPor: 'Antonio Gómez (Encargado de Obra)',
    observaciones: 'Llegada a las 08:30h. Cono de Abrams 8cm verificado. Probetas tomadas por laboratorio externo.',
  },
  {
    id: 'alb-002',
    numeroAlbaran: 'ALB-2025-9104',
    proveedor: 'Ferrallas del Henares S.A.',
    cifProveedor: 'A28334411',
    obraDestino: 'Rehabilitación Edificio Castellana 140',
    fechaEntrega: '2025-05-14',
    material: 'Armaduras corrugadas B-500S Ø16 y Ø20',
    cantidad: '4.850 kg',
    precioUnitario: 1.25,
    importeTotal: 6062.5,
    estado: 'Recibido_Conforme',
    firmadoPor: 'Carlos Vega (Jefe de Obra)',
    observaciones: 'Descargado con pluma en zona acopio planta baja. Certificado de calidad de acero adjunto.',
  },
  {
    id: 'alb-003',
    numeroAlbaran: 'ALB-2025-7721',
    proveedor: 'Pladur & Aislamientos Centro S.L.',
    cifProveedor: 'B89332211',
    obraDestino: 'Nave Logística San Fernando',
    fechaEntrega: '2025-05-12',
    material: 'Placas Pladur Standard 15mm + Lana de Roca 40mm',
    cantidad: '350 m² de placas + 30 rollos aislante',
    precioUnitario: 14.5,
    importeTotal: 5075.0,
    estado: 'Recibido_Conforme',
    firmadoPor: 'Antonio Gómez (Encargado de Obra)',
    observaciones: 'Acopio bajo cubierto en nave principal.',
  },
];

// -------------------------------------------------------------
// 6. BASE DE CONOCIMIENTO RAG - NORMATIVAS Y SOPS DE CONSTRUCTORA
// -------------------------------------------------------------

export interface NormativaRAG {
  id: string;
  codigo: string;
  departamentoId: 'estudio' | 'obras' | 'proyectos' | 'rrhh';
  departamentoNombre: string;
  titulo: string;
  categoria: string;
  vigencia: string;
  resumen: string;
  contenidoCompleto: string;
  puntosClave: string[];
  tags: string[];
}

export const NORMATIVAS_RAG_DB: NormativaRAG[] = [
  // --- 1. ESTUDIO (Estudio de Clientes, Mediciones, Presupuestos y Viabilidad) ---
  {
    id: 'rag-est-001',
    codigo: 'EST-SOP-01',
    departamentoId: 'estudio',
    departamentoNombre: 'Estudio & Oficina Técnica',
    titulo: 'Protocolo de Estudio de Viabilidad, Mediciones y Coeficientes de Paso',
    categoria: 'Estudio Técnico & Presupuestos',
    vigencia: '2025 - 2026',
    resumen: 'Fórmula de cálculo de precios unitarios con márgenes directos (15%-22%), coeficiente de imprevistos (5%) y gastos generales (13%).',
    contenidoCompleto: `
1. OBJETIVO DEL DEPARTAMENTO DE ESTUDIO:
Analizar planos, memorias y pliegos técnicos de clientes para determinar costes reales, riesgos constructivos y emitir presupuestos viables y competitivos.

2. ESTRUCTURA DE COSTE EN PRESUPUESTOS:
- Costes Directos (CD): Materiales a precio de acopio negociado + Mano de obra de cuadrilla (según convenio) + Maquinaria específica.
- Costes Indirectos de Obra (CI): 8% al 10% sobre CD (encargado, casetas, acometidas provisionales de luz y agua).
- Gastos Generales de Empresa (GG): 13% sobre la suma de CD + CI.
- Beneficio Industrial (BI): Rango objetivo entre 6% y 13% (Margen bruto total de la oferta: 15% a 22%).
- Fondo de Imprevistos Geotécnicos/Estructurales: 5% obligatorio en obras de reforma y cimentación.

3. VALIDACIÓN PREVIA A LA OFERTA:
Todo presupuesto superior a €50.000 requiere revisión y firma conjunta del Jefe de Estudio y el Director Técnico.
    `.trim(),
    puntosClave: [
      'Margen bruto objetivo en ofertas: 15% al 22% según tipología de obra.',
      'Fondo obligatorio de imprevistos del 5% en reformas y cimentación.',
      'Gastos Generales (13%) y Beneficio Industrial (6%-13%) en licitaciones.',
      'Aprobación de Dirección requerida para presupuestos superiores a €50.000.',
    ],
    tags: ['presupuestos', 'mediciones', 'viabilidad', 'margen', 'presto', 'costes directos', 'estudio'],
  },
  {
    id: 'rag-est-002',
    codigo: 'EST-SOP-02',
    departamentoId: 'estudio',
    departamentoNombre: 'Estudio & Oficina Técnica',
    titulo: 'SLA de Presentación de Ofertas a Clientes y Formato Estándar BC3',
    categoria: 'Atención a Clientes & Licitaciones',
    vigencia: '2025 - 2026',
    resumen: 'Plazo máximo de entrega de presupuesto: 5 días hábiles para reformas y 10 días para obra nueva. Formato oficial Presto/BC3.',
    contenidoCompleto: `
1. TIEMPOS DE RESPUESTA A CLIENTES (SLA):
- Reformas integrales y locales comerciales: Entrega del estudio y presupuesto en un máximo de 5 días hábiles.
- Obra nueva y promociones residenciales: Entrega en un máximo de 10 días hábiles tras visita técnica de replanteo.

2. DOCUMENTACIÓN OBLIGATORIA ENTREGABLE:
- Presupuesto desglosado por capítulos (Demoliciones, Estructura, Albañilería, Instalaciones, Acabados).
- Archivo digital intercambiable en estándar FIEBDC-3 (.BC3).
- Cronograma estimativo de obra (Diagrama de Gantt) con hitos de certificación mensual.
    `.trim(),
    puntosClave: [
      'SLA presupuesto reforma: 5 días hábiles; Obra nueva: 10 días.',
      'Desglose obligatorio por capítulos con archivo .BC3 para el cliente.',
      'Inclusión indispensable de Diagrama de Gantt con fechas estimadas de entrega.',
    ],
    tags: ['sla', 'clientes', 'ofertas', 'bc3', 'gantt', 'plazos', 'estudio'],
  },

  // --- 2. OBRAS (Planificación Operativa, Acopios, Maquinaria y Subcontratas) ---
  {
    id: 'rag-obr-001',
    codigo: 'OBR-SOP-01',
    departamentoId: 'obras',
    departamentoNombre: 'Obras & Planificación Operativa',
    titulo: 'Protocolo de Replanteo Inicial, Acopio de Materiales y Plan de Maquinaria',
    categoria: 'Operaciones & Logística de Obra',
    vigencia: '2025 - 2026',
    resumen: 'Requisitos para acta de replanteo, reserva de vía pública para grúas y pedido de hormigón con 48h de antelación.',
    contenidoCompleto: `
1. ACTA DE REPLANTEO PREVIO:
Antes de iniciar cualquier tajo, el Jefe del Dpto. de Obras debe firmar el Acta de Replanteo con la Dirección Facultativa y la Promotora, comprobando cotas topográficas y acometidas de obra.

2. PLANIFICACIÓN DE MAQUINARIA Y RESERVAS:
- Grúas Torre y Autogrúas: Solicitud de ocupación de vía pública al Ayuntamiento con mínimo 15 días de antelación.
- Pedidos de Hormigón y Bomba: Preaviso a la planta de hormigón con mínimo 48 horas de antelación indicando volumen, aditivos y hora punta de vertido.
- Gestión de Acopios en Parcela: Prohibido acumular cargas puntuales que superen la capacidad portante de los forjados según memoria de cálculo.
    `.trim(),
    puntosClave: [
      'Firma obligatoria del Acta de Replanteo antes de arrancar los trabajos.',
      'Preaviso de 48 horas para cubas de hormigón y camión bomba.',
      'Ocupación de vía pública para grúas con 15 días de tramitación municipal.',
      'Control riguroso de sobrecargas de acopio sobre forjados existentes.',
    ],
    tags: ['replanteo', 'maquinaria', 'gruas', 'acopio', 'hormigon', 'operaciones', 'obras'],
  },
  {
    id: 'rag-obr-002',
    codigo: 'OBR-SOP-02',
    departamentoId: 'obras',
    departamentoNombre: 'Obras & Planificación Operativa',
    titulo: 'Homologación de Subcontratas y Control de Albaranes de Entrada',
    categoria: 'Gestión de Proveedores & Albaranes',
    vigencia: '2025 - 2026',
    resumen: 'Documentación obligatoria de subcontratas (REA, TC2, Seguro RC de 600.000€) y cotejo digital de cada albarán con la orden de compra.',
    contenidoCompleto: `
1. HOMOLOGACIÓN DE EMPRESAS SUBCONTRATISTAS:
Ningún operario externo puede entrar a obra sin aportar previamente:
- Inscripción vigente en el Registro de Empresas Acreditadas (REA).
- Póliza de Seguro de Responsabilidad Civil con cobertura mínima de €600.000.
- TC2 / RNT de trabajadores al corriente de la Seguridad Social y certificados de aptitud médica.

2. PROTOCOLO DE RECEPCIÓN Y SUBIDA DE ALBARANES:
- Todo material entregado (hormigón, ferralla, ladrillo, mortero, yeso) debe ser revisado en el momento de la descarga.
- El encargado debe fotografiar el albarán con la app/Deskly, comprobar cantidad y nº de pedido, firmar la conformidad y subirlo de inmediato para su registro contable y control de costes.
    `.trim(),
    puntosClave: [
      'Documentación previa exigida: REA, TC2 y Seguro de Responsabilidad Civil de €600.000.',
      'Recepción y foto obligatoria del albarán al momento de la descarga.',
      'Cotejo inmediato de cantidades y calidades frente a la orden de compra.',
    ],
    tags: ['subcontratas', 'albaranes', 'rea', 'seguro rc', 'proveedores', 'compras', 'obras'],
  },

  // --- 3. PROYECTOS (Encargados de Obra, Ejecución en Tajo, Partes Diarios y Calidad) ---
  {
    id: 'rag-pry-001',
    codigo: 'PRY-SOP-01',
    departamentoId: 'proyectos',
    departamentoNombre: 'Proyectos & Ejecución en Tajo',
    titulo: 'Partes Diarios de Trabajo, Libro de Órdenes y Certificaciones Mensuales',
    categoria: 'Control de Ejecución & Certificaciones',
    vigencia: '2025 - 2026',
    resumen: 'Cierre de certificaciones el día 25 de cada mes. Parte diario obligatorio con personal, climatología y unidades ejecutadas.',
    contenidoCompleto: `
1. PARTE DIARIO DE TRABAJO EN EL TAJO:
El Encargado de Obra debe cumplimentar a diario antes de las 18:00h el Parte Digital indicando:
- Número de operarios propios y de subcontratas presentes.
- Climatología (anotar si hubo viento o lluvia que paralizara trabajos en altura o vertidos).
- Mediciones aproximadas de unidades ejecutadas (m² de tabique, m³ de hormigón vertido, ml de zanja).
- Incidencias o desviaciones sobre el plano.

2. CICLO MENSUAL DE CERTIFICACIONES:
- Día 25 de cada mes: Corte y cierre de mediciones reales ejecutadas en obra.
- Día 28 de cada mes: Validación conjunta con el Aparejador / Director de Obra de la propiedad.
- Día 30 de cada mes: Emisión de la Factura de Certificación con desglose por partidas.
    `.trim(),
    puntosClave: [
      'Parte diario obligatorio antes de las 18:00h (cuadrillas, clima y producción).',
      'Corte mensual de mediciones el día 25 de cada mes.',
      'Aprobación de la Dirección Facultativa antes del día 28.',
      'Facturación de certificaciones el día 30 de cada mes.',
    ],
    tags: ['partes diarios', 'certificaciones', 'mediciones', 'encargado', 'libro de ordenes', 'proyectos'],
  },
  {
    id: 'rag-pry-002',
    codigo: 'PRY-SOP-02',
    departamentoId: 'proyectos',
    departamentoNombre: 'Proyectos & Ejecución en Tajo',
    titulo: 'Protocolo de Seguridad en el Tajo (PRL), Epis y Líneas de Vida',
    categoria: 'Seguridad y Salud en Obra',
    vigencia: '2025 - 2026',
    resumen: 'Uso ininterrumpido de casco, calzado S3, chaleco y arnés anticaídas en alturas superiores a 2 metros. Inspección diaria de barandillas perimetrales.',
    contenidoCompleto: `
1. EQUIPOS DE PROTECCIÓN INDIVIDUAL (EPIs):
- Obligatorio para cualquier persona que pise la obra: Casco de seguridad homologado EN 397, botas con puntera y plantilla de acero S3, chaleco reflectante de alta visibilidad.
- Trabajos en altura (>2,0 m): Uso obligatorio de arnés integral de seguridad EN 361 amarrado a línea de vida certificada o punto de anclaje estructural.

2. PROTECCIONES COLECTIVAS:
- Barandillas perimetrales en huecos de forjado y cajas de ascensor con rodapié de 15 cm.
- Redes de seguridad tipo horca (tipo V) o bajo forjado (tipo S) colocadas antes de desencofrar.
    `.trim(),
    puntosClave: [
      'EPIs obligatorios: Casco EN 397, calzado S3 y chaleco reflectante.',
      'Arnés obligatorio amarrado a línea de vida en alturas superiores a 2 metros.',
      'Barandillas con rodapié en todos los huecos y perímetros de forjado.',
      'Paralización inmediata del tajo si se detecta riesgo grave o inminente.',
    ],
    tags: ['prl', 'seguridad', 'epis', 'lineas de vida', 'arnes', 'encofrado', 'proyectos'],
  },

  // --- 4. RRHH (Nóminas, Fichajes en Caseta, Convenio de la Construcción y TPC) ---
  {
    id: 'rag-rrh-001',
    codigo: 'RRH-SOP-01',
    departamentoId: 'rrhh',
    departamentoNombre: 'Recursos Humanos, Cuadrillas & PRL',
    titulo: 'Convenio General de la Construcción, Jornada de Verano y Control Horario',
    categoria: 'Relaciones Laborales & Nóminas',
    vigencia: '2025 - 2026',
    resumen: 'Jornada anual de 1.736 horas. Jornada intensiva continua de verano (07:00 a 15:00) entre julio y agosto por estrés térmico. Fichaje en caseta.',
    contenidoCompleto: `
1. JORNADA LABORAL Y HORARIOS DE OBRA:
- Jornada Estándar (Septiembre a Junio): Lunes a Viernes de 08:00 a 17:00 (1 hora para comida).
- Jornada Continua de Verano (Julio y Agosto): Lunes a Viernes de 07:00 a 15:00 (jornada intensiva para evitar las horas de máxima insolación y calor extremo).

2. REGISTRO HORARIO Y FICHAJES:
- Todo operario y técnico debe fichar entrada y salida mediante el sistema digital o tablet de la caseta de obra.
- Las horas extraordinarias están limitadas a un máximo legal de 80h al año y se abonan con el 50% de recargo sobre la tarifa base de convenio.
    `.trim(),
    puntosClave: [
      'Jornada intensiva de verano (07:00-15:00) obligatoria en julio y agosto por estrés térmico.',
      'Jornada ordinaria: 08:00-17:00 con 1h de descanso.',
      'Fichaje obligatorio de cuadrillas en la caseta de obra al entrar y salir.',
      'Horas extra con recargo del 50% según el Convenio General de la Construcción.',
    ],
    tags: ['convenio', 'jornada intensiva', 'verano', 'fichajes', 'horas extra', 'nominas', 'rrhh'],
  },
  {
    id: 'rag-rrh-002',
    codigo: 'RRH-SOP-02',
    departamentoId: 'rrhh',
    departamentoNombre: 'Recursos Humanos, Cuadrillas & PRL',
    titulo: 'Tarjeta Profesional de la Construcción (TPC) y Formación Obligatoria PRL',
    categoria: 'Acreditaciones & Salud Laboral',
    vigencia: '2025 - 2026',
    resumen: 'Obligatoriedad de curso de 20 horas por oficio (albañilería, encofrado, electricidad) o 60h para recursos preventivos. Reconocimiento médico anual.',
    contenidoCompleto: `
1. REQUISITOS DE CONTRATACIÓN Y ACCESO:
- Es requisito indispensable disponer de la Tarjeta Profesional de la Construcción (TPC) activa.
- Formación mínima obligatoria: Curso de Prevención de Riesgos Laborales de 20 horas presenciales específico del oficio a desempeñar (Albañilería, Estructuras, Fontanería, etc.).
- Jefes y Encargados: Curso de Nivel Básico de PRL de 60 horas para actuar como Recurso Preventivo.

2. VIGILANCIA DE LA SALUD:
- Reconocimiento médico específico anual (control de esfuerzo físico, audiometría y visión).
    `.trim(),
    puntosClave: [
      'TPC obligatoria para todos los operarios de plantilla y subcontratistas.',
      'Curso homologado de 20 horas por oficio requerido antes de pisar el tajo.',
      'Encargados deben disponer de curso básico de PRL de 60 horas (Recurso Preventivo).',
      'Reconocimiento médico anual obligatorio en servicio de prevención ajeno.',
    ],
    tags: ['tpc', 'formacion 20 horas', 'prl', 'recurso preventivo', 'salud', 'rrhh'],
  },
];

// Mock Calendar Events
export const MOCK_CALENDAR_EVENTS = [
  {
    id: 'evt-001',
    summary: 'Visita de Replanteo y Dirección de Obra - Residencial Mirasierra',
    start: { dateTime: '2025-05-20T09:00:00+02:00' },
    end: { dateTime: '2025-05-20T11:00:00+02:00' },
    attendees: [{ email: 'carlos.mendez@promirasierra.es' }, { email: 'aparejador@mirasierra.es' }],
    description: 'Revisión de armaduras de forjado nivel +2 y comprobación de acometidas.',
    location: 'Calle de la Senda 42, Mirasierra (Madrid)',
  },
  {
    id: 'evt-002',
    summary: 'Comité de Certificación Mensual con Dirección Facultativa - Castellana Prime',
    start: { dateTime: '2025-05-21T12:00:00+02:00' },
    end: { dateTime: '2025-05-21T13:30:00+02:00' },
    attendees: [{ email: 'marta.rivas@castellanaprime.com' }],
    description: 'Revisión de mediciones de climatización VRF y aprobación de la certificación nº 6.',
    location: 'Paseo de la Castellana 140, Planta 4, Madrid',
  },
  {
    id: 'evt-003',
    summary: 'Reunión de Coordinación de Seguridad y Salud (CSS) - Nave San Fernando',
    start: { dateTime: '2025-05-22T16:00:00+02:00' },
    end: { dateTime: '2025-05-22T17:00:00+02:00' },
    attendees: [{ email: 'coordinador.prl@sanfernando.es' }, { email: 'lucia.benitez@deskly.es' }],
    description: 'Auditoría de líneas de vida y montaje de cubierta ligera.',
    location: 'Polígono Industrial San Fernando de Henares',
  },
];

// Mock CRM Deals
export const MOCK_HUBSPOT_DEALS = [
  {
    id: 'deal-001',
    dealname: 'Licitación Obra 32 Viviendas Unifamiliares en Boadilla',
    amount: '1850000',
    dealstage: 'Propuesta Técnica y Económica Enviada',
    pipeline: 'Promociones Residenciales',
    fechaCierre: '2025-06-30',
    fechaCreacion: '2025-04-10',
  },
  {
    id: 'deal-002',
    dealname: 'Reforma Integral de Edificio de Oficinas 4.000 m² en Méndez Álvaro',
    amount: '920000',
    dealstage: 'Negociación y Ajuste de Mediciones',
    pipeline: 'Rehabilitación y Terciario',
    fechaCierre: '2025-05-28',
    fechaCreacion: '2025-03-25',
  },
  {
    id: 'deal-003',
    dealname: 'Adecuación de Nave Logística Frigorífica en Alcalá',
    amount: '450000',
    dealstage: 'Estudio de Viabilidad y Precios Unitarios',
    pipeline: 'Industrial & Logística',
    fechaCierre: '2025-06-15',
    fechaCreacion: '2025-05-02',
  },
];
