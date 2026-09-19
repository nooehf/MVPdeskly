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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      {/* Header Superior */}
      <header className="border-b border-zinc-800 bg-[#0c0c0e]/80 backdrop-blur-md px-4 py-3 sm:px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-zinc-100 tracking-tight">Deskly Executive AI</h1>
              <span className="text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Finanzas, Costes, Cartera de Clientes, Calendar & CRM
            </p>
          </div>
        </div>

        {/* Badges de Integraciones y Botón Limpiar */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <span className="flex items-center gap-1.5 text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              Finanzas & Costes
            </span>
            <span className="flex items-center gap-1.5 text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md">
              <Users className="h-3.5 w-3.5 text-purple-400" />
              Clientes ERP
            </span>
            <span className="flex items-center gap-1.5 text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md">
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              Calendar API
            </span>
            <span className="flex items-center gap-1.5 text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md">
              <Building2 className="h-3.5 w-3.5 text-orange-400" />
              HubSpot CRM
            </span>
          </div>

          <button
            onClick={handleClearChat}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            title="Reiniciar chat"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        </div>
      </header>

      {/* Área Central de Mensajes */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl w-full mx-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 sm:gap-4 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Avatar Asistente */}
            {msg.role === 'model' && (
              <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Bot className="h-4 w-4 text-emerald-400" />
              </div>
            )}

            {/* Contenedor del Mensaje */}
            <div
              className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${
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
                className={`relative group rounded-2xl px-4 py-3 text-sm shadow-sm ${
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
              <div className="flex items-center gap-1 mt-1 px-1 text-[11px] text-zinc-500">
                <Clock className="h-3 w-3" />
                <span>{msg.timestamp}</span>
              </div>
            </div>

            {/* Avatar Usuario */}
            {msg.role === 'user' && (
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Indicador de Carga */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 justify-start items-start">
            <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="bg-[#121215] border border-zinc-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-3">
              <Loader2 className="h-4 w-4 text-emerald-400 animate-spin" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-300">
                  Analizando datos de la empresa y formulando respuesta...
                </span>
                <span className="text-[11px] text-zinc-500">
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
      <footer className="border-t border-zinc-800 bg-[#0c0c0e]/90 backdrop-blur-md p-4 max-w-4xl w-full mx-auto">
        {/* Chips de Sugerencias Rápidas */}
        {messages.length <= 2 && (
          <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs text-zinc-500 shrink-0 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-emerald-400" /> Consultas rápidas:
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
            placeholder="Pregúntale a la IA (ej. ¿Cuál es nuestro MRR?, Desglosa los costes del mes, ¿Qué facturas están vencidas?)..."
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent border-0 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none max-h-40 px-2 py-1.5 leading-relaxed"
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
          <p className="text-[11px] text-zinc-500">
            Pulsa <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px]">Enter</kbd> para enviar, <kbd className="px-1 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px]">Shift + Enter</kbd> para salto de línea.
          </p>
        </div>
      </footer>
    </div>
  );
}
