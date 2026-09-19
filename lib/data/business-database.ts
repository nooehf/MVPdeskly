/**
 * Base de Datos Integral para Deskly MVP
 * Contiene datos realistas de Clientes, Contabilidad (Facturas), Costes y Gastos Operativos,
 * y Métricas Financieras / KPIs.
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
  mrr: number; // Ingresos recurrentes mensuales en Euros (€)
  arr: number; // Ingresos anuales (€)
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
  ivaPorcentaje: number; // 21%
  ivaImporte: number;
  total: number; // €
  estado: 'Pagada' | 'Pendiente' | 'Vencida';
  metodoPago: 'Transferencia Bancaria' | 'Domiciliación SEPA' | 'Tarjeta Stripe';
  concepto: string;
  fechaPagoReal?: string;
}

export interface GastoCoste {
  id: string;
  categoria:
    | 'Nominas_y_Personal'
    | 'Infraestructura_Cloud'
    | 'Software_y_SaaS'
    | 'Oficina_y_Suministros'
    | 'Marketing_y_Ventas'
    | 'Legal_y_Gestoria';
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
  cacPromedio: number; // Coste Adquisición Cliente (€)
  ltvPromedio: number; // Lifetime Value (€)
  churnRateMensual: number; // %
  facturasPendientesCobroTotal: number;
  facturasVencidasTotal: number;
}

// -------------------------------------------------------------
// 1. CARTERA DE CLIENTES
// -------------------------------------------------------------
export const CLIENTES_DB: Cliente[] = [
  {
    id: 'cli-001',
    nombreEmpresa: 'Fintech Solutions Madrid S.L.',
    cif: 'B87654321',
    contactoPrincipal: 'Carlos Méndez',
    cargo: 'CTO & Co-Founder',
    email: 'carlos.mendez@fintechmadrid.io',
    telefono: '+34 912 345 678',
    sector: 'Fintech & Banca Digital',
    planSuscripcion: 'Enterprise',
    mrr: 4500,
    arr: 54000,
    fechaAlta: '2024-03-15',
    estado: 'Activo',
    nps: 9,
    facturacionTotalAcumulada: 81000,
    gestorCuenta: 'Elena Gómez',
    notas: 'Cliente clave de banca abierta. Integración de API completada con éxito. Muy satisfechos.',
  },
  {
    id: 'cli-002',
    nombreEmpresa: 'Logística Iberia Express S.A.',
    cif: 'A28991234',
    contactoPrincipal: 'Marta Rivas',
    cargo: 'Directora de Operaciones',
    email: 'marta.rivas@logisticaiberia.es',
    telefono: '+34 933 456 789',
    sector: 'Transporte y Logística',
    planSuscripcion: 'Enterprise',
    mrr: 3800,
    arr: 45600,
    fechaAlta: '2024-05-01',
    estado: 'Activo',
    nps: 8,
    facturacionTotalAcumulada: 60800,
    gestorCuenta: 'Elena Gómez',
    notas: 'Utilizan el asistente para automatizar el despacho de rutas y sincronización con almacén.',
  },
  {
    id: 'cli-003',
    nombreEmpresa: 'HealthTech Nova',
    cif: 'B98112233',
    contactoPrincipal: 'Dr. Alejandro Peña',
    cargo: 'Director Médico y Socio',
    email: 'apena@healthtechnova.com',
    telefono: '+34 961 234 567',
    sector: 'Salud y Telemedicina',
    planSuscripcion: 'Growth',
    mrr: 2200,
    arr: 26400,
    fechaAlta: '2024-08-10',
    estado: 'Activo',
    nps: 9,
    facturacionTotalAcumulada: 28600,
    gestorCuenta: 'David Morales',
    notas: 'Clínica con 24 médicos conectados para gestión de citas y recordatorios inteligentes.',
  },
  {
    id: 'cli-004',
    nombreEmpresa: 'Retail Global eCommerce',
    cif: 'B45678901',
    contactoPrincipal: 'Lucía Santos',
    cargo: 'Head of Growth',
    email: 'lucia.santos@retailglobal.com',
    telefono: '+34 911 887 654',
    sector: 'eCommerce y Moda',
    planSuscripcion: 'Growth',
    mrr: 1900,
    arr: 22800,
    fechaAlta: '2024-09-01',
    estado: 'En Riesgo',
    nps: 6,
    facturacionTotalAcumulada: 22800,
    gestorCuenta: 'David Morales',
    notas: 'Reportaron baja tasa de adopción interna en agosto. Reunión de éxito programada.',
  },
  {
    id: 'cli-005',
    nombreEmpresa: 'InmoProp Consultores',
    cif: 'B82334455',
    contactoPrincipal: 'Fernando Ruiz',
    cargo: 'Director Comercial',
    email: 'fernando.ruiz@inmoprop.es',
    telefono: '+34 954 123 987',
    sector: 'Inmobiliario y Real Estate',
    planSuscripcion: 'Starter',
    mrr: 850,
    arr: 10200,
    fechaAlta: '2024-11-15',
    estado: 'Activo',
    nps: 10,
    facturacionTotalAcumulada: 8500,
    gestorCuenta: 'Elena Gómez',
    notas: 'Alta satisfacción. Quieren ampliar licencias para 5 nuevos agentes comerciales.',
  },
  {
    id: 'cli-006',
    nombreEmpresa: 'CyberGuard Security Systems',
    cif: 'B90123456',
    contactoPrincipal: 'Javier Navarro',
    cargo: 'CISO & Co-fundador',
    email: 'j.navarro@cyberguard.tech',
    telefono: '+34 910 555 432',
    sector: 'Ciberseguridad B2B',
    planSuscripcion: 'Enterprise',
    mrr: 5200,
    arr: 62400,
    fechaAlta: '2024-02-01',
    estado: 'Activo',
    nps: 10,
    facturacionTotalAcumulada: 98800,
    gestorCuenta: 'David Morales',
    notas: 'Cliente con mayor ticket promedio. Contrato anual renovado con opción de soporte 24/7.',
  },
  {
    id: 'cli-007',
    nombreEmpresa: 'Agencia Digital Momentum',
    cif: 'B76543210',
    contactoPrincipal: 'Sara Morales',
    cargo: 'CEO',
    email: 'sara@momentumbrand.agency',
    telefono: '+34 932 112 233',
    sector: 'Marketing y Publicidad',
    planSuscripcion: 'Growth',
    mrr: 1650,
    arr: 19800,
    fechaAlta: '2024-10-05',
    estado: 'Activo',
    nps: 8,
    facturacionTotalAcumulada: 18150,
    gestorCuenta: 'Elena Gómez',
    notas: 'Conectaron su HubSpot y Google Calendar para agendar sesiones con clientes internacionales.',
  },
  {
    id: 'cli-008',
    nombreEmpresa: 'EduTech Future Academy',
    cif: 'B81123444',
    contactoPrincipal: 'Roberto Calvo',
    cargo: 'Director de Formación',
    email: 'r.calvo@edutechfuture.com',
    telefono: '+34 914 990 011',
    sector: 'Educación y Formación Online',
    planSuscripcion: 'Starter',
    mrr: 750,
    arr: 9000,
    fechaAlta: '2025-01-10',
    estado: 'Pausado',
    nps: 7,
    facturacionTotalAcumulada: 5250,
    gestorCuenta: 'David Morales',
    notas: 'Pausa estacional por periodo de exámenes universitarios. Se reactivan el próximo mes.',
  },
  {
    id: 'cli-009',
    nombreEmpresa: 'GreenEnergy Renovable',
    cif: 'A84332211',
    contactoPrincipal: 'Beatriz Soler',
    cargo: 'Responsable de Transformación Digital',
    email: 'bsoler@greenenergy.es',
    telefono: '+34 963 887 766',
    sector: 'Energía y Sostenibilidad',
    planSuscripcion: 'Custom',
    mrr: 6000,
    arr: 72000,
    fechaAlta: '2024-06-20',
    estado: 'Activo',
    nps: 9,
    facturacionTotalAcumulada: 90000,
    gestorCuenta: 'Elena Gómez',
    notas: 'Contrato corporativo a medida con SLA garantizado del 99.9%. Pago anual por adelantado.',
  },
  {
    id: 'cli-010',
    nombreEmpresa: 'SaaS Talent Recruiters',
    cif: 'B89988776',
    contactoPrincipal: 'Guillermo Alba',
    cargo: 'Headhunter Principal',
    email: 'guillermo@saastalent.io',
    telefono: '+34 919 001 223',
    sector: 'Recursos Humanos y Headhunting',
    planSuscripcion: 'Starter',
    mrr: 950,
    arr: 11400,
    fechaAlta: '2025-02-01',
    estado: 'En Onboarding',
    nps: 8,
    facturacionTotalAcumulada: 3800,
    gestorCuenta: 'David Morales',
    notas: 'Configurando filtros automáticos de candidatos y sincronización de entrevistas técnicas.',
  },
];

// -------------------------------------------------------------
// 2. CONTABILIDAD Y FACTURACIÓN
// -------------------------------------------------------------
export const FACTURAS_DB: Factura[] = [
  // Facturas del mes actual y reciente
  {
    id: 'fac-2025-081',
    numeroFactura: 'FAC-2025-081',
    clienteId: 'cli-006',
    nombreCliente: 'CyberGuard Security Systems',
    fechaEmision: '2025-05-01',
    fechaVencimiento: '2025-05-30',
    baseImponible: 5200.0,
    ivaPorcentaje: 21,
    ivaImporte: 1092.0,
    total: 6292.0,
    estado: 'Pagada',
    metodoPago: 'Transferencia Bancaria',
    concepto: 'Suscripción Deskly Enterprise - Mensualidad Mayo 2025',
    fechaPagoReal: '2025-05-05',
  },
  {
    id: 'fac-2025-082',
    numeroFactura: 'FAC-2025-082',
    clienteId: 'cli-001',
    nombreCliente: 'Fintech Solutions Madrid S.L.',
    fechaEmision: '2025-05-01',
    fechaVencimiento: '2025-05-30',
    baseImponible: 4500.0,
    ivaPorcentaje: 21,
    ivaImporte: 945.0,
    total: 5445.0,
    estado: 'Pagada',
    metodoPago: 'Domiciliación SEPA',
    concepto: 'Suscripción Deskly Enterprise - Mayo 2025',
    fechaPagoReal: '2025-05-04',
  },
  {
    id: 'fac-2025-083',
    numeroFactura: 'FAC-2025-083',
    clienteId: 'cli-009',
    nombreCliente: 'GreenEnergy Renovable',
    fechaEmision: '2025-05-01',
    fechaVencimiento: '2025-05-15',
    baseImponible: 6000.0,
    ivaPorcentaje: 21,
    ivaImporte: 1260.0,
    total: 7260.0,
    estado: 'Pagada',
    metodoPago: 'Transferencia Bancaria',
    concepto: 'Licenciamiento Custom SLA + Soporte Dedicado Mayo 2025',
    fechaPagoReal: '2025-05-03',
  },
  {
    id: 'fac-2025-084',
    numeroFactura: 'FAC-2025-084',
    clienteId: 'cli-002',
    nombreCliente: 'Logística Iberia Express S.A.',
    fechaEmision: '2025-05-05',
    fechaVencimiento: '2025-06-05',
    baseImponible: 3800.0,
    ivaPorcentaje: 21,
    ivaImporte: 798.0,
    total: 4598.0,
    estado: 'Pendiente',
    metodoPago: 'Transferencia Bancaria',
    concepto: 'Suscripción Deskly Enterprise - Plan Logística Mayo 2025',
  },
  {
    id: 'fac-2025-085',
    numeroFactura: 'FAC-2025-085',
    clienteId: 'cli-003',
    nombreCliente: 'HealthTech Nova',
    fechaEmision: '2025-05-08',
    fechaVencimiento: '2025-06-08',
    baseImponible: 2200.0,
    ivaPorcentaje: 21,
    ivaImporte: 462.0,
    total: 2662.0,
    estado: 'Pendiente',
    metodoPago: 'Tarjeta Stripe',
    concepto: 'Suscripción Growth + Módulo Telemedicina Mayo 2025',
  },
  {
    id: 'fac-2025-086',
    numeroFactura: 'FAC-2025-086',
    clienteId: 'cli-007',
    nombreCliente: 'Agencia Digital Momentum',
    fechaEmision: '2025-05-10',
    fechaVencimiento: '2025-06-10',
    baseImponible: 1650.0,
    ivaPorcentaje: 21,
    ivaImporte: 346.5,
    total: 1996.5,
    estado: 'Pendiente',
    metodoPago: 'Tarjeta Stripe',
    concepto: 'Plan Growth - 5 puestos comerciales Mayo 2025',
  },
  {
    id: 'fac-2025-087',
    numeroFactura: 'FAC-2025-087',
    clienteId: 'cli-004',
    nombreCliente: 'Retail Global eCommerce',
    fechaEmision: '2025-04-10',
    fechaVencimiento: '2025-05-10',
    baseImponible: 1900.0,
    ivaPorcentaje: 21,
    ivaImporte: 399.0,
    total: 2299.0,
    estado: 'Vencida',
    metodoPago: 'Transferencia Bancaria',
    concepto: 'Suscripción Growth - Abril 2025 (Recordatorio de cobro enviado)',
  },
  {
    id: 'fac-2025-088',
    numeroFactura: 'FAC-2025-088',
    clienteId: 'cli-005',
    nombreCliente: 'InmoProp Consultores',
    fechaEmision: '2025-05-12',
    fechaVencimiento: '2025-06-12',
    baseImponible: 850.0,
    ivaPorcentaje: 21,
    ivaImporte: 178.5,
    total: 1028.5,
    estado: 'Pagada',
    metodoPago: 'Tarjeta Stripe',
    concepto: 'Plan Starter Inmobiliaria Mayo 2025',
    fechaPagoReal: '2025-05-12',
  },
  {
    id: 'fac-2025-089',
    numeroFactura: 'FAC-2025-089',
    clienteId: 'cli-010',
    nombreCliente: 'SaaS Talent Recruiters',
    fechaEmision: '2025-05-14',
    fechaVencimiento: '2025-06-14',
    baseImponible: 950.0,
    ivaPorcentaje: 21,
    ivaImporte: 199.5,
    total: 1149.5,
    estado: 'Pendiente',
    metodoPago: 'Tarjeta Stripe',
    concepto: 'Plan Starter Recursos Humanos Mayo 2025',
  },
  // Facturas de meses anteriores
  {
    id: 'fac-2025-070',
    numeroFactura: 'FAC-2025-070',
    clienteId: 'cli-001',
    nombreCliente: 'Fintech Solutions Madrid S.L.',
    fechaEmision: '2025-04-01',
    fechaVencimiento: '2025-04-30',
    baseImponible: 4500.0,
    ivaPorcentaje: 21,
    ivaImporte: 945.0,
    total: 5445.0,
    estado: 'Pagada',
    metodoPago: 'Domiciliación SEPA',
    concepto: 'Suscripción Deskly Enterprise - Abril 2025',
    fechaPagoReal: '2025-04-05',
  },
  {
    id: 'fac-2025-071',
    numeroFactura: 'FAC-2025-071',
    clienteId: 'cli-006',
    nombreCliente: 'CyberGuard Security Systems',
    fechaEmision: '2025-04-01',
    fechaVencimiento: '2025-04-30',
    baseImponible: 5200.0,
    ivaPorcentaje: 21,
    ivaImporte: 1092.0,
    total: 6292.0,
    estado: 'Pagada',
    metodoPago: 'Transferencia Bancaria',
    concepto: 'Suscripción Deskly Enterprise - Abril 2025',
    fechaPagoReal: '2025-04-03',
  },
  {
    id: 'fac-2025-072',
    numeroFactura: 'FAC-2025-072',
    clienteId: 'cli-009',
    nombreCliente: 'GreenEnergy Renovable',
    fechaEmision: '2025-04-01',
    fechaVencimiento: '2025-04-30',
    baseImponible: 6000.0,
    ivaPorcentaje: 21,
    ivaImporte: 1260.0,
    total: 7260.0,
    estado: 'Pagada',
    metodoPago: 'Transferencia Bancaria',
    concepto: 'Licenciamiento Custom SLA Abril 2025',
    fechaPagoReal: '2025-04-02',
  },
];

// -------------------------------------------------------------
// 3. COSTES Y GASTOS OPERATIVOS
// -------------------------------------------------------------
export const GASTOS_DB: GastoCoste[] = [
  // 1. Nóminas y Equipo Humano
  {
    id: 'gst-001',
    categoria: 'Nominas_y_Personal',
    concepto: 'Nómina Lead Fullstack & AI Engineer',
    proveedor: 'Personal Interno',
    importeMensual: 4200.0,
    frecuencia: 'Mensual',
    responsable: 'Carlos Vega',
    fechaUltimoPago: '2025-04-30',
    estado: 'Al día',
    descripcion: 'Desarrollo del Core AI, integraciones de Google Calendar y HubSpot, arquitectura.',
  },
  {
    id: 'gst-002',
    categoria: 'Nominas_y_Personal',
    concepto: 'Nómina Senior Backend Engineer',
    proveedor: 'Personal Interno',
    importeMensual: 3800.0,
    frecuencia: 'Mensual',
    responsable: 'Lucía Benítez',
    fechaUltimoPago: '2025-04-30',
    estado: 'Al día',
    descripcion: 'Microservicios, APIs, seguridad y bases de datos Supabase / PostgreSQL.',
  },
  {
    id: 'gst-003',
    categoria: 'Nominas_y_Personal',
    concepto: 'Nómina Product Designer UI/UX',
    proveedor: 'Personal Interno',
    importeMensual: 2900.0,
    frecuencia: 'Mensual',
    responsable: 'Andrea Sanz',
    fechaUltimoPago: '2025-04-30',
    estado: 'Al día',
    descripcion: 'Diseño de interfaces, experiencia de usuario y design system en Figma.',
  },
  {
    id: 'gst-004',
    categoria: 'Nominas_y_Personal',
    concepto: 'Nómina Account Executive / Ventas B2B',
    proveedor: 'Personal Interno',
    importeMensual: 2600.0,
    frecuencia: 'Mensual',
    responsable: 'David Morales',
    fechaUltimoPago: '2025-04-30',
    estado: 'Al día',
    descripcion: 'Captación de cuentas Enterprise y atención comercial.',
  },
  {
    id: 'gst-005',
    categoria: 'Nominas_y_Personal',
    concepto: 'Seguridad Social y Seguros Laborales',
    proveedor: 'Tesorería General de la Seguridad Social',
    importeMensual: 4350.0,
    frecuencia: 'Mensual',
    responsable: 'Gestoría Externa',
    fechaUltimoPago: '2025-04-30',
    estado: 'Al día',
    descripcion: 'Cuotas patronales de la plantilla de 4 empleados.',
  },

  // 2. Infraestructura Cloud y Servidores
  {
    id: 'gst-006',
    categoria: 'Infraestructura_Cloud',
    concepto: 'Google AI Studio / Gemini 2.5 Flash API Tokens',
    proveedor: 'Google Cloud Platform',
    importeMensual: 420.0,
    frecuencia: 'Mensual',
    responsable: 'Carlos Vega',
    fechaUltimoPago: '2025-05-02',
    estado: 'Al día',
    descripcion: 'Consumo de tokens de inferencia para asistentes y Function Calling.',
  },
  {
    id: 'gst-007',
    categoria: 'Infraestructura_Cloud',
    concepto: 'Vercel Pro Team Hosting & Edge Functions',
    proveedor: 'Vercel Inc.',
    importeMensual: 180.0,
    frecuencia: 'Mensual',
    responsable: 'Carlos Vega',
    fechaUltimoPago: '2025-05-01',
    estado: 'Al día',
    descripcion: 'Despliegue de Next.js, CDN global, Serverless functions y dominios SSL.',
  },
  {
    id: 'gst-008',
    categoria: 'Infraestructura_Cloud',
    concepto: 'Supabase Database Pro & Vector Store',
    proveedor: 'Supabase Inc.',
    importeMensual: 120.0,
    frecuencia: 'Mensual',
    responsable: 'Lucía Benítez',
    fechaUltimoPago: '2025-05-01',
    estado: 'Al día',
    descripcion: 'PostgreSQL gestionado, pgvector para embeddings y backups diarios.',
  },
  {
    id: 'gst-009',
    categoria: 'Infraestructura_Cloud',
    concepto: 'Datadog & Sentry Monitoring y Logs',
    proveedor: 'Datadog Inc.',
    importeMensual: 140.0,
    frecuencia: 'Mensual',
    responsable: 'Lucía Benítez',
    fechaUltimoPago: '2025-05-03',
    estado: 'Al día',
    descripcion: 'Monitorización de errores en producción y métricas de latencia de API.',
  },

  // 3. Software y Herramientas SaaS
  {
    id: 'gst-010',
    categoria: 'Software_y_SaaS',
    concepto: 'HubSpot CRM Sales Hub & Operations',
    proveedor: 'HubSpot Inc.',
    importeMensual: 450.0,
    frecuencia: 'Mensual',
    responsable: 'David Morales',
    fechaUltimoPago: '2025-05-04',
    estado: 'Al día',
    descripcion: 'Licencias de CRM para gestión de pipelines comerciales y sincronización.',
  },
  {
    id: 'gst-011',
    categoria: 'Software_y_SaaS',
    concepto: 'Google Workspace Business (Correo, Calendar, Drive)',
    proveedor: 'Google Ireland',
    importeMensual: 88.0,
    frecuencia: 'Mensual',
    responsable: 'Operaciones',
    fechaUltimoPago: '2025-05-01',
    estado: 'Al día',
    descripcion: 'Cuentas de correo corporativo para todo el equipo.',
  },
  {
    id: 'gst-012',
    categoria: 'Software_y_SaaS',
    concepto: 'Slack Business+ & Figma Professional',
    proveedor: 'Slack / Figma',
    importeMensual: 110.0,
    frecuencia: 'Mensual',
    responsable: 'Andrea Sanz',
    fechaUltimoPago: '2025-05-02',
    estado: 'Al día',
    descripcion: 'Comunicación interna y prototipado visual en tiempo real.',
  },
  {
    id: 'gst-013',
    categoria: 'Software_y_SaaS',
    concepto: 'GitHub Enterprise & Copilot Suite',
    proveedor: 'GitHub Inc.',
    importeMensual: 95.0,
    frecuencia: 'Mensual',
    responsable: 'Carlos Vega',
    fechaUltimoPago: '2025-05-01',
    estado: 'Al día',
    descripcion: 'Repositorios privados, CI/CD Actions y licencias de IA para desarrollo.',
  },

  // 4. Oficina y Suministros
  {
    id: 'gst-014',
    categoria: 'Oficina_y_Suministros',
    concepto: 'Alquiler Despacho Privado Coworking Paseo de la Castellana Madrid',
    proveedor: 'WeWork España',
    importeMensual: 1450.0,
    frecuencia: 'Mensual',
    responsable: 'Dirección General',
    fechaUltimoPago: '2025-05-01',
    estado: 'Al día',
    descripcion: 'Espacio para 6 puestos fijos, salas de reuniones y recepción.',
  },
  {
    id: 'gst-015',
    categoria: 'Oficina_y_Suministros',
    concepto: 'Fibra Óptica Dedicada y Telefonía IP',
    proveedor: 'Telefónica Empresas',
    importeMensual: 125.0,
    frecuencia: 'Mensual',
    responsable: 'Operaciones',
    fechaUltimoPago: '2025-05-05',
    estado: 'Al día',
    descripcion: 'Conexión simétrica de 1 Gbps y líneas directas para soporte comercial.',
  },

  // 5. Marketing y Captación de Clientes
  {
    id: 'gst-016',
    categoria: 'Marketing_y_Ventas',
    concepto: 'Publicidad LinkedIn Ads B2B (Target Directores TI y Ops)',
    proveedor: 'LinkedIn Ireland',
    importeMensual: 1200.0,
    frecuencia: 'Mensual',
    responsable: 'David Morales',
    fechaUltimoPago: '2025-05-05',
    estado: 'Al día',
    descripcion: 'Generación de leads calificados para demostraciones ejecutivas de Deskly.',
  },
  {
    id: 'gst-017',
    categoria: 'Marketing_y_Ventas',
    concepto: 'Google Ads Search (Palabras clave: automatización CRM, asistente IA empresas)',
    proveedor: 'Google Ireland',
    importeMensual: 800.0,
    frecuencia: 'Mensual',
    responsable: 'David Morales',
    fechaUltimoPago: '2025-05-04',
    estado: 'Al día',
    descripcion: 'Campaña SEM para captura de demanda activa en España y Latam.',
  },

  // 6. Asesoría Legal, Fiscal y Cumplimiento
  {
    id: 'gst-018',
    categoria: 'Legal_y_Gestoria',
    concepto: 'Asesoría Fiscal, Contable y Laboral Mensual',
    proveedor: 'Gestores & Abogados Asociados S.L.',
    importeMensual: 450.0,
    frecuencia: 'Mensual',
    responsable: 'Dirección Financiera',
    fechaUltimoPago: '2025-05-02',
    estado: 'Al día',
    descripcion: 'Cierre contable mensual, presentación de modelos trimestrales de IVA/IRPF y nóminas.',
  },
  {
    id: 'gst-019',
    categoria: 'Legal_y_Gestoria',
    concepto: 'Auditoría Continua RGPD y Seguro Ciberriesgo',
    proveedor: 'Mapfre Empresas / DPO Consulting',
    importeMensual: 210.0,
    frecuencia: 'Mensual',
    responsable: 'Dirección General',
    fechaUltimoPago: '2025-05-01',
    estado: 'Al día',
    descripcion: 'Cumplimiento normativo europeo de protección de datos y póliza de seguridad.',
  },
];

// -------------------------------------------------------------
// 4. MOCKS PARA AGENDA (GOOGLE CALENDAR) Y DEALS (HUBSPOT)
// -------------------------------------------------------------
export const MOCK_CALENDAR_EVENTS = [
  {
    id: 'cal-001',
    titulo: 'Revisión Financiera y Cierre Mensual Mayo',
    descripcion: 'Análisis de MRR, facturas pendientes de cobro y presupuesto de costes con la gestoría.',
    inicio: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    fin: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    ubicacion: 'Sala de Juntas Madrid / Google Meet',
    estado: 'confirmado',
  },
  {
    id: 'cal-002',
    titulo: 'Demo Ejecutiva con Carlos Méndez (Fintech Solutions)',
    descripcion: 'Demostración de los nuevos conectores de Deskly con HubSpot y calendario para su equipo directivo.',
    inicio: new Date(new Date().setHours(12, 30, 0, 0)).toISOString(),
    fin: new Date(new Date().setHours(13, 15, 0, 0)).toISOString(),
    ubicacion: 'https://meet.google.com/dsk-demo-live',
    estado: 'confirmado',
  },
  {
    id: 'cal-003',
    titulo: 'Sprint Planning Deskly Core AI v2.5',
    descripcion: 'Planificación de nuevas herramientas de Function Calling y optimización de latencia con Gemini.',
    inicio: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    fin: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    ubicacion: 'Despacho WeWork / Google Meet',
    estado: 'confirmado',
  },
  {
    id: 'cal-004',
    titulo: 'Seguimiento de Cuenta: Retail Global eCommerce',
    descripcion: 'Reunión de éxito de cliente para resolver incidencias de adopción interna.',
    inicio: new Date(Date.now() + 86400000 * 1).toISOString(), // Mañana
    fin: new Date(Date.now() + 86400000 * 1 + 3600000).toISOString(),
    ubicacion: 'Videollamada Google Meet',
    estado: 'confirmado',
  },
  {
    id: 'cal-005',
    titulo: 'Comité de Dirección: Estrategia de Expansión Q3',
    descripcion: 'Evaluación del Runway actual, previsión de tesorería y contratación de nuevos desarrolladores.',
    inicio: new Date(Date.now() + 86400000 * 3).toISOString(), // En 3 días
    fin: new Date(Date.now() + 86400000 * 3 + 7200000).toISOString(),
    ubicacion: 'Oficina Central Madrid',
    estado: 'confirmado',
  },
];

export const MOCK_HUBSPOT_DEALS = [
  {
    id: 'deal-001',
    nombreNegocio: 'Banco Atlántico - Despliegue Deskly Enterprise (50 asientos)',
    monto: '€48,000 / año',
    etapa: 'Negociación y Revisión de Contrato',
    pipeline: 'Enterprise Sales',
    fechaCierre: '2025-06-30',
    fechaCreacion: '2025-04-15',
  },
  {
    id: 'deal-002',
    nombreNegocio: 'Cadena Hotelera Mediterráneo - Asistente de Operaciones y Reservas',
    monto: '€24,500 / año',
    etapa: 'Propuesta Económica Enviada',
    pipeline: 'Enterprise Sales',
    fechaCierre: '2025-06-15',
    fechaCreacion: '2025-05-02',
  },
  {
    id: 'deal-003',
    nombreNegocio: 'Grupo Asegurador Prevención - Integración API CRM Deskly',
    monto: '€36,000 / año',
    etapa: 'Demostración Técnica Superada',
    pipeline: 'Enterprise Sales',
    fechaCierre: '2025-07-15',
    fechaCreacion: '2025-04-20',
  },
  {
    id: 'deal-004',
    nombreNegocio: 'StartUp Studio BCN - Plan Growth (10 licencias)',
    monto: '€14,400 / año',
    etapa: 'Cerrado Ganado',
    pipeline: 'Mid-Market Sales',
    fechaCierre: '2025-05-08',
    fechaCreacion: '2025-04-01',
  },
];

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
    id: 'prod-001',
    nombre: 'Aceite de Oliva Virgen Extra Gourmet (Caja 4 Garrafas de 5L)',
    sku: 'ALM-AOVE-5L4',
    categoria: 'Aceites y Grasas Vegetales',
    precioUnitario: 140.0, // €35/garrafa
    precioConIva: 154.0, // 10% IVA alimentario
    unidadesVendidasTotal: 1850,
    facturacionTotalAcumulada: 259000,
    margenBeneficioPorcentaje: 28.5,
    esMasVendido: true,
    stockDisponible: 340,
    descripcion: 'Nuestro producto estrella más vendido para restaurantes y cadenas hoteleras. AOVE de extracción en frío con acidez < 0.2º, en formato profesional de alta rotación.',
  },
  {
    id: 'prod-002',
    nombre: 'Jamón Ibérico de Bellota 100% D.O. Guijuelo (Pieza 8 kg)',
    sku: 'ALM-JAM-IB100',
    categoria: 'Ibéricos y Embutidos Curados',
    precioUnitario: 285.0,
    precioConIva: 313.5,
    unidadesVendidasTotal: 420,
    facturacionTotalAcumulada: 119700,
    margenBeneficioPorcentaje: 34.0,
    esMasVendido: false,
    stockDisponible: 65,
    descripcion: 'Jamón de bellota 100% ibérico con más de 36 meses de curación natural. Producto de gama alta muy demandado por catering y restauración gourmet.',
  },
  {
    id: 'prod-003',
    nombre: 'Queso Manchego Artesano Curado D.O. (Pieza 3,2 kg)',
    sku: 'ALM-QUE-MANCH',
    categoria: 'Lácteos y Quesos',
    precioUnitario: 46.0,
    precioConIva: 47.84, // 4% IVA superreducido
    unidadesVendidasTotal: 980,
    facturacionTotalAcumulada: 45080,
    margenBeneficioPorcentaje: 31.5,
    esMasVendido: false,
    stockDisponible: 120,
    descripcion: 'Elaborado con leche cruda de oveja manchega y curación mínima de 9 meses en bodega.',
  },
  {
    id: 'prod-004',
    nombre: 'Vino Tinto Crianza D.O. Ribera del Duero (Caja 6 botellas 75cl)',
    sku: 'BEB-VINO-RIB6',
    categoria: 'Bebidas y Bodega',
    precioUnitario: 54.0,
    precioConIva: 65.34, // 21% IVA
    unidadesVendidasTotal: 1250,
    facturacionTotalAcumulada: 67500,
    margenBeneficioPorcentaje: 38.0,
    esMasVendido: false,
    stockDisponible: 210,
    descripcion: '100% Tempranillo con 12 meses en barrica de roble francés y americano. Ideal para cartas de vinos de restaurantes.',
  },
  {
    id: 'prod-005',
    nombre: 'Lote Gourmet Anchoas del Cantábrico Serie Oro (Caja 12 latas 120g)',
    sku: 'ALM-CON-ANCH12',
    categoria: 'Conservas y Salazones',
    precioUnitario: 78.0,
    precioConIva: 85.8,
    unidadesVendidasTotal: 640,
    facturacionTotalAcumulada: 49920,
    margenBeneficioPorcentaje: 42.0,
    esMasVendido: false,
    stockDisponible: 95,
    descripcion: 'Anchoas sobadas a mano en aceite de oliva virgen extra. Formato hostelería para aperitivos premium.',
  },
  {
    id: 'prod-006',
    nombre: 'Arroz Bomba Selección Extra (Saco 25 kg para Hostelería)',
    sku: 'ALM-ARR-BOMB25',
    categoria: 'Legumbres, Arroces y Cereales',
    precioUnitario: 48.0,
    precioConIva: 49.92,
    unidadesVendidasTotal: 1100,
    facturacionTotalAcumulada: 52800,
    margenBeneficioPorcentaje: 26.0,
    esMasVendido: false,
    stockDisponible: 180,
    descripcion: 'Grano redondo especial para arrocerías y restaurantes. Gran absorción de caldo sin pasarse.',
  },
];

// -------------------------------------------------------------
// BASE DE CONOCIMIENTO RAG (NORMATIVAS, PROTOCOLOS Y SOPS)
// -------------------------------------------------------------

export interface NormativaRAG {
  id: string;
  codigo: string;
  departamentoId: 'marketing' | 'contabilidad' | 'ventas' | 'produccion' | 'rrhh';
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
  // --- MARKETING ---
  {
    id: 'rag-mkt-001',
    codigo: 'MKT-SOP-01',
    departamentoId: 'marketing',
    departamentoNombre: 'Marketing & Growth',
    titulo: 'Política de Descuentos Comerciales, Catas y Eventos Gastronómicos',
    categoria: 'Promociones & Eventos',
    vigencia: '2025 - 2026',
    resumen: 'Regula el margen máximo de descuento promocional (hasta 12%) en ferias y catas para restaurantes y grupos hosteleros.',
    contenidoCompleto: `
1. OBJETIVO:
Establecer los límites de descuento y presupuesto asignado para degustaciones, catas gourmet y ferias gastronómicas.

2. CONDICIONES Y LÍMITES:
- Descuento máximo permitido en captación inicial: 12% sobre tarifa base para pedidos superiores a €600.
- Presupuesto mensual de catas por comercial: Máximo €350 en producto valorado a precio de coste.
- Eventos autorizados: Ferias oficiales del sector (Salón Gourmets, Madrid Fusión) y catas privadas concertadas con jefes de cocina o directores de F&B.
- Aprobación requerida: Cualquier promoción especial que supere el 12% debe contar con la firma de la Dirección de Marketing y el Director Financiero.
    `.trim(),
    puntosClave: [
      'Descuento máximo en ferias/catas: 12% para pedidos > €600.',
      'Presupuesto mensual de degustación por comercial: €350 a precio de coste.',
      'Autorización de Dirección requerida para condiciones superiores al 12%.',
    ],
    tags: ['descuentos', 'promociones', 'catas', 'eventos', 'ferias', 'marketing'],
  },
  {
    id: 'rag-mkt-002',
    codigo: 'MKT-SOP-02',
    departamentoId: 'marketing',
    departamentoNombre: 'Marketing & Growth',
    titulo: 'Protocolo de Cualificación de Leads B2B y SLA de Contacto Comercial',
    categoria: 'Generación de Demanda',
    vigencia: '2025 - 2026',
    resumen: 'SLA estricto de contacto inferior a 2 horas para solicitudes de restaurantes y hoteles recibidas a través de la web.',
    contenidoCompleto: `
1. TIEMPO DE RESPUESTA (SLA):
Todo lead B2B entrante desde la web o campañas de LinkedIn/Google Ads debe recibir llamada o WhatsApp Business de cualificación en menos de 2 horas hábiles (09:00 a 19:00).

2. CRITERIOS DE CUALIFICACIÓN (BANT):
- Volumen de compra estimado superior a €500/mes.
- Negocio con CIF activo en hostelería, restauración o alimentación gourmet.
- Ubicación dentro de rutas logísticas directas o zona peninsular cubierta.
    `.trim(),
    puntosClave: [
      'SLA de respuesta: menos de 2 horas hábiles tras recibir el lead.',
      'Pedido mínimo estimado para alta de cuenta: €500/mes.',
      'Sincronización obligatoria del contacto en HubSpot CRM.',
    ],
    tags: ['leads', 'sla', 'cualificacion', 'hubspot', 'contacto', 'marketing'],
  },

  // --- CONTABILIDAD ---
  {
    id: 'rag-cnt-001',
    codigo: 'CNT-SOP-01',
    departamentoId: 'contabilidad',
    departamentoNombre: 'Contabilidad & Finanzas',
    titulo: 'Condiciones de Pago a Clientes Hosteleros y Protocolo de Bloqueo por Mora',
    categoria: 'Gestión de Cobros & Tesorería',
    vigencia: '2025 - 2026',
    resumen: 'Plazos de cobro SEPA a 30 días y bloqueo automático de nuevos pedidos si existen facturas vencidas con más de 15 días.',
    contenidoCompleto: `
1. FORMAS Y PLAZOS DE PAGO:
- Nuevos clientes: Primeros 3 pedidos mediante Transferencia Previa o Tarjeta al contado.
- Clientes habituales verificados: Domiciliación Bancaria SEPA a 30 días fecha factura (máximo 60 días para cadenas hoteleras homologadas).

2. PROTOCOLO DE MOROSIDAD Y BLOQUEO:
- Día 1 tras vencimiento: Recordatorio amistoso automatizado vía email/WhatsApp.
- Día 7 tras vencimiento: Llamada del gestor de cobros y retención de descuentos.
- Día 15 tras vencimiento: BLOQUEO AUTOMÁTICO en almacén. No se expide ningún nuevo pedido hasta la liquidación total de la deuda.
- Día 30 tras vencimiento: Traslado del expediente al departamento jurídico para reclamación formal.
    `.trim(),
    puntosClave: [
      'Plazo estándar: SEPA 30 días fecha factura (máx. 60 días en hoteles).',
      'Primeros 3 pedidos: Pago por adelantado obligatorio.',
      'Bloqueo de pedidos a los 15 días de vencimiento impagado.',
    ],
    tags: ['cobros', 'mora', 'plazos', 'sepa', 'bloqueo', 'facturas', 'contabilidad'],
  },
  {
    id: 'rag-cnt-002',
    codigo: 'CNT-SOP-02',
    departamentoId: 'contabilidad',
    departamentoNombre: 'Contabilidad & Finanzas',
    titulo: 'Guía de Tipos de IVA Alimentario y Emisión de Notas de Abono',
    categoria: 'Fiscalidad & Facturación',
    vigencia: '2025 - 2026',
    resumen: 'Desglose oficial de IVA: 4% superreducido (quesos y básicos), 10% reducido (aceites, jamones, conservas) y 21% general (vinos y licores).',
    contenidoCompleto: `
1. DESGLOSE DE IVA POR LÍNEA DE PRODUCTO:
- IVA Superreducido (4%): Quesos artesanos de leche natural, panadería y productos frescos básicos.
- IVA Reducido (10%): Aceites de oliva virgen extra (AOVE), jamones ibéricos, embutidos curados, conservas de pescado y arroces.
- IVA General (21%): Vinos, licores, bebidas alcohólicas y servicios de transporte o consultoría.

2. NOTAS DE ABONO Y RECTIFICATIVAS:
- Solo se emiten notas de abono si van acompañadas del albarán de devolución firmado por el transportista o informe de rotura verificado.
    `.trim(),
    puntosClave: [
      'IVA 4%: Quesos frescos y leche cruda.',
      'IVA 10%: Aceites AOVE, jamón ibérico, conservas y arroz.',
      'IVA 21%: Vinos de bodega y bebidas alcohólicas.',
      'Abonos requieren albarán de devolución o parte de rotura.',
    ],
    tags: ['iva', 'impuestos', 'facturacion', 'abonos', 'fiscalidad', 'contabilidad'],
  },

  // --- VENTAS ---
  {
    id: 'rag-vnt-001',
    codigo: 'VNT-SOP-01',
    departamentoId: 'ventas',
    departamentoNombre: 'Ventas & Comercial',
    titulo: 'Política de Pedido Mínimo para Entrega Gratuita y Portes',
    categoria: 'Condiciones Comerciales',
    vigencia: '2025 - 2026',
    resumen: 'Pedido mínimo sin coste de transporte: €180 en Comunidad de Madrid y €300 en resto de España peninsular.',
    contenidoCompleto: `
1. UMBRALES DE PEDIDO MÍNIMO:
- Comunidad de Madrid (Ruta propia): Pedido mínimo para envío gratis: €180 netos. Si el pedido es inferior, se cargará un suplemento de portes de €14,50.
- Península (Logística refrigerada externa): Pedido mínimo para envío gratis: €300 netos. Para importes inferiores, suplemento de €28,00.
- Baleares y Canarias: Pedido mínimo €650 con portes cotizados según cubicaje.

2. EXCLUSIVIDAD DE CARTA:
Los restaurantes que garanticen compra exclusiva de AOVE y Jamón Ibérico (> €1.500/mes) disfrutan de un 5% adicional de rappel trimestral.
    `.trim(),
    puntosClave: [
      'Envío gratuito Madrid: pedidos desde €180 (portes €14,50 si es menor).',
      'Envío gratuito Península: pedidos desde €300 (portes €28 si es menor).',
      'Rappel trimestral del 5% por exclusividad en compras > €1.500/mes.',
    ],
    tags: ['pedido minimo', 'portes', 'envios', 'tarifas', 'comercial', 'ventas'],
  },
  {
    id: 'rag-vnt-002',
    codigo: 'VNT-SOP-02',
    departamentoId: 'ventas',
    departamentoNombre: 'Ventas & Comercial',
    titulo: 'Protocolo de Muestras Gratuitas y Escala de Comisiones Comerciales',
    categoria: 'Incentivos & Muestrarios',
    vigencia: '2025 - 2026',
    resumen: 'Envío de sobres de jamón loncheado y botellines AOVE para prospección. Comisiones de comerciales del 3% al 7% según margen.',
    contenidoCompleto: `
1. ENVÍO DE MUESTRARIOS A CLIENTES POTENCIALES:
- Se autoriza el envío de 1 kit de cata (2 sobres de jamón ibérico 100g + 1 botella AOVE 250ml) por restaurante prospectado con ticket medio > €35.

2. BAREMO DE COMISIONES COMERCIALES:
- Productos de margen alto (>35%, Vinos y Conservas): 7% de comisión sobre venta neta cobrada.
- Productos de margen medio (25%-35%, Jamones y Quesos): 5% de comisión.
- Productos de alta rotación y margen ajustado (<25%, AOVE y Arroces): 3% de comisión.
    `.trim(),
    puntosClave: [
      'Kit de cata autorizado para restaurantes con ticket > €35.',
      'Comisiones: 7% (Vinos/Conservas), 5% (Ibéricos/Quesos), 3% (Aceite AOVE/Arroz).',
      'Comisiones liquidadas a mes vencido sobre facturas efectivamente cobradas.',
    ],
    tags: ['muestras', 'comisiones', 'incentivos', 'vendedores', 'ventas'],
  },

  // --- PRODUCCIÓN Y LOGÍSTICA ---
  {
    id: 'rag-log-001',
    codigo: 'LOG-SOP-01',
    departamentoId: 'produccion',
    departamentoNombre: 'Producción & Logística',
    titulo: 'Protocolo de Mantenimiento de la Cadena de Frío y Control Sanitario',
    categoria: 'Seguridad Alimentaria & Calidad',
    vigencia: '2025 - 2026',
    resumen: 'Rango térmico obligatorio: 2°C a 4°C para quesos y embutidos frescos; 14°C a 18°C para vinos y aceites.',
    contenidoCompleto: `
1. ESPECIFICACIONES DE TEMPERATURA:
- Cámara frigorífica 1 (Quesos y Embutidos): Mantener entre 2,0 °C y 4,5 °C permanentemente.
- Cámara climatizada 2 (Vinos, AOVE y Conservas): Mantener entre 14,0 °C y 18,0 °C para evitar degradación organoléptica.
- Vehículos de reparto: Termógrafos calibrados con registro continuo cada 15 minutos durante la ruta.

2. PROTOCOLO DE ALERTA:
Cualquier desviación térmica superior a 2 horas invalida la expedición del lote para su reauditoría de calidad.
    `.trim(),
    puntosClave: [
      'Temperatura quesos y embutidos: 2,0 °C - 4,5 °C.',
      'Temperatura vinos y AOVE: 14,0 °C - 18,0 °C.',
      'Termógrafos en camiones con registro cada 15 minutos.',
    ],
    tags: ['cadena de frio', 'temperatura', 'sanidad', 'calidad', 'camaras', 'logistica'],
  },
  {
    id: 'rag-log-002',
    codigo: 'LOG-SOP-02',
    departamentoId: 'produccion',
    departamentoNombre: 'Producción & Logística',
    titulo: 'Ventanas Horarias de Entrega en Cocina y Gestión de Incidencias en Descarga',
    categoria: 'Operaciones de Transporte',
    vigencia: '2025 - 2026',
    resumen: 'Horario estricto de entrega a restaurantes entre 08:00 y 11:30 antes del servicio de almuerzos.',
    contenidoCompleto: `
1. FRANJAS HORARIAS DE DESCARGA:
- Franja Preferente (Restaurantes y Hoteles): 08:00 a 11:30 horas (antes del montaje y preparación de cocina).
- Franja Tarde (Locales de noche / Bares de copas): 16:30 a 19:30 horas.
- Queda terminantemente prohibido realizar descargas entre las 13:30 y las 16:00 (hora punta de servicio de comidas).

2. GESTIÓN DE DEVOLUCIONES Y ROTURAS:
- Cualquier producto golpeado o defectuoso debe ser anotado en el albarán digital con foto y firma del jefe de cocina en un plazo máximo de 24 horas.
    `.trim(),
    puntosClave: [
      'Entrega preferente en restaurantes: 08:00 - 11:30.',
      'Prohibido descargar durante servicio de comidas (13:30 - 16:00).',
      'Plazo máximo para notificar incidencias/roturas: 24 horas con foto.',
    ],
    tags: ['entregas', 'horarios', 'restaurantes', 'albaran', 'devoluciones', 'logistica'],
  },

  // --- RECURSOS HUMANOS ---
  {
    id: 'rag-rrh-001',
    codigo: 'RRH-SOP-01',
    departamentoId: 'rrhh',
    departamentoNombre: 'Recursos Humanos & Talento',
    titulo: 'Convenio de Mayoristas de Alimentación, Turnos y Política de Horas Extra',
    categoria: 'Relaciones Laborales & Nóminas',
    vigencia: '2025 - 2026',
    resumen: 'Jornada anual de 1.770 horas, turnos rotativos de almacén y compensación de horas extraordinarias con un 50% de recargo.',
    contenidoCompleto: `
1. JORNADA Y TURNOS DE TRABAJO:
- Almacén y Mozo de Cámara: Turno Mañana (06:00 - 14:00) y Turno Tarde (13:30 - 21:30).
- Equipo Comercial y Administración: 08:30 a 17:30 (lunes a jueves) y 08:00 a 15:00 (viernes).

2. POLÍTICA DE HORAS EXTRAORDINARIAS:
- Se limitan a un máximo legal de 80 horas anuales por empleado.
- Compensación: Se abonan con un recargo del 50% sobre la hora ordinaria o mediante descanso equivalente (1,5 horas de descanso por cada hora extra trabajada) dentro de los 4 meses siguientes.
    `.trim(),
    puntosClave: [
      'Jornada de almacén: Turno Mañana (06:00-14:00) y Tarde (13:30-21:30).',
      'Máximo 80 horas extraordinarias al año por trabajador.',
      'Recargo del 50% en horas extra o 1,5 horas de descanso compensatorio.',
    ],
    tags: ['convenio', 'turnos', 'horas extra', 'nominas', 'jornada', 'rrhh'],
  },
  {
    id: 'rag-rrh-002',
    codigo: 'RRH-SOP-02',
    departamentoId: 'rrhh',
    departamentoNombre: 'Recursos Humanos & Talento',
    titulo: 'Plan de Prevención de Riesgos Laborales en Almacén y Manejo de Cargas',
    categoria: 'Salud Laboral & PRL',
    vigencia: '2025 - 2026',
    resumen: 'Uso obligatorio de botas de seguridad S3, chaleco reflectante y límite de levantamiento manual a 25 kg por persona.',
    contenidoCompleto: `
1. EQUIPOS DE PROTECCIÓN INDIVIDUAL (EPIs):
- Obligatorio en nave y muelle: Calzado de seguridad con puntera reforzada S3, chaleco de alta visibilidad y guantes térmicos en cámaras frigoríficas.

2. MANIPULACIÓN MANUAL DE CARGAS:
- Peso máximo por persona: 25 kg en condiciones ideales (15 kg para cargas repetitivas como sacos de arroz o garrafas de AOVE).
- Cargas superiores a 25 kg: Uso obligatorio de transpaleta eléctrica, carretilla elevadora o manipulación en equipo de dos personas.
    `.trim(),
    puntosClave: [
      'EPIs obligatorios: Calzado S3, chaleco reflectante y ropa térmica en cámaras.',
      'Límite de carga manual: 25 kg (15 kg en manipulación continua).',
      'Uso obligado de transpaletas para cajas de AOVE y sacos pesados.',
    ],
    tags: ['prl', 'seguridad', 'epis', 'almacen', 'cargas', 'riesgos', 'rrhh'],
  },
];


