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
    descripcion: 'Campañas Ads, captación de leads B2B y métricas',
    director: 'Elena Gómez (Head of Growth)',
    trabajadores: [
      { rol: 'Especialista Performance Ads', detalle: 'Google & LinkedIn Ads (€2.000/mes)' },
      { rol: 'Content & Brand Creator', detalle: 'Contenido y posicionamiento orgánico' },
    ],
    prompt: 'Genera un plan de automatización para el departamento de Marketing: captura y cualificación de leads B2B, retorno de inversión en campañas de Google/LinkedIn Ads y sincronización automática con el CRM.',
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
    descripcion: 'Facturas pendientes, cálculo de IVA y cobros',
    director: 'Marta Rivas (Directora Financiera / CFO)',
    trabajadores: [
      { rol: 'Responsable de Facturación', detalle: 'Cobros SEPA/Stripe y control de IVA' },
      { rol: 'Gestoría Externa Asociada', detalle: 'Asesoría fiscal, laboral y tributos' },
    ],
    prompt: '¿Qué procesos y alertas podemos activar en Contabilidad? Revisa las facturas pendientes de cobro, facturas vencidas, cálculo trimestral de IVA y balance de tesorería actual.',
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
    descripcion: 'Pipeline comercial, deals y seguimiento CRM',
    director: 'David Morales (Head of Sales)',
    trabajadores: [
      { rol: 'David Morales (Account Executive)', detalle: 'Cuentas Enterprise y seguimiento' },
      { rol: 'SDR Prospección B2B', detalle: 'Cualificación y agendamiento de demos' },
    ],
    prompt: 'Muéstrame el estado y automatizaciones para el equipo de Ventas: etapas del pipeline comercial en el CRM, seguimiento proactivo de deals en negociación y sincronización de demos en Calendar.',
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
    nombre: 'Producción',
    icono: Cpu,
    color: 'text-cyan-400',
    colorBg: 'bg-cyan-500/10',
    colorBorder: 'border-cyan-500/30',
    descripcion: 'Sprints técnicos, monitorización cloud y SLAs',
    director: 'Carlos Vega (Lead AI Engineer / CTO)',
    trabajadores: [
      { rol: 'Carlos Vega (Lead AI Engineer)', detalle: 'Arquitectura IA y Function Calling' },
      { rol: 'Lucía Benítez (Senior Backend)', detalle: 'APIs, Supabase y base de datos' },
      { rol: 'Andrea Sanz (Product Designer)', detalle: 'Diseño UX/UI y componentes' },
    ],
    prompt: '¿Cuáles son las métricas y automatizaciones clave para el departamento de Producción e Ingeniería? Revisa el gasto en infraestructura cloud (Vercel, Supabase, APIs) y el progreso de los sprints.',
    reporte: {
      departamento: 'Producción & Ingeniería',
      emisor: 'Carlos Vega',
      cargo: 'Director de Tecnología (Lead AI Engineer)',
      destinatario: 'CEO / Dirección General',
      asunto: 'Incremento de latencia en llamadas concurrentes de Function Calling con Supabase',
      mensaje: 'Hola,\n\nTe envío este reporte técnico sobre el rendimiento del Core de IA. Hemos detectado que cuando varios clientes consultan datos de facturación y CRM simultáneamente, el tiempo de respuesta de Gemini aumenta en 400ms debido a consultas consecutivas a la base de datos sin capa de caché.\n\nPropongo que implementemos una memoria intermedia en Redis para almacenar en caché las consultas de costes y clientes durante 5 minutos, reduciendo la latencia a menos de 300ms y optimizando el consumo mensual de tokens de API.',
      sugerenciaIA: 'Optimiza la latencia de las herramientas de Function Calling y aplica caché en las consultas de base de datos.',
    },
  },
  {
    id: 'rrhh',
    nombre: 'RRHH',
    icono: UserCheck,
    color: 'text-indigo-400',
    colorBg: 'bg-indigo-500/10',
    colorBorder: 'border-indigo-500/30',
    descripcion: 'Nóminas de equipo, Seguridad Social y altas',
    director: 'Lucía Benítez (Directora de Personas & Talento)',
    trabajadores: [
      { rol: 'People & Operations Lead', detalle: 'Nóminas (€17.8k/mes) y Seguridad Social' },
      { rol: 'Talent Acquisition Specialist', detalle: 'Selección y onboarding de empleados' },
    ],
    prompt: 'Desglosa los datos y automatizaciones de Recursos Humanos (RRHH): costes mensuales de nóminas por perfil, cuotas patronales de la Seguridad Social y resumen de equipo.',
    reporte: {
      departamento: 'Recursos Humanos & Talento',
      emisor: 'Lucía Benítez',
      cargo: 'Directora de Personas & Talento',
      destinatario: 'CEO / Dirección General',
      asunto: 'Falta de estimación de tramos de IRPF en la simulación de nuevas contrataciones',
      mensaje: 'Hola,\n\nTe escribo para reportar una mejora necesaria en el módulo de RRHH de la IA. Al solicitar la simulación de coste total para la contratación del nuevo desarrollador backend y del SDR, la IA calcula correctamente la cuota patronal de la Seguridad Social (€4.350 mensuales de base), pero no desglosa las retenciones de IRPF según el tramo salarial ni el coste neto para el trabajador.\n\nSería conveniente ajustar la lógica financiera para que entregue la ficha completa: Bruto anual, Neto mensual, Seguridad Social empresa e IRPF estimado.',
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
    icon: TrendingUp,
    label: 'Resumen Financiero y KPIs',
    prompt: 'Dame un resumen financiero ejecutivo de Deskly: MRR, costes mensuales, margen neto, EBITDA y runway.',
  },
  {
    icon: Receipt,
    label: 'Facturas pendientes y vencidas',
    prompt: '¿Qué facturas tenemos pendientes de cobro o vencidas? Desglosa clientes, importes y fechas.',
  },
  {
    icon: PieChart,
    label: 'Desglose de Costes',
    prompt: '¿Cuánto estamos gastando mensualmente en nóminas, infraestructura cloud y software SaaS?',
  },
  {
    icon: Users,
    label: 'Cartera de Clientes',
    prompt: 'Muéstrame la lista de nuestros principales clientes, su plan de suscripción, MRR y estado de cuenta.',
  },
  {
    icon: DollarSign,
    label: 'Rentabilidad de CyberGuard',
    prompt: 'Analiza la rentabilidad del cliente CyberGuard Security Systems: facturación acumulada vs coste de servicio y margen.',
  },
  {
    icon: Calendar,
    label: 'Agenda de hoy',
    prompt: '¿Qué reuniones y eventos tengo programados para hoy en mi calendario?',
  },
  {
    icon: Building2,
    label: 'Deals y Pipeline CRM',
    prompt: '¿Cuáles son las oportunidades de negocio (deals) más recientes y en qué etapa del embudo comercial están?',
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      content:
        '¡Hola! Soy **Deskly AI**, tu Asistente Ejecutivo, Financiero y Operativo.\n\nTengo acceso en tiempo real a:\n- 📊 **Finanzas & KPIs**: MRR (€30.8k), EBITDA, márgenes y runway.\n- 🧾 **Facturación & Contabilidad**: Facturas emitidas, cobros pendientes y alertas de mora.\n- 💰 **Costes Operativos**: Nóminas de equipo, infraestructura cloud, SaaS y suministros.\n- 👥 **Cartera de Clientes**: Clientes activos, planes, retención y análisis de rentabilidad.\n- 📅 **Google Calendar**: Agenda de reuniones y citas.\n- 🏢 **HubSpot & CRM**: Contactos comerciales y pipeline de ventas.\n\n¿En qué te puedo ayudar hoy?',
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const deptMenuRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
    <div className="flex flex-col h-screen max-h-screen bg-[#09090b] text-[#f4f4f5]">
      {/* Header Superior Responsivo */}
      <header className="border-b border-zinc-800 bg-[#0c0c0e]/80 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/40 shrink-0">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-semibold text-zinc-100 tracking-tight leading-tight">
              Deskly Executive AI
            </h1>
            <p className="text-[11px] text-zinc-400 hidden md:block">
              Finanzas, Costes, Cartera de Clientes, Calendar & CRM
            </p>
          </div>
        </div>

        {/* Acciones de la Cabecera Responsivas */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Botón Panel de Gestión */}
          <button
            onClick={() => setIsMapModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-zinc-200 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-teal-500/50 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shadow-sm group"
            title="Ver panel de gestión y estructura operativa"
          >
            <Network className="h-3.5 w-3.5 text-teal-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden sm:inline">Panel de gestión</span>
            <span className="sm:hidden">Panel</span>
          </button>

          {/* Botón y Menú Desplegable de Automatizaciones Departamentos */}
          <div className="relative" ref={deptMenuRef}>
            <button
              onClick={() => setIsDeptMenuOpen((prev) => !prev)}
              disabled={isLoading}
              className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-zinc-200 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-emerald-500/50 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shadow-sm group disabled:opacity-50"
            >
              <Zap className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden lg:inline">Automatizaciones departamentos</span>
              <span className="lg:hidden">Departamentos</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
                  isDeptMenuOpen ? 'rotate-180 text-emerald-400' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Responsivo */}
            {isDeptMenuOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-80 rounded-xl bg-[#121215] border border-zinc-800/90 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                <div className="px-2.5 py-1.5 border-b border-zinc-800/60 mb-1 flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Automatizaciones por Área
                  </p>
                  <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    5 Departamentos
                  </span>
                </div>
                <div className="space-y-1">
                  {DEPARTAMENTOS_DATA.map((dept) => {
                    const Icon = dept.icono;
                    return (
                      <div
                        key={dept.id}
                        className="flex items-center justify-between gap-1 p-1.5 rounded-lg hover:bg-zinc-800/80 transition-colors group/item"
                      >
                        <button
                          onClick={() => {
                            setIsDeptMenuOpen(false);
                            handleSendMessage(dept.prompt);
                          }}
                          disabled={isLoading}
                          className="flex-1 text-left flex items-start gap-2.5 min-w-0 disabled:opacity-50"
                        >
                          <div className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 group-hover/item:border-zinc-700 mt-0.5 shrink-0">
                            <Icon className={`h-4 w-4 ${dept.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-zinc-200 group-hover/item:text-emerald-300 block">
                              {dept.nombre}
                            </span>
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5">
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
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            title="Reiniciar chat"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Limpiar chat</span>
          </button>
        </div>
      </header>

      {/* Modal Ventana Panel de Gestión con Fondo Difuminado (100% Responsivo) */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-5xl max-h-[92vh] bg-[#0e0e11] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-zinc-800 bg-[#121216]/90">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm shrink-0">
                  <Network className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-zinc-100">
                    Panel de Gestión & Estructura Operativa
                  </h2>
                  <p className="text-[11px] sm:text-xs text-zinc-400 hidden xs:block">
                    Dirección General, Departamentos, Equipos y Reportes de Incidencias
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="p-1.5 sm:p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
                title="Cerrar modal (Esc)"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Contenido del Organigrama */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 no-scrollbar bg-gradient-to-b from-[#0e0e11] via-[#09090b] to-[#0e0e11]">
              {/* Nivel 1: CEO / Dirección General */}
              <div className="flex flex-col items-center">
                <div className="relative group max-w-sm w-full">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                  <div className="relative bg-[#141418] border border-teal-500/40 rounded-2xl p-3.5 sm:p-4 text-center shadow-xl">
                    <div className="inline-flex p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 mb-1.5">
                      <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-100 uppercase tracking-wide">
                      {ORGANIGRAMA_CEO.titulo}
                    </h3>
                    <p className="text-xs font-medium text-emerald-400 mt-0.5">
                      {ORGANIGRAMA_CEO.subtitulo}
                    </p>
                    <div className="mt-2.5 pt-2.5 border-t border-zinc-800/80 flex flex-wrap justify-center gap-1.5">
                      {ORGANIGRAMA_CEO.responsabilidades.map((resp, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-zinc-900 text-zinc-300 border border-zinc-700/60 px-2 py-0.5 rounded-full"
                        >
                          {resp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Línea Conectora Vertical */}
                <div className="w-0.5 h-4 sm:h-6 bg-gradient-to-b from-teal-500/80 to-zinc-700"></div>

                {/* Línea Conectora Horizontal entre Departamentos (Desktop) */}
                <div className="hidden lg:block w-[88%] h-0.5 bg-zinc-800 relative">
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
                      className="flex flex-col justify-between rounded-xl bg-[#131317] border border-zinc-800/90 hover:border-zinc-700 transition-all p-3.5 shadow-lg"
                    >
                      <div className="space-y-3">
                        {/* Cabecera del Departamento */}
                        <div className={`p-3 rounded-lg border ${dept.colorBorder} ${dept.colorBg}`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="p-1 rounded bg-zinc-900 border border-zinc-800 shrink-0">
                              <Icon className={`h-4 w-4 ${dept.color}`} />
                            </div>
                            <span className={`text-xs font-bold ${dept.color} tracking-wide truncate`}>
                              {dept.nombre}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-zinc-200 leading-tight">
                            {dept.director}
                          </p>
                        </div>

                        {/* Trabajadores / Especialistas del Departamento */}
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-1">
                            Equipo Directo
                          </p>
                          {dept.trabajadores.map((trabajador, idx) => (
                            <div
                              key={idx}
                              className="bg-zinc-900/90 border border-zinc-800/80 rounded-lg p-2 text-left"
                            >
                              <div className="flex items-center gap-1.5">
                                <User className="h-3 w-3 text-zinc-400 shrink-0" />
                                <p className="text-[11px] font-medium text-zinc-200 truncate">
                                  {trabajador.rol}
                                </p>
                              </div>
                              <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                                {trabajador.detalle}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Botones de acción alineados y cuadrados */}
                      <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-zinc-800/60">
                        <button
                          onClick={() => {
                            setIsMapModalOpen(false);
                            handleSendMessage(dept.prompt);
                          }}
                          disabled={isLoading}
                          className="h-8 px-2 text-xs font-medium text-zinc-200 hover:text-white bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700/70 rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                          title={`Auditar ${dept.nombre} con IA`}
                        >
                          <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
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
            <div className="px-4 sm:px-6 py-3 border-t border-zinc-800 bg-[#121216]/90 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
              <span className="text-[11px] sm:text-xs">
                💡 Haz clic en <strong>Reportar</strong> en cualquier área para ver el formulario pre-rellenado de incidencias.
              </span>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="px-3.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md transition-colors ml-auto text-xs"
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
            className="relative w-full max-w-2xl max-h-[94vh] bg-[#111115] border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del Formulario */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-zinc-800 bg-[#15151b]">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm shrink-0">
                  <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-zinc-100 flex items-center gap-2 flex-wrap">
                    Reporte de Incidencia en IA
                    <span className="text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      {reportFormData.departamento}
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Formulario pre-rellenado por el responsable del área para la Dirección General
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-100 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
                title="Cerrar formulario (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Campos del Formulario Pre-rellenado */}
            <div className="p-4 sm:p-6 space-y-3.5 max-h-[72vh] overflow-y-auto bg-gradient-to-b from-[#111115] to-[#0c0c0e]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* De: Emisor */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    De (Emisor):
                  </label>
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200">
                    <span className="font-semibold text-emerald-400">{reportFormData.emisor}</span>
                    <span className="text-zinc-500 block text-[11px]">{reportFormData.cargo}</span>
                  </div>
                </div>

                {/* Para: Destinatario */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Para (Destinatario):
                  </label>
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 flex items-center justify-between">
                    <span className="font-semibold text-zinc-200">{reportFormData.destinatario}</span>
                    <Crown className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Asunto */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Asunto de la Incidencia:
                </label>
                <input
                  type="text"
                  value={reportFormData.asunto}
                  onChange={(e) => setReportFormData({ ...reportFormData, asunto: e.target.value })}
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Mensaje Pre-rellenado */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Mensaje Detallado de la Incidencia:
                </label>
                <textarea
                  rows={5}
                  value={reportFormData.mensaje}
                  onChange={(e) => setReportFormData({ ...reportFormData, mensaje: e.target.value })}
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 leading-relaxed focus:outline-none focus:border-amber-500/50 resize-y"
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
            <div className="px-4 sm:px-6 py-3 border-t border-zinc-800 bg-[#15151b] flex flex-col sm:flex-row items-center justify-between gap-2">
              <button
                onClick={handleCopyReportText}
                className="w-full sm:w-auto px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                {reportCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>¡Copiado al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Copiar reporte</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="w-full sm:w-auto px-3.5 py-2 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSendReportToAI}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50"
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
            {/* Avatar Asistente */}
            {msg.role === 'model' && (
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
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
                      className="flex items-center gap-1.5 text-[11px] bg-zinc-900/90 border border-zinc-700/60 text-zinc-300 px-2.5 py-1 rounded-md shadow-sm"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{formatToolName(log.tool)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Burbuja de Texto */}
              <div
                className={`relative group rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-[#121215] border border-zinc-800 text-zinc-200 rounded-bl-none prose-chat'
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
                    className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200"
                    title="Copiar texto"
                  >
                    {copiedId === msg.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-1 mt-1 px-1 text-[10px] sm:text-[11px] text-zinc-500">
                <Clock className="h-3 w-3" />
                <span>{msg.timestamp}</span>
              </div>
            </div>

            {/* Avatar Usuario */}
            {msg.role === 'user' && (
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Indicador de Carga */}
        {isLoading && (
          <div className="flex gap-2.5 sm:gap-4 justify-start items-start">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
            </div>
            <div className="bg-[#121215] border border-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-3">
              <Loader2 className="h-4 w-4 text-emerald-400 animate-spin shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-300">
                  Analizando datos de la empresa y formulando respuesta...
                </span>
                <span className="text-[11px] text-zinc-500 hidden sm:block">
                  Consultando Finanzas, Costes, Clientes, Calendar o CRM vía Function Calling
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Alerta de Error */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-900/50 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-200">Error en la solicitud</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Barra Inferior y Sugerencias */}
      <footer className="border-t border-zinc-800 bg-[#0c0c0e]/90 backdrop-blur-md p-3 sm:p-4 max-w-4xl w-full mx-auto">
        {/* Chips de Sugerencias Rápidas */}
        {messages.length <= 2 && (
          <div className="mb-2.5 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs text-zinc-500 shrink-0 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-emerald-400" /> Consultas:
            </span>
            {QUICK_PROMPTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
                >
                  <Icon className="h-3.5 w-3.5 text-emerald-400" />
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
          className="relative flex items-end gap-2 bg-[#141417] border border-zinc-800 rounded-xl p-2 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all shadow-lg"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregúntale a la IA (ej. ¿Cuál es nuestro MRR?, Desglosa los costes del mes)..."
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent border-0 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none max-h-40 px-2 py-1.5 leading-relaxed"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-9 w-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white flex items-center justify-center shrink-0 transition-colors shadow-md disabled:cursor-not-allowed"
            title="Enviar mensaje (Enter)"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>

        <div className="mt-2 text-center">
          <p className="text-[10px] sm:text-[11px] text-zinc-500">
            Pulsa <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px]">Enter</kbd> para enviar, <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px]">Shift + Enter</kbd> para salto de línea.
          </p>
        </div>
      </footer>
    </div>
  );
}
