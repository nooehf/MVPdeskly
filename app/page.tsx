'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Trash2,
  Bot,
  User,
  Sparkles,
  Calendar,
  Building2,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Receipt,
  Users,
  Wallet,
  PieChart,
  ChevronDown,
  Zap,
  Megaphone,
  Calculator,
  Briefcase,
  Cpu,
  UserCheck,
  Network,
  X,
  Crown,
  Flag,
  AlertTriangle,
  LogIn,
  LogOut,
  Timer,
} from 'lucide-react';

interface ToolLog {
  tool: string;
  args: any;
  result: any;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  toolLogs?: ToolLog[];
  timestamp: string;
}

interface ReporteIncidencia {
  departamento: string;
  emisor: string;
  cargo: string;
  destinatario: string;
  asunto: string;
  mensaje: string;
  sugerenciaIA: string;
}

const DEPARTAMENTOS_DATA = [
  {
    id: 'marketing',
    nombre: 'Marketing',
    icono: Megaphone,
    color: 'text-pink-400',
    colorBg: 'bg-pink-500/10',
    colorBorder: 'border-pink-500/30',
    descripcion: 'Campañas B2B, ferias gastronómicas y captación de restaurantes',
    director: 'Elena Gómez (Head of Growth)',
    trabajadores: [
      { rol: 'Especialista Performance Ads', detalle: 'Google & LinkedIn Ads (€2.000/mes)' },
      { rol: 'Content & Brand Creator', detalle: 'Catálogos gourmet y ferias del sector' },
    ],
    normativasRAG: [
      {
        codigo: 'MKT-SOP-01',
        titulo: 'Descuentos Comerciales & Catas',
        resumen: 'Máx. 12% de descuento en ferias (>€600) y €350/mes por comercial en degustaciones.',
        tags: ['Descuentos máx 12%', 'Presupuesto catas €350/mes', 'Aprobación de Dirección'],
      },
      {
        codigo: 'MKT-SOP-02',
        titulo: 'Protocolo & SLA de Leads B2B',
        resumen: 'SLA de contacto obligatorio < 2h para solicitudes de restaurantes y hoteles recibidas en web.',
        tags: ['SLA < 2 horas', 'BANT > €500/mes', 'Sincronización HubSpot'],
      },
    ],
    prompt: 'Consulta el sistema RAG para el departamento de Marketing: ¿cuál es la política de descuentos máximos en ferias gastronómicas y el SLA de contacto para nuevos leads?',
    reporte: {
      departamento: 'Marketing & Growth',
      emisor: 'Elena Gómez',
      cargo: 'Directora de Marketing & Growth',
      destinatario: 'CEO / Dirección General',
      asunto: 'Desviación en atribución de leads B2B y cálculo de CAC en la IA',
      mensaje: 'Hola,\n\nTe escribo porque hemos detectado un problema en las respuestas automáticas de la IA para nuestro departamento. Al solicitar el retorno de inversión y el coste de adquisición (CAC) de las campañas de marketing (€2.000 invertidos entre LinkedIn y Google Ads), la IA no está asociando correctamente los leads entrantes con la etapa comercial en HubSpot CRM.\n\nEsto provoca que calcule un coste por lead inflado y no refleje las conversiones reales de las demos agendadas. ¿Podemos calibrar la integración de Function Calling para que cruce los datos de gasto con los deals cerrados de este mes?',
      sugerenciaIA: 'Revisa y recalibra la métrica de CAC y cruce de leads de Marketing con el pipeline de HubSpot.',
    },
  },
  {
    id: 'contabilidad',
    nombre: 'Contabilidad',
    icono: Calculator,
    color: 'text-emerald-400',
    colorBg: 'bg-emerald-500/10',
    colorBorder: 'border-emerald-500/30',
    descripcion: 'Facturas a hostelería, IVA alimentario, cobros y mora',
    director: 'Marta Rivas (Directora Financiera / CFO)',
    trabajadores: [
      { rol: 'Responsable de Facturación', detalle: 'Cobros SEPA a 30/60 días y control de IVA' },
      { rol: 'Gestoría Externa Asociada', detalle: 'Asesoría fiscal, laboral y tributos' },
    ],
    normativasRAG: [
      {
        codigo: 'CNT-SOP-01',
        titulo: 'Cobros SEPA & Bloqueo por Mora',
        resumen: 'Cobros a 30 días fecha factura. Bloqueo automático de pedidos si hay mora superior a 15 días.',
        tags: ['SEPA 30 días', 'Pago previo clientes nuevos', 'Bloqueo a los 15 días'],
      },
      {
        codigo: 'CNT-SOP-02',
        titulo: 'Guía de IVA Alimentario & Abonos',
        resumen: 'IVA 4% en quesos frescos, 10% en aceites/jamones/conservas/arroz y 21% en vinos/licores.',
        tags: ['IVA 4% / 10% / 21%', 'Notas de abono', 'Justificante de devolución'],
      },
    ],
    prompt: 'Consulta el sistema RAG de Contabilidad: ¿cuáles son los plazos de cobro SEPA permitidos y cuándo se bloquean los pedidos por morosidad?',
    reporte: {
      departamento: 'Contabilidad & Finanzas',
      emisor: 'Marta Rivas',
      cargo: 'Directora Financiera (CFO)',
      destinatario: 'CEO / Dirección General',
      asunto: 'Falta de desglose de IVA y vencimiento SEPA en avisos de mora automáticos',
      mensaje: 'Hola,\n\nTe paso reporte de una incidencia en el módulo contable de la IA. La inteligencia artificial identificó correctamente la factura vencida de Retail Global eCommerce (€2.299,00), pero al formular la notificación de cobro automático no incluyó el desglose del 21% de IVA ni especificó la cuenta bancaria para la transferencia SEPA.\n\nPara evitar retrasos en tesorería y agilizar el cobro de los €10.406 pendientes de este mes, necesitamos que la IA genere el desglose fiscal completo y el enlace de pago directo en cada recordatorio.',
      sugerenciaIA: 'Corrige la plantilla de reclamación de facturas de Contabilidad añadiendo desglose de IVA y datos bancarios SEPA.',
    },
  },
  {
    id: 'ventas',
    nombre: 'Ventas',
    icono: Briefcase,
    color: 'text-amber-400',
    colorBg: 'bg-amber-500/10',
    colorBorder: 'border-amber-500/30',
    descripcion: 'Pipeline comercial, grupos hosteleros y pedidos',
    director: 'David Morales (Head of Sales)',
    trabajadores: [
      { rol: 'David Morales (Account Executive)', detalle: 'Cuentas clave y grupos de restauración' },
      { rol: 'SDR Prospección Horeca', detalle: 'Cualificación y catas concertadas' },
    ],
    normativasRAG: [
      {
        codigo: 'VNT-SOP-01',
        titulo: 'Pedido Mínimo & Portes Gratis',
        resumen: 'Envío gratuito desde €180 netos en Madrid (portes €14,50) y desde €300 en Península (portes €28).',
        tags: ['Mínimo Madrid €180', 'Mínimo Península €300', 'Rappel 5% exclusividad'],
      },
      {
        codigo: 'VNT-SOP-02',
        titulo: 'Muestrarios & Comisiones',
        resumen: 'Envío de kit de cata (jamón + AOVE) y escala de comisiones comerciales del 3% al 7%.',
        tags: ['Kits de cata gratuitos', 'Comisiones 3% a 7%', 'Ticket medio > €35'],
      },
    ],
    prompt: 'Consulta el sistema RAG de Ventas: ¿cuál es el pedido mínimo para que un restaurante tenga envío gratis y qué escala de comisiones se aplica?',
    reporte: {
      departamento: 'Ventas & Desarrollo de Negocio',
      emisor: 'David Morales',
      cargo: 'Senior Account Executive (Head of Sales)',
      destinatario: 'CEO / Dirección General',
      asunto: 'Fallo en la sincronización de recordatorios a 48h en Google Calendar',
      mensaje: 'Hola,\n\nQuería informarte de una incidencia en el pipeline de ventas. Al consultar a la IA los deals en negociación (como Banco Atlántico por €48.000/año y Grupo Asegurador Prevención por €36.000/año), la IA muestra bien el estado del CRM, pero no está programando automáticamente en mi Google Calendar la alerta de llamada de seguimiento a las 48 horas.\n\nEn cuentas Enterprise con tickets tan altos necesitamos que la sincronización entre HubSpot y Calendar sea 100% proactiva para que no se enfríe ninguna oportunidad.',
      sugerenciaIA: 'Configura el agendamiento automático de recordatorios en Google Calendar para deals en negociación en HubSpot.',
    },
  },
  {
    id: 'produccion',
    nombre: 'Producción & Logística',
    icono: Cpu,
    color: 'text-cyan-400',
    colorBg: 'bg-cyan-500/10',
    colorBorder: 'border-cyan-500/30',
    descripcion: 'Cadena de frío, almacén frigorífico y rutas de reparto',
    director: 'Carlos Vega (Director de Logística & Cadena de Suministro)',
    trabajadores: [
      { rol: 'Jefe de Almacén & Muelle', detalle: 'Control de stocks y recepción de proveedores' },
      { rol: 'Coordinador de Flota Refrigerada', detalle: 'Rutas de reparto urgente a hostelería' },
    ],
    normativasRAG: [
      {
        codigo: 'LOG-SOP-01',
        titulo: 'Cadena de Frío & Termógrafos',
        resumen: 'Rango obligatorio: 2°C a 4,5°C en quesos/embutidos y 14°C a 18°C en vinos/aceites con registro continuo.',
        tags: ['Cámaras 2°C - 4.5°C', 'Bodega 14°C - 18°C', 'Lectura cada 15 min'],
      },
      {
        codigo: 'LOG-SOP-02',
        titulo: 'Ventanas Horarias de Entrega',
        resumen: 'Descargas a restaurantes de 08:00 a 11:30. Prohibido descargar entre 13:30 y 16:00.',
        tags: ['Horario 08:00 - 11:30', 'Prohibido en comidas', 'Devoluciones máx 24h'],
      },
    ],
    prompt: 'Consulta el sistema RAG de Producción y Logística: ¿cuáles son los rangos de temperatura obligatorios de la cadena de frío y el horario límite de descarga en restaurantes?',
    reporte: {
      departamento: 'Producción & Logística',
      emisor: 'Carlos Vega',
      cargo: 'Director de Logística',
      destinatario: 'CEO / Dirección General',
      asunto: 'Falta de alertas térmicas automáticas en las rutas de reparto refrigerado',
      mensaje: 'Hola,\n\nTe envío un reporte sobre el módulo logístico. Aunque los termógrafos registran bien la temperatura en los camiones, la IA no nos avisa automáticamente si una cámara supera los 4,5 °C durante más de 30 minutos.\n\nNecesitamos que el asistente active una alerta prioritaria en pantalla cuando se detecte una anomalía térmica para actuar antes de que afecte a la calidad de los quesos o jamones.',
      sugerenciaIA: 'Añade alertas en tiempo real de ruptura de cadena de frío en el módulo de Producción y Logística.',
    },
  },
  {
    id: 'rrhh',
    nombre: 'RRHH',
    icono: UserCheck,
    color: 'text-indigo-400',
    colorBg: 'bg-indigo-500/10',
    colorBorder: 'border-indigo-500/30',
    descripcion: 'Turnos de almacén, convenio colectivo, nóminas y PRL',
    director: 'Lucía Benítez (Directora de Personas & Talento)',
    trabajadores: [
      { rol: 'People & Operations Lead', detalle: 'Nóminas (€17.8k/mes) y Seguridad Social' },
      { rol: 'Técnico de PRL y Turnos', detalle: 'Prevención de riesgos, EPIs y cuadrantes' },
    ],
    normativasRAG: [
      {
        codigo: 'RRH-SOP-01',
        titulo: 'Convenio, Turnos & Horas Extra',
        resumen: 'Jornada anual de 1.770h. Turnos de almacén (06:00-14:00 y 13:30-21:30). Horas extra con 50% de recargo.',
        tags: ['Turno 06:00 / 13:30', 'Máx 80h extra/año', 'Recargo 50% en extras'],
      },
      {
        codigo: 'RRH-SOP-02',
        titulo: 'PRL en Almacén & Límite de Carga',
        resumen: 'Botas S3 obligatorias, chaleco reflectante y levantamiento manual limitado a 25 kg.',
        tags: ['Calzado S3 obligatorio', 'Límite manual 25 kg', 'Uso de transpaletas'],
      },
    ],
    prompt: 'Consulta el sistema RAG de Recursos Humanos: ¿cuáles son los turnos de trabajo en el almacén y cuál es el límite máximo legal de levantamiento de carga por persona?',
    reporte: {
      departamento: 'Recursos Humanos & Talento',
      emisor: 'Lucía Benítez',
      cargo: 'Directora de Personas & Talento',
      destinatario: 'CEO / Dirección General',
      asunto: 'Falta de estimación de tramos de IRPF en la simulación de nuevas contrataciones',
      mensaje: 'Hola,\n\nTe escribo para reportar una mejora necesaria en el módulo de RRHH de la IA. Al solicitar la simulación de coste total para la contratación del nuevo comercial y del mozo de almacén, la IA calcula la Seguridad Social pero no desglosa las retenciones de IRPF según el tramo salarial.\n\nSería conveniente ajustar la lógica financiera para que entregue la ficha completa: Bruto anual, Neto mensual, Seguridad Social empresa e IRPF estimado.',
      sugerenciaIA: 'Añade el cálculo personalizado de retenciones de IRPF y coste total en las simulaciones de contratación de RRHH.',
    },
  },
];

const ORGANIGRAMA_CEO = {
  titulo: 'CEO / Dirección General',
  subtitulo: 'Dirección Ejecutiva & Estrategia',
  responsabilidades: ['Supervisión de KPIs y Runway', 'Alineación Estratégica', 'Toma de Decisiones Global'],
};

const QUICK_PROMPTS = [
  {
    icon: Sparkles,
    label: 'Normativas y Pedido Mínimo (RAG)',
    prompt: 'Consulta en el sistema RAG: ¿cuál es la política de pedido mínimo para envíos gratis, los plazos de cobro SEPA y el protocolo de cadena de frío?',
  },
  {
    icon: Sparkles,
    label: 'Producto más vendido y precios',
    prompt: '¿Cuál es el precio de nuestro producto más vendido y qué otros productos de alimentación tenemos en catálogo?',
  },
  {
    icon: TrendingUp,
    label: 'Resumen Financiero y KPIs',
    prompt: 'Dame un resumen financiero ejecutivo de nuestra distribuidora: facturación mensual (MRR), costes, EBITDA y tesorería disponible.',
  },
  {
    icon: Receipt,
    label: 'Facturas pendientes de clientes',
    prompt: '¿Qué facturas a restaurantes y grupos hosteleros tenemos pendientes de cobro o vencidas?',
  },
  {
    icon: PieChart,
    label: 'Desglose de Costes Operativos',
    prompt: '¿Cuánto estamos gastando mensualmente en nóminas de equipo, naves frigoríficas, logística y suministros?',
  },
  {
    icon: Users,
    label: 'Cartera de Clientes Hostelería',
    prompt: 'Muéstrame la lista de nuestros principales clientes hosteleros, su volumen de pedidos y estado de cuenta.',
  },
  {
    icon: Calendar,
    label: 'Agenda y Visitas de hoy',
    prompt: '¿Qué reuniones, catas o visitas comerciales a restaurantes tengo programadas para hoy?',
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      content:
        '¡Hola! Soy **Deskly**, tu Asistente Ejecutivo y Operativo para nuestra **Distribuidora de Alimentos y Bebidas**.\n\nTengo acceso en tiempo real a:\n- 📦 **Catálogo de Alimentos & Precios**: Aceites AOVE, Ibéricos de bellota, Quesos D.O., Vinos y Conservas.\n- 📊 **Finanzas & KPIs**: Facturación mensual recurrente, EBITDA, márgenes y tesorería en banco.\n- 🧾 **Facturación a Clientes**: Facturas emitidas a restaurantes y hoteles, cobros y mora.\n- 💰 **Costes Operativos**: Nóminas de equipo comercial y almacén, flota logística y naves frigoríficas.\n- 📅 **Google Calendar**: Visitas comerciales, catas y reuniones de dirección.\n\n¿Qué deseas consultar o gestionar?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeptMenuOpen, setIsDeptMenuOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReporteIncidencia | null>(null);
  const [reportFormData, setReportFormData] = useState<ReporteIncidencia | null>(null);
  const [reportCopied, setReportCopied] = useState(false);

  // Estados de Fichaje / Control Horario
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [fichajeToast, setFichajeToast] = useState<{ tipo: 'entrada' | 'salida'; hora: string; duracion?: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const deptMenuRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Contador de tiempo trabajado cuando está fichado
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isClockedIn) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn]);

  // Ajuste automático de altura del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  // Cierre del menú de departamentos al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deptMenuRef.current && !deptMenuRef.current.contains(event.target as Node)) {
        setIsDeptMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar modales con tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (selectedReport) {
          setSelectedReport(null);
        } else if (isMapModalOpen) {
          setIsMapModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedReport, isMapModalOpen]);

  // Formatear segundos a HH:MM:SS
  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Manejador para Fichar Entrada / Salida
  const handleToggleFichaje = () => {
    const now = new Date();
    const horaStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(horaStr);
      setElapsedSeconds(0);
      setFichajeToast({ tipo: 'entrada', hora: horaStr });
      setTimeout(() => setFichajeToast(null), 4000);
    } else {
      const duracionStr = formatElapsed(elapsedSeconds);
      setIsClockedIn(false);
      setFichajeToast({ tipo: 'salida', hora: horaStr, duracion: duracionStr });
      setClockInTime(null);
      setElapsedSeconds(0);
      setTimeout(() => setFichajeToast(null), 5000);
    }
  };

  // Abrir reporte pre-rellenado
  const handleOpenReport = (reporte: ReporteIncidencia) => {
    setSelectedReport(reporte);
    setReportFormData({ ...reporte });
    setReportCopied(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    setError(null);
    setInput('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Agregar mensaje del usuario a la lista
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Filtrar historial para enviar al backend (excluyendo mensaje de bienvenida inicial)
      const apiPayloadMessages = updatedMessages
        .filter((m) => m.id !== 'welcome-msg')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiPayloadMessages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Error en el servidor (${res.status})`);
      }

      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'model',
        content: data.content || 'Sin respuesta.',
        toolLogs: data.toolLogs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error al enviar mensaje:', err);
      setError(err?.message || 'Ocurrió un error al comunicarse con el asistente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReportToAI = () => {
    if (!reportFormData) return;
    const promptToSend = `[REPORTE DE INCIDENCIA DE ${reportFormData.emisor.toUpperCase()} - DEPARTAMENTO DE ${reportFormData.departamento.toUpperCase()}]:\nAsunto: ${reportFormData.asunto}\n\n${reportFormData.mensaje}\n\nPor favor, como asistente operativo y ejecutivo, analiza esta incidencia del departamento, audita los datos correspondientes en el backend y propón una solución o corrección inmediata.`;
    setSelectedReport(null);
    setIsMapModalOpen(false);
    handleSendMessage(promptToSend);
  };

  const handleCopyReportText = () => {
    if (!reportFormData) return;
    const textToCopy = `DE: ${reportFormData.emisor} (${reportFormData.cargo})\nPARA: ${reportFormData.destinatario}\nDEPARTAMENTO: ${reportFormData.departamento}\nASUNTO: ${reportFormData.asunto}\n\n${reportFormData.mensaje}`;
    navigator.clipboard.writeText(textToCopy);
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 2500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'model',
        content:
          'Conversación reiniciada. Puedes preguntarme cualquier consulta sobre **finanzas, facturación, costes, clientes, calendario o CRM**.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setError(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatToolName = (name: string) => {
    switch (name) {
      case 'agendarEventoCalendario':
        return 'Google Calendar: Evento Agendado';
      case 'crearOActualizarContactoCRM':
        return 'CRM: Contacto Registrado';
      case 'crearDealCRM':
        return 'CRM: Deal Guardado en Pipeline';
      case 'emitirFactura':
        return 'Contabilidad: Factura Emitida';
      case 'consultarResumenFinanciero':
        return 'Finanzas: Resumen Ejecutivo & KPIs';
      case 'consultarFacturas':
        return 'Contabilidad: Consulta de Facturación';
      case 'consultarCostesYGastos':
        return 'Costes: Desglose de Gastos';
      case 'consultarCarteraClientes':
        return 'ERP: Cartera de Clientes';
      case 'analizarRentabilidadCliente':
        return 'Finanzas: Rentabilidad de Cliente';
      case 'consultarCatalogoProductos':
        return 'Catálogo: Consulta de Productos';
      case 'consultarNormativasRAG':
        return 'Base RAG: Normativa Consultada';
      case 'buscarContactoHubspot':
        return 'CRM: Búsqueda de Contacto';
      case 'obtenerDealsHubspot':
        return 'CRM: Pipeline de Ventas';
      case 'obtenerEventosCalendario':
        return 'Calendar: Consulta de Agenda';
      default:
        return name;
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#080E1E] text-slate-100">
      {/* Toast Notificación Flotante de Fichaje */}
      {fichajeToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div
            className={`p-3.5 sm:p-4 rounded-xl border shadow-2xl backdrop-blur-xl flex items-center gap-3 ${
              fichajeToast.tipo === 'entrada'
                ? 'bg-[#0D1730]/95 border-[#1A6BFF]/50 text-blue-200 shadow-blue-500/10'
                : 'bg-[#0D1730]/95 border-[#1B2C5B] text-slate-200'
            }`}
          >
            <div
              className={`p-2 rounded-lg shrink-0 ${
                fichajeToast.tipo === 'entrada' ? 'bg-[#1A6BFF]/20 text-[#1A6BFF]' : 'bg-[#132145] text-slate-400'
              }`}
            >
              {fichajeToast.tipo === 'entrada' ? <LogIn className="h-5 w-5" /> : <LogOut className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">
                {fichajeToast.tipo === 'entrada' ? '✅ Jornada Iniciada' : '🏁 Jornada Finalizada'}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                {fichajeToast.tipo === 'entrada'
                  ? `Fichaje de entrada registrado a las ${fichajeToast.hora} en RRHH.`
                  : `Fichaje de salida a las ${fichajeToast.hora} (Tiempo trabajado: ${fichajeToast.duracion}).`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Superior Responsivo */}
      <header className="border-b border-[#1B2C5B] bg-[#0B132B]/85 backdrop-blur-xl px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2 z-20 shadow-md">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 border border-[#1A6BFF]/30 shrink-0 bg-[#080E1E] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/deskly-logo.png" alt="Deskly Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight flex items-center">
              <span className="text-white">Desk</span>
              <span className="text-[#1A6BFF]">ly</span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Distribuidora Mayorista · Operaciones, Catálogo, Finanzas & CRM
            </p>
          </div>
        </div>

        {/* Acciones de la Cabecera Responsivas */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Botón Fichar Entrada / Salida */}
          <button
            onClick={handleToggleFichaje}
            className={`flex items-center gap-1.5 sm:gap-2 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shadow-sm ${
              isClockedIn
                ? 'bg-[#1A6BFF]/15 text-blue-300 border border-[#1A6BFF]/50 hover:bg-[#1A6BFF]/25 shadow-blue-500/10'
                : 'bg-[#0D1730] text-slate-300 hover:text-white border border-[#1B2C5B] hover:border-[#1A6BFF]/50'
            }`}
            title={isClockedIn ? 'Pulsar para fichar salida de la jornada' : 'Pulsar para fichar entrada al trabajo'}
          >
            {isClockedIn ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A6BFF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A6BFF]"></span>
                </span>
                <span className="font-mono text-[11px] sm:text-xs text-blue-200">{formatElapsed(elapsedSeconds)}</span>
                <span className="hidden sm:inline text-slate-500">|</span>
                <span className="text-[11px] sm:text-xs text-red-400 hover:text-red-300 font-medium">Salir</span>
              </>
            ) : (
              <>
                <LogIn className="h-3.5 w-3.5 text-[#1A6BFF] shrink-0" />
                <span className="hidden xs:inline">Fichar entrada</span>
                <span className="xs:hidden">Fichar</span>
              </>
            )}
          </button>

          {/* Botón Panel de Gestión */}
          <button
            onClick={() => setIsMapModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-slate-200 bg-[#0D1730] hover:bg-[#132145] border border-[#1B2C5B] hover:border-[#1A6BFF]/50 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shadow-sm group"
            title="Ver panel de gestión y estructura operativa"
          >
            <Network className="h-3.5 w-3.5 text-[#1A6BFF] group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden sm:inline">Panel de gestión</span>
            <span className="sm:hidden">Panel</span>
          </button>

          {/* Botón y Menú Desplegable de Automatizaciones Departamentos */}
          <div className="relative" ref={deptMenuRef}>
            <button
              onClick={() => setIsDeptMenuOpen((prev) => !prev)}
              disabled={isLoading}
              className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-slate-200 bg-[#0D1730] hover:bg-[#132145] border border-[#1B2C5B] hover:border-[#1A6BFF]/50 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shadow-sm group disabled:opacity-50"
            >
              <Zap className="h-3.5 w-3.5 text-[#1A6BFF] group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden lg:inline">Automatizaciones departamentos</span>
              <span className="lg:hidden">Departamentos</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                  isDeptMenuOpen ? 'rotate-180 text-[#1A6BFF]' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Responsivo */}
            {isDeptMenuOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-80 rounded-xl bg-[#0D1730] border border-[#1B2C5B] shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                <div className="px-2.5 py-1.5 border-b border-[#1B2C5B]/80 mb-1 flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Automatizaciones por Área
                  </p>
                  <span className="text-[10px] text-[#1A6BFF] font-medium bg-[#1A6BFF]/10 px-1.5 py-0.5 rounded border border-[#1A6BFF]/20">
                    5 Departamentos
                  </span>
                </div>
                <div className="space-y-1">
                  {DEPARTAMENTOS_DATA.map((dept) => {
                    const Icon = dept.icono;
                    return (
                      <div
                        key={dept.id}
                        className="flex items-center justify-between gap-1 p-1.5 rounded-lg hover:bg-[#132145] transition-colors group/item"
                      >
                        <button
                          onClick={() => {
                            setIsDeptMenuOpen(false);
                            handleSendMessage(dept.prompt);
                          }}
                          disabled={isLoading}
                          className="flex-1 text-left flex items-start gap-2.5 min-w-0 disabled:opacity-50"
                        >
                          <div className="p-1.5 rounded-md bg-[#080E1E] border border-[#1B2C5B] group-hover/item:border-[#1A6BFF]/40 mt-0.5 shrink-0">
                            <Icon className={`h-4 w-4 ${dept.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-slate-200 group-hover/item:text-[#1A6BFF] block">
                              {dept.nombre}
                            </span>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {dept.descripcion}
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDeptMenuOpen(false);
                            handleOpenReport(dept.reporte);
                          }}
                          className="h-7 px-2 text-[11px] font-medium text-amber-400 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-md transition-colors flex items-center gap-1 shrink-0"
                          title={`Reportar incidencia en ${dept.nombre}`}
                        >
                          <Flag className="h-3 w-3" />
                          <span>Reportar</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Botón Limpiar Chat */}
          <button
            onClick={handleClearChat}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-[#0D1730]/60 hover:bg-[#132145] border border-[#1B2C5B] px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            title="Reiniciar chat"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Limpiar chat</span>
          </button>
        </div>
      </header>

      {/* Modal Ventana Panel de Gestión con Fondo Difuminado (100% Responsivo) */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-5xl max-h-[92vh] bg-[#0D1730] border border-[#1B2C5B] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#1B2C5B] bg-[#0B132B]/95">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[#1A6BFF]/10 border border-[#1A6BFF]/30 flex items-center justify-center text-[#1A6BFF] shadow-sm shrink-0">
                  <Network className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-white">
                    Panel de Gestión & Estructura Operativa
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-400 hidden xs:block">
                    Dirección General, Departamentos, Equipos y Reportes de Incidencias
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-white bg-[#080E1E] hover:bg-[#132145] border border-[#1B2C5B] rounded-lg transition-colors"
                title="Cerrar modal (Esc)"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Contenido del Organigrama */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 no-scrollbar bg-gradient-to-b from-[#0D1730] via-[#080E1E] to-[#0D1730]">
              {/* Nivel 1: CEO / Dirección General */}
              <div className="flex flex-col items-center">
                <div className="relative group max-w-sm w-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1A6BFF] to-blue-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                  <div className="relative bg-[#0B132B] border border-[#1A6BFF]/50 rounded-2xl p-3.5 sm:p-4 text-center shadow-xl">
                    <div className="inline-flex p-2 rounded-xl bg-[#1A6BFF]/10 border border-[#1A6BFF]/20 text-[#1A6BFF] mb-1.5">
                      <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                      {ORGANIGRAMA_CEO.titulo}
                    </h3>
                    <p className="text-xs font-medium text-blue-300 mt-0.5">
                      {ORGANIGRAMA_CEO.subtitulo}
                    </p>
                    <div className="mt-2.5 pt-2.5 border-t border-[#1B2C5B]/80 flex flex-wrap justify-center gap-1.5">
                      {ORGANIGRAMA_CEO.responsabilidades.map((resp, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-[#080E1E] text-slate-300 border border-[#1B2C5B] px-2 py-0.5 rounded-full"
                        >
                          {resp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Línea Conectora Vertical */}
                <div className="w-0.5 h-4 sm:h-6 bg-gradient-to-b from-[#1A6BFF] to-[#1B2C5B]"></div>

                {/* Línea Conectora Horizontal entre Departamentos (Desktop) */}
                <div className="hidden lg:block w-[88%] h-0.5 bg-[#1B2C5B] relative">
                  <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-pink-400"></div>
                  <div className="absolute -top-1 left-1/4 w-2 h-2 rounded-full bg-emerald-400"></div>
                  <div className="absolute -top-1 left-2/4 w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="absolute -top-1 left-3/4 w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-indigo-400"></div>
                </div>
              </div>

              {/* Nivel 2 y 3: Directores de Departamentos y Trabajadores (Grid 100% Responsivo) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 items-stretch">
                {DEPARTAMENTOS_DATA.map((dept) => {
                  const Icon = dept.icono;
                  return (
                    <div
                      key={dept.id}
                      className="flex flex-col justify-between rounded-xl bg-[#0B132B] border border-[#1B2C5B] hover:border-[#1A6BFF]/40 transition-all p-3.5 shadow-lg"
                    >
                      <div className="space-y-3">
                        {/* Cabecera del Departamento */}
                        <div className={`p-3 rounded-lg border ${dept.colorBorder} ${dept.colorBg}`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="p-1 rounded bg-[#080E1E] border border-[#1B2C5B] shrink-0">
                              <Icon className={`h-4 w-4 ${dept.color}`} />
                            </div>
                            <span className={`text-xs font-bold ${dept.color} tracking-wide truncate`}>
                              {dept.nombre}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-200 leading-tight">
                            {dept.director}
                          </p>
                        </div>

                        {/* Trabajadores / Especialistas del Departamento */}
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                            Equipo Directo
                          </p>
                          {dept.trabajadores.map((trabajador, idx) => (
                            <div
                              key={idx}
                              className="bg-[#080E1E] border border-[#1B2C5B]/80 rounded-lg p-2 text-left"
                            >
                              <div className="flex items-center gap-1.5">
                                <User className="h-3 w-3 text-slate-400 shrink-0" />
                                <p className="text-[11px] font-medium text-slate-200 truncate">
                                  {trabajador.rol}
                                </p>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                                {trabajador.detalle}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Base de Conocimiento RAG (Normativas y Protocolos Indexados) */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between px-1">
                            <p className="text-[10px] font-bold text-[#1A6BFF] uppercase tracking-wider flex items-center gap-1">
                              <span>📚 Normativas RAG</span>
                            </p>
                            <span className="text-[9px] bg-[#1A6BFF]/15 text-blue-300 px-1.5 py-0.2 rounded border border-[#1A6BFF]/30">
                              {dept.normativasRAG.length} SOPs
                            </span>
                          </div>
                          {dept.normativasRAG.map((norm, nIdx) => (
                            <div
                              key={nIdx}
                              className="bg-[#080E1E]/90 border border-[#1B2C5B] rounded-lg p-2 text-left hover:border-[#1A6BFF]/40 transition-colors"
                            >
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="text-[10px] font-mono font-bold text-blue-400 bg-[#1A6BFF]/10 px-1 py-0.2 rounded">
                                  {norm.codigo}
                                </span>
                              </div>
                              <p className="text-[11px] font-semibold text-slate-200 leading-tight">
                                {norm.titulo}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                                {norm.resumen}
                              </p>
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {norm.tags.map((tag, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="text-[9px] bg-[#132145] text-slate-300 border border-[#1B2C5B] px-1.5 py-0.2 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Botones de acción alineados y cuadrados */}
                      <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-[#1B2C5B]/60">
                        <button
                          onClick={() => {
                            setIsMapModalOpen(false);
                            handleSendMessage(dept.prompt);
                          }}
                          disabled={isLoading}
                          className="h-8 px-2 text-xs font-medium text-white bg-[#1A6BFF]/20 hover:bg-[#1A6BFF]/30 border border-[#1A6BFF]/40 rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                          title={`Auditar ${dept.nombre} con IA`}
                        >
                          <Sparkles className="h-3.5 w-3.5 text-[#1A6BFF] shrink-0" />
                          <span>Auditar</span>
                        </button>

                        <button
                          onClick={() => handleOpenReport(dept.reporte)}
                          className="h-8 px-2 text-xs font-semibold text-amber-300 hover:text-amber-100 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                          title={`Reportar incidencia en ${dept.nombre}`}
                        >
                          <Flag className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span>Reportar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="px-4 sm:px-6 py-3 border-t border-[#1B2C5B] bg-[#0B132B]/95 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="text-[11px] sm:text-xs">
                💡 Haz clic en <strong>Reportar</strong> en cualquier área para ver el formulario pre-rellenado de incidencias.
              </span>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="px-3.5 py-1 bg-[#132145] hover:bg-[#1A6BFF]/20 border border-[#1B2C5B] text-slate-200 rounded-md transition-colors ml-auto text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Formulario Pre-rellenado de Reporte de Incidencias (100% Responsivo) */}
      {selectedReport && reportFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-lg animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl max-h-[94vh] bg-[#0D1730] border border-[#1B2C5B] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del Formulario */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#1B2C5B] bg-[#0B132B]">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
                  <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2 flex-wrap">
                    Reporte de Incidencia en IA
                    <span className="text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      {reportFormData.departamento}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Formulario pre-rellenado por el responsable del área para la Dirección General
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-slate-400 hover:text-white bg-[#080E1E] hover:bg-[#132145] border border-[#1B2C5B] rounded-lg transition-colors"
                title="Cerrar formulario (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Campos del Formulario Pre-rellenado */}
            <div className="p-4 sm:p-6 space-y-3.5 max-h-[72vh] overflow-y-auto bg-gradient-to-b from-[#0D1730] to-[#080E1E]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* De: Emisor */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    De (Emisor):
                  </label>
                  <div className="bg-[#080E1E] border border-[#1B2C5B] rounded-lg px-3 py-2 text-xs text-slate-200">
                    <span className="font-semibold text-blue-400">{reportFormData.emisor}</span>
                    <span className="text-slate-400 block text-[11px]">{reportFormData.cargo}</span>
                  </div>
                </div>

                {/* Para: Destinatario */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Para (Destinatario):
                  </label>
                  <div className="bg-[#080E1E] border border-[#1B2C5B] rounded-lg px-3 py-2 text-xs text-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{reportFormData.destinatario}</span>
                    <Crown className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Asunto de la Incidencia:
                </label>
                <input
                  type="text"
                  value={reportFormData.asunto}
                  onChange={(e) => setReportFormData({ ...reportFormData, asunto: e.target.value })}
                  className="w-full bg-[#080E1E] border border-[#1B2C5B] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#1A6BFF]/60"
                />
              </div>

              {/* Mensaje Pre-rellenado */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Mensaje Detallado de la Incidencia:
                </label>
                <textarea
                  rows={5}
                  value={reportFormData.mensaje}
                  onChange={(e) => setReportFormData({ ...reportFormData, mensaje: e.target.value })}
                  className="w-full bg-[#080E1E] border border-[#1B2C5B] rounded-lg p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-[#1A6BFF]/60 resize-y"
                />
              </div>

              {/* Alerta de Sugerencia */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-[11px] leading-relaxed">
                  <span className="font-semibold">Acción recomendada:</span> Puedes enviar este reporte directamente al asistente para que audite los datos del departamento y aplique la corrección en tiempo real.
                </div>
              </div>
            </div>

            {/* Footer de Acciones del Formulario */}
            <div className="px-4 sm:px-6 py-3 border-t border-[#1B2C5B] bg-[#0B132B] flex flex-col sm:flex-row items-center justify-between gap-2">
              <button
                onClick={handleCopyReportText}
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#080E1E] hover:bg-[#132145] border border-[#1B2C5B] rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                {reportCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-blue-400" />
                    <span>¡Copiado al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Copiar reporte</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="w-full sm:w-auto px-3.5 py-2 text-xs text-slate-400 hover:text-slate-200 bg-[#080E1E] hover:bg-[#132145] border border-[#1B2C5B] rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendReportToAI}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-[#1A6BFF] hover:bg-[#337EFF] rounded-lg transition-colors shadow-lg shadow-blue-500/25 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Resolver con IA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Área Central de Mensajes */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-5 sm:space-y-6 max-w-4xl w-full mx-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 sm:gap-4 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Avatar Asistente Deskly */}
            {msg.role === 'model' && (
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl overflow-hidden border border-[#1A6BFF]/30 shadow-md shadow-blue-500/10 shrink-0 mt-0.5 bg-[#080E1E] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/deskly-logo.png" alt="Deskly Avatar" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Contenedor del Mensaje */}
            <div
              className={`flex flex-col max-w-[90%] sm:max-w-[78%] ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Tool Execution Badges si se usaron herramientas */}
              {msg.toolLogs && msg.toolLogs.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {msg.toolLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-[11px] bg-[#0D1730] border border-[#1B2C5B] text-blue-200 px-2.5 py-1 rounded-md shadow-sm"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#1A6BFF] shrink-0" />
                      <span>{formatToolName(log.tool)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Burbuja de Texto */}
              <div
                className={`relative group rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#1A6BFF] to-[#0052E0] text-white rounded-br-none shadow-md shadow-blue-600/20'
                    : 'bg-[#0D1730] border border-[#1B2C5B] text-slate-100 rounded-bl-none prose-chat shadow-sm'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                )}

                {/* Botón de copiar para respuestas de IA */}
                {msg.role === 'model' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-[#132145] hover:bg-[#1A6BFF]/20 text-slate-400 hover:text-white"
                    title="Copiar texto"
                  >
                    {copiedId === msg.id ? (
                      <Check className="h-3.5 w-3.5 text-[#1A6BFF]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1 mt-1 px-1 text-[10px] sm:text-[11px] text-slate-500">
                <Clock className="h-3 w-3" />
                <span>{msg.timestamp}</span>
              </div>
            </div>

            {/* Avatar Usuario */}
            {msg.role === 'user' && (
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-[#1A6BFF] to-[#0052E0] flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-blue-600/20">
                <User className="h-4 w-4 sm:h-4 sm:w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Indicador de Carga */}
        {isLoading && (
          <div className="flex gap-2.5 sm:gap-4 justify-start items-start">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl overflow-hidden border border-[#1A6BFF]/30 shrink-0 mt-0.5 bg-[#080E1E] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/deskly-logo.png" alt="Deskly Loading" className="w-full h-full object-cover animate-pulse" />
            </div>
            <div className="bg-[#0D1730] border border-[#1B2C5B] rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-3">
              <Loader2 className="h-4 w-4 text-[#1A6BFF] animate-spin shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-200">
                  Analizando datos de la distribuidora y formulando respuesta...
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:block">
                  Consultando Catálogo, Facturación, Costes o Agenda vía Function Calling
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Alerta de Error */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/50 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-100">Error en la solicitud</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Barra Inferior y Sugerencias */}
      <footer className="border-t border-[#1B2C5B] bg-[#0B132B]/90 backdrop-blur-xl p-3 sm:p-4 max-w-4xl w-full mx-auto">
        {/* Chips de Sugerencias Rápidas */}
        {messages.length <= 2 && (
          <div className="mb-2.5 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1 font-medium">
              <Sparkles className="h-3 w-3 text-[#1A6BFF]" /> Consultas:
            </span>
            {QUICK_PROMPTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#0D1730] hover:bg-[#132145] border border-[#1B2C5B] hover:border-[#1A6BFF]/60 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all shrink-0 disabled:opacity-50 shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-[#1A6BFF]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Formulario de Entrada */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-end gap-2 bg-[#0D1730] border border-[#1B2C5B] rounded-xl p-2 focus-within:border-[#1A6BFF]/70 focus-within:ring-2 focus-within:ring-[#1A6BFF]/20 transition-all shadow-xl"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregúntale a Deskly (ej. ¿Cuál es el precio del AOVE?, Resumen de ventas del mes)..."
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent border-0 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none resize-none max-h-40 px-2 py-1.5 leading-relaxed"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-9 w-9 rounded-lg bg-[#1A6BFF] hover:bg-[#337EFF] disabled:bg-[#080E1E] disabled:text-slate-600 text-white flex items-center justify-center shrink-0 transition-colors shadow-md shadow-blue-500/25 disabled:cursor-not-allowed"
            title="Enviar mensaje (Enter)"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>

        <div className="mt-2 text-center">
          <p className="text-[10px] sm:text-[11px] text-slate-500">
            Pulsa <kbd className="px-1 py-0.5 bg-[#080E1E] border border-[#1B2C5B] rounded text-[10px] text-slate-300">Enter</kbd> para enviar, <kbd className="px-1 py-0.5 bg-[#080E1E] border border-[#1B2C5B] rounded text-[10px] text-slate-300">Shift + Enter</kbd> para salto de línea.
          </p>
        </div>
      </footer>
    </div>
  );
}
