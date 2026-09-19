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
  Calculator,
  Briefcase,
  Wrench,
  UserCheck,
  Network,
  X,
  Crown,
  Flag,
  AlertTriangle,
  LogIn,
  LogOut,
  Timer,
  Camera,
  FileUp,
  Scan,
  HardHat,
  FileText,
  Image as ImageIcon,
  CheckSquare,
  RefreshCw,
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

interface AlbaranFormData {
  numeroAlbaran: string;
  proveedor: string;
  obraDestino: string;
  material: string;
  cantidad: string;
  importeTotal: number;
  firmadoPor: string;
  observaciones: string;
}

// ------------------------------------------------------------------
// 4 DEPARTAMENTOS DE LA EMPRESA CONSTRUCTORA
// ------------------------------------------------------------------
const DEPARTAMENTOS_DATA = [
  {
    id: 'estudio',
    nombre: 'Estudio',
    icono: Calculator,
    color: 'text-blue-400',
    colorBg: 'bg-blue-500/10',
    colorBorder: 'border-blue-500/30',
    descripcion: 'Análisis de clientes, planos, mediciones en Presto/BC3, costes y viabilidad',
    director: 'Elena Gómez (Jefa de Estudio & Oficina Técnica)',
    trabajadores: [
      { rol: 'Arquitecto Técnico de Mediciones', detalle: 'Presupuestos Presto, BC3 y descompuestos unitarios' },
      { rol: 'Especialista en Licitaciones & Clientes', detalle: 'Pliegos, márgenes y ofertas económicas' },
    ],
    normativasRAG: [
      {
        codigo: 'EST-SOP-01',
        titulo: 'Viabilidad, Márgenes & Imprevistos',
        resumen: 'Margen bruto objetivo del 15% al 22%, fondo de imprevistos del 5% y GG 13%.',
        tags: ['Margen 15-22%', 'Imprevistos 5%', 'Gastos Generales 13%', 'Aprobación > €50k'],
      },
      {
        codigo: 'EST-SOP-02',
        titulo: 'SLA de Ofertas & Formato BC3',
        resumen: 'SLA de entrega de presupuesto: 5 días en reformas y 10 días en obra nueva con archivo .BC3.',
        tags: ['SLA 5-10 días', 'Estándar .BC3', 'Cronograma Gantt'],
      },
    ],
    prompt: 'Consulta el sistema RAG de Estudio: ¿cuál es la fórmula de cálculo de márgenes y coeficientes de paso en ofertas, y cuál es el SLA de entrega de presupuestos a clientes?',
    reporte: {
      departamento: 'Estudio & Oficina Técnica',
      emisor: 'Elena Gómez',
      cargo: 'Jefa de Estudio & Presupuestos',
      destinatario: 'CEO / Dirección General',
      asunto: 'Desviación en el cálculo automático del fondo de imprevistos (5%) en ofertas Presto',
      mensaje: 'Hola,\n\nTe escribo porque hemos detectado una incidencia en las respuestas de la IA al calcular presupuestos de reformas. Al generar el desglose económico de partidas para el proyecto de Castellana 140, la IA aplicó los Gastos Generales (13%) pero omitió el fondo de imprevistos obligatorio del 5% en cimentación y demoliciones.\n\nPara evitar desajustes en las ofertas que enviamos a las promotoras, necesitamos calibrar el sistema para que incluya siempre este 5% de contingencia estructural.',
      sugerenciaIA: 'Ajusta la lógica del departamento de Estudio para verificar siempre el 5% de imprevistos en reformas y cimentaciones.',
    },
  },
  {
    id: 'obras',
    nombre: 'Obras',
    icono: Wrench,
    color: 'text-amber-400',
    colorBg: 'bg-amber-500/10',
    colorBorder: 'border-amber-500/30',
    descripcion: 'Planificación operativa, replanteo, maquinaria pesada, acopios y subcontratas',
    director: 'David Morales (Director de Obras & Planificación Operativa)',
    trabajadores: [
      { rol: 'Coordinador de Maquinaria & Grúas', detalle: 'Grúa torre, cubas de hormigón (preaviso 48h) y retroexcavadoras' },
      { rol: 'Gestor de Subcontratas & Albaranes', detalle: 'Homologación REA, seguro RC 600.000€ y cotejo de albaranes' },
    ],
    normativasRAG: [
      {
        codigo: 'OBR-SOP-01',
        titulo: 'Replanteo, Acopio & Maquinaria',
        resumen: 'Acta de replanteo con Dirección Facultativa, preaviso de 48h para vertido de hormigón y grúas.',
        tags: ['Acta de Replanteo', 'Preaviso 48h hormigón', 'Permisos de grúa 15 días'],
      },
      {
        codigo: 'OBR-SOP-02',
        titulo: 'Subcontratas & Subida de Albaranes',
        resumen: 'Exigencia de REA, TC2 y Seguro RC €600k. Foto y validación inmediata del albarán al descargar.',
        tags: ['Inscripción REA', 'Seguro RC €600k', 'Foto de albarán en descarga'],
      },
    ],
    prompt: 'Consulta el sistema RAG de Obras: ¿cuáles son los requisitos indispensables de homologación para que una subcontrata entre a obra y con qué antelación se pide el hormigón?',
    reporte: {
      departamento: 'Obras & Planificación Operativa',
      emisor: 'David Morales',
      cargo: 'Director de Obras',
      destinatario: 'CEO / Dirección General',
      asunto: 'Bloqueo de acceso en obra por falta de póliza de RC en subcontrata de fontanería',
      mensaje: 'Hola,\n\nTe paso reporte operativo: esta mañana el encargado de la obra Residencial Mirasierra detuvo el acceso de la cuadrilla de climatización porque su certificado de seguro de Responsabilidad Civil figuraba con cobertura de €300.000 en vez de los €600.000 obligatorios según la normativa OBR-SOP-02.\n\nLa IA debería alertar con 7 días de antelación sobre la caducidad o insuficiencia de coberturas de las subcontratas antes de que se presenten en el tajo.',
      sugerenciaIA: 'Configura alertas automáticas de control documental REA y seguros de subcontratas en el departamento de Obras.',
    },
  },
  {
    id: 'proyectos',
    nombre: 'Proyectos',
    icono: Building2,
    color: 'text-cyan-400',
    colorBg: 'bg-cyan-500/10',
    colorBorder: 'border-cyan-500/30',
    descripcion: 'Jefes y encargados de obra a pie de tajo, partes diarios, calidad y certificaciones',
    director: 'Carlos Vega (Director de Proyectos & Jefes de Obra)',
    trabajadores: [
      { rol: 'Jefe de Obra (Arquitecto Técnico)', detalle: 'Certificaciones mensuales (corte día 25) y libro de órdenes' },
      { rol: 'Antonio Gómez (Encargado General)', detalle: 'Partes diarios en tajo, cuadrillas y control PRL' },
    ],
    normativasRAG: [
      {
        codigo: 'PRY-SOP-01',
        titulo: 'Partes Diarios & Certificaciones',
        resumen: 'Parte diario obligatorio antes de las 18:00h. Corte mensual de certificaciones el día 25.',
        tags: ['Parte diario 18:00h', 'Corte día 25', 'Validación Aparejador'],
      },
      {
        codigo: 'PRY-SOP-02',
        titulo: 'Seguridad en el Tajo (PRL) & Alturas',
        resumen: 'EPIs obligatorios (Casco EN 397, botas S3). Arnés amarrado a línea de vida en alturas > 2 metros.',
        tags: ['EPIs obligatorios', 'Arnés > 2m', 'Barandillas con rodapié'],
      },
    ],
    prompt: 'Consulta el sistema RAG de Proyectos: ¿cuándo es la fecha límite de corte de certificaciones mensuales y qué medidas de seguridad son obligatorias en trabajos en altura?',
    reporte: {
      departamento: 'Proyectos & Ejecución en Tajo',
      emisor: 'Carlos Vega',
      cargo: 'Director de Proyectos',
      destinatario: 'CEO / Dirección General',
      asunto: 'Discrepancia en la medición de m² de forjado entre el parte diario y la certificación nº 4',
      mensaje: 'Hola,\n\nTe informo de una incidencia en el módulo de Proyectos. En la obra de Mirasierra, el parte diario registró 450 m² de losa ejecutada el día 22, pero en el borrador de la certificación mensual la IA tomó una cifra preliminar de 380 m².\n\nNecesitamos que la IA sincronice automáticamente los datos del parte diario del encargado con las partidas del cuadro de certificación antes del corte del día 25.',
      sugerenciaIA: 'Sincroniza en tiempo real las mediciones de los partes diarios con el generador de certificaciones de Proyectos.',
    },
  },
  {
    id: 'rrhh',
    nombre: 'RRHH',
    icono: UserCheck,
    color: 'text-indigo-400',
    colorBg: 'bg-indigo-500/10',
    colorBorder: 'border-indigo-500/30',
    descripcion: 'Nóminas de cuadrillas, fichajes en caseta, Convenio de la Construcción y TPC',
    director: 'Lucía Benítez (Directora de RRHH & Prevención Laboral)',
    trabajadores: [
      { rol: 'Responsable de Cuadrillas & Nóminas', detalle: 'Nóminas de oficiales y peones (€31.5k/mes) y Seguridad Social' },
      { rol: 'Técnico de PRL y Acreditaciones', detalle: 'Control de Tarjeta TPC y cursos obligatorios de 20h/60h' },
    ],
    normativasRAG: [
      {
        codigo: 'RRH-SOP-01',
        titulo: 'Convenio, Jornada Verano & Fichaje',
        resumen: 'Jornada intensiva de verano (07:00 a 15:00) en julio y agosto por estrés térmico. Fichaje en caseta.',
        tags: ['Jornada Verano 07:00-15:00', 'Fichaje en caseta', 'Horas extra +50%'],
      },
      {
        codigo: 'RRH-SOP-02',
        titulo: 'Tarjeta TPC & Formación 20h PRL',
        resumen: 'Tarjeta Profesional de la Construcción obligatoria y curso de 20 horas por oficio antes de entrar.',
        tags: ['TPC Obligatoria', 'Curso 20h por oficio', 'Revisión médica anual'],
      },
    ],
    prompt: 'Consulta el sistema RAG de Recursos Humanos: ¿cuál es el horario de la jornada intensiva de verano en la construcción y qué requisitos exige la tarjeta TPC para entrar al tajo?',
    reporte: {
      departamento: 'Recursos Humanos, Cuadrillas & PRL',
      emisor: 'Lucía Benítez',
      cargo: 'Directora de RRHH & Prevención',
      destinatario: 'CEO / Dirección General',
      asunto: 'Falta de aviso automático sobre la caducidad del reconocimiento médico de 3 encofradores',
      mensaje: 'Hola,\n\nTe paso reporte de RRHH. Tres encofradores de la cuadrilla directa tienen el reconocimiento médico anual a punto de vencer a final de mes. La IA no generó la alerta preventiva en el panel de fichajes de caseta.\n\nPara cumplir escrupulosamente con la Ley de Prevención de Riesgos y evitar sanciones de la Inspección de Trabajo, solicitamos que la IA emita un recordatorio 15 días antes de cualquier vencimiento de aptitud médica o curso TPC.',
      sugerenciaIA: 'Programa avisos proactivos de caducidad médica y acreditaciones TPC en el módulo de RRHH.',
    },
  },
];

const ORGANIGRAMA_CEO = {
  titulo: 'CEO / Dirección General',
  subtitulo: 'Dirección Ejecutiva & Dirección de Obras',
  responsabilidades: ['Supervisión de Obras y Licitaciones', 'Seguridad y Salud Global', 'Margen y Tesorería'],
};

const QUICK_PROMPTS = [
  {
    icon: Sparkles,
    label: 'Auditoría de Albaranes de Obra',
    prompt: 'Consulta los albaranes de materiales registrados en nuestras obras activas (hormigón, ferralla, pladur) y resume importes y proveedores.',
  },
  {
    icon: HardHat,
    label: 'Partida más presupuestada y precios',
    prompt: '¿Cuál es el precio de nuestra partida de obra más vendida/presupuestada y qué otras partidas tenemos en el catálogo de precios unitarios?',
  },
  {
    icon: Calculator,
    label: 'Normativas de Estudio y Márgenes (RAG)',
    prompt: 'Consulta en el sistema RAG de Estudio: ¿qué márgenes brutos (15-22%) e imprevistos (5%) se aplican a los presupuestos?',
  },
  {
    icon: Building2,
    label: 'Corte de Certificaciones (Proyectos)',
    prompt: 'Consulta en el sistema RAG de Proyectos: ¿cuándo es el corte mensual de mediciones y cómo se aprueban las certificaciones de obra?',
  },
  {
    icon: TrendingUp,
    label: 'Resumen Financiero & Facturación',
    prompt: 'Dame un resumen financiero ejecutivo de nuestra constructora: facturación mensual, costes de cuadrillas y maquinaria, EBITDA y tesorería.',
  },
  {
    icon: Receipt,
    label: 'Certificaciones pendientes de cobro',
    prompt: '¿Qué certificaciones y facturas de obra a promotoras tenemos pendientes de cobro o vencidas?',
  },
  {
    icon: Calendar,
    label: 'Visitas técnicas y replanteos de hoy',
    prompt: '¿Qué visitas técnicas, replanteos o reuniones de dirección de obra tengo programadas para hoy?',
  },
];

// Presets de Albaranes para Demostración Rápida
const ALBARAN_PRESETS: AlbaranFormData[] = [
  {
    numeroAlbaran: 'ALB-2025-8842',
    proveedor: 'Hormigones & Áridos Madrid S.L.',
    obraDestino: 'Residencial Mirasierra - Fase II (Losa Nivel +2)',
    material: 'Hormigón HA-25/B/20/IIa con aditivo plastificante',
    cantidad: '24 m³ (3 camiones cuba)',
    importeTotal: 2640.0,
    firmadoPor: 'Antonio Gómez (Encargado de Obra)',
    observaciones: 'Llegada a las 08:30h. Cono de Abrams 8cm verificado. Probetas tomadas por laboratorio externo.',
  },
  {
    numeroAlbaran: 'ALB-2025-9104',
    proveedor: 'Ferrallas del Henares S.A.',
    obraDestino: 'Rehabilitación Edificio Castellana 140',
    material: 'Armaduras corrugadas B-500S cortadas y dobladas Ø16 y Ø20',
    cantidad: '4.850 kg',
    importeTotal: 6062.5,
    firmadoPor: 'Carlos Vega (Jefe de Obra)',
    observaciones: 'Descargado con pluma en zona de acopio planta baja. Certificado de calidad de acero adjunto.',
  },
  {
    numeroAlbaran: 'ALB-2025-7721',
    proveedor: 'Pladur & Aislamientos Centro S.L.',
    obraDestino: 'Nave Logística San Fernando',
    material: 'Placas Pladur Standard 15mm + Lana de Roca 40mm',
    cantidad: '350 m² de placas + 30 rollos aislante',
    importeTotal: 5075.0,
    firmadoPor: 'Antonio Gómez (Encargado de Obra)',
    observaciones: 'Acopio bajo cubierto en nave principal. Conforme con orden de compra.',
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      content:
        '¡Hola! Soy **Deskly**, tu Asistente Ejecutivo y de Operaciones para nuestra **Empresa Constructora & Reformas Integrales**.\n\nTengo acceso en tiempo real a los 4 departamentos clave:\n- 📐 **Estudio**: Mediciones en Presto/BC3, análisis de viabilidad, coeficientes de paso (15%-22%) e imprevistos (5%).\n- 🏗️ **Obras**: Planificación operativa, replanteo, grúas torre, cubas de hormigón y homologación de subcontratas.\n- 🏢 **Proyectos**: Jefes y encargados de obra en el tajo, partes diarios, certificaciones mensuales (corte día 25) y PRL.\n- 👷 **RRHH**: Cuadrillas de obra, control horario en caseta, jornada intensiva de verano (07:00-15:00) y Tarjeta TPC (20h).\n- 📸 **Albaranes Digitales**: Puedes pulsar **"Subir albarán"** arriba para fotografiar albaranes y auditarlos al instante.\n\n¿Qué obra, presupuesto, albarán o normativa deseas gestionar?',
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

  // Estados del Modal de Subir Albarán
  const [isAlbaranModalOpen, setIsAlbaranModalOpen] = useState(false);
  const [albaranForm, setAlbaranForm] = useState<AlbaranFormData>(ALBARAN_PRESETS[0]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const deptMenuRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        } else if (isAlbaranModalOpen) {
          handleCloseAlbaranModal();
        } else if (isMapModalOpen) {
          setIsMapModalOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedReport, isMapModalOpen, isAlbaranModalOpen]);

  // Formatear segundos a HH:MM:SS
  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Manejador para Fichar Entrada / Salida en Caseta de Obra
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

  // ------------------------------------------------------------------
  // GESTIÓN DE CÁMARA Y FOTO DEL ALBARÁN
  // ------------------------------------------------------------------
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } else {
        setCameraError('La cámara no está disponible en este dispositivo. Puedes subir una foto desde tus archivos.');
      }
    } catch (err: any) {
      console.warn('Acceso a cámara no concedido:', err);
      setCameraError('No se pudo acceder a la cámara. Puedes subir una imagen del albarán directamente.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
        simulateOCR();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        stopCamera();
        simulateOCR();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateOCR = () => {
    setIsScanningOCR(true);
    setTimeout(() => {
      setIsScanningOCR(false);
    }, 1200);
  };

  const handleSelectPreset = (preset: AlbaranFormData) => {
    setAlbaranForm(preset);
    simulateOCR();
  };

  const handleCloseAlbaranModal = () => {
    stopCamera();
    setIsAlbaranModalOpen(false);
  };

  const handleProcessAlbaranWithAI = () => {
    handleCloseAlbaranModal();
    const promptAlbaran = `[ALBARÁN DIGITALIZADO EN OBRA]:
- Nº Albarán: ${albaranForm.numeroAlbaran}
- Proveedor: ${albaranForm.proveedor}
- Obra de Destino: ${albaranForm.obraDestino}
- Material Recibido: ${albaranForm.material}
- Cantidad: ${albaranForm.cantidad}
- Importe Total: €${albaranForm.importeTotal.toLocaleString('es-ES')}
- Firmado por: ${albaranForm.firmadoPor}
- Observaciones: ${albaranForm.observaciones}

Por favor, procesa este albarán con la herramienta procesarAlbaranObra, audita el precio y material frente a la partida de presupuesto asignada a la obra y confirma su registro contable.`;

    handleSendMessage(promptAlbaran);
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

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
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
    const promptToSend = `[REPORTE DE INCIDENCIA DE ${reportFormData.emisor.toUpperCase()} - DEPARTAMENTO DE ${reportFormData.departamento.toUpperCase()}]:\nAsunto: ${reportFormData.asunto}\n\n${reportFormData.mensaje}\n\nPor favor, como asistente operativo de la constructora, analiza esta incidencia, audita las normativas y base de datos del departamento y propón la solución técnica adecuada.`;
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
          'Conversación reiniciada. Puedes consultarme cualquier duda sobre **Estudio de presupuestos, Obras y maquinaria, Proyectos y tajos, RRHH y cuadrillas, o subir albaranes**.',
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
      case 'procesarAlbaranObra':
        return 'Albarán: Material Registrado en Obra';
      case 'consultarAlbaranesObra':
        return 'Albaranes: Consulta de Entregas';
      case 'agendarEventoCalendario':
        return 'Calendar: Visita Técnica Agendada';
      case 'obtenerEventosCalendario':
        return 'Calendar: Agenda de Obra';
      case 'emitirFactura':
        return 'Certificaciones: Factura Emitida';
      case 'consultarResumenFinanciero':
        return 'Finanzas: Resumen Constructora & KPIs';
      case 'consultarFacturas':
        return 'Contabilidad: Certificaciones Emitidas';
      case 'consultarCostesYGastos':
        return 'Costes: Cuadrillas, Maquinaria & Materiales';
      case 'consultarCarteraClientes':
        return 'Promotoras: Cartera de Obras';
      case 'analizarRentabilidadCliente':
        return 'Rentabilidad: Seguimiento de Promoción';
      case 'consultarCatalogoProductos':
        return 'Partidas: Precios Unitarios Presto';
      case 'consultarNormativasRAG':
        return 'Base RAG: Normativa de Constructora';
      case 'crearOActualizarContactoCRM':
        return 'CRM: Contacto Técnico Guardado';
      case 'crearDealCRM':
        return 'CRM: Oportunidad de Licitación';
      case 'obtenerDealsHubspot':
        return 'CRM: Pipeline de Obras';
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
                {fichajeToast.tipo === 'entrada' ? '✅ Fichaje en Caseta Registrado' : '🏁 Fin de Jornada Registrado'}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                {fichajeToast.tipo === 'entrada'
                  ? `Entrada registrada a las ${fichajeToast.hora} en el sistema de RRHH.`
                  : `Salida a las ${fichajeToast.hora} (Jornada acumulada: ${fichajeToast.duracion}).`}
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
              Empresa Constructora · Estudio, Obras, Proyectos & RRHH
            </p>
          </div>
        </div>

        {/* Acciones de la Cabecera Responsivas */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* BOTÓN NUEVO: Subir Albarán con Cámara */}
          <button
            onClick={() => {
              setIsAlbaranModalOpen(true);
              setCapturedImage(null);
            }}
            className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#1A6BFF]/20 to-blue-600/20 text-blue-200 border border-[#1A6BFF]/50 hover:bg-[#1A6BFF]/30 hover:border-[#1A6BFF] transition-all shadow-md shadow-blue-500/10 group"
            title="Hacer foto o subir albarán de obra con escaneo OCR"
          >
            <Camera className="h-3.5 w-3.5 text-[#1A6BFF] group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-medium">Subir albarán</span>
            <span className="hidden sm:inline text-[10px] bg-[#1A6BFF] text-white px-1.5 py-0.2 rounded font-bold">
              Foto
            </span>
          </button>

          {/* Botón Fichar Entrada / Salida */}
          <button
            onClick={handleToggleFichaje}
            className={`flex items-center gap-1.5 sm:gap-2 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shadow-sm ${
              isClockedIn
                ? 'bg-[#1A6BFF]/15 text-blue-300 border border-[#1A6BFF]/50 hover:bg-[#1A6BFF]/25 shadow-blue-500/10'
                : 'bg-[#0D1730] text-slate-300 hover:text-white border border-[#1B2C5B] hover:border-[#1A6BFF]/50'
            }`}
            title={isClockedIn ? 'Pulsar para fichar salida de la jornada' : 'Pulsar para fichar entrada en caseta'}
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
                <span className="hidden xs:inline">Fichar caseta</span>
                <span className="xs:hidden">Fichar</span>
              </>
            )}
          </button>

          {/* Botón Panel de Gestión */}
          <button
            onClick={() => setIsMapModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-slate-200 bg-[#0D1730] hover:bg-[#132145] border border-[#1B2C5B] hover:border-[#1A6BFF]/50 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shadow-sm group"
            title="Ver panel de gestión y los 4 departamentos de la constructora"
          >
            <Network className="h-3.5 w-3.5 text-[#1A6BFF] group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden sm:inline">Panel de gestión</span>
            <span className="sm:hidden">Panel</span>
          </button>

          {/* Menú Desplegable de Automatizaciones Departamentos */}
          <div className="relative" ref={deptMenuRef}>
            <button
              onClick={() => setIsDeptMenuOpen((prev) => !prev)}
              disabled={isLoading}
              className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-slate-200 bg-[#0D1730] hover:bg-[#132145] border border-[#1B2C5B] hover:border-[#1A6BFF]/50 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all shadow-sm group disabled:opacity-50"
            >
              <Zap className="h-3.5 w-3.5 text-[#1A6BFF] group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden lg:inline">Departamentos</span>
              <span className="lg:hidden">Áreas</span>
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
                    Departamentos Constructora
                  </p>
                  <span className="text-[10px] text-[#1A6BFF] font-medium bg-[#1A6BFF]/10 px-1.5 py-0.5 rounded border border-[#1A6BFF]/20">
                    4 Áreas Clave
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
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        </div>
      </header>

      {/* ================================================================== */}
      {/* MODAL: SUBIR Y FOTOGRAFIAR ALBARÁN DE OBRA CON OCR               */}
      {/* ================================================================== */}
      {isAlbaranModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-4xl max-h-[94vh] bg-[#0D1730] border border-[#1B2C5B] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal Albarán */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#1B2C5B] bg-[#0B132B]/95">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#1A6BFF]/15 border border-[#1A6BFF]/40 flex items-center justify-center text-[#1A6BFF] shadow-sm shrink-0">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                    Subir y Digitalizar Albarán de Obra
                    <span className="text-[10px] bg-[#1A6BFF]/20 text-blue-300 px-2 py-0.5 rounded-full border border-[#1A6BFF]/30 font-semibold">
                      OCR IA
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Captura la foto del albarán en obra para cotejar cantidades, precios y certificar entrega
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseAlbaranModal}
                className="p-1.5 text-slate-400 hover:text-white bg-[#080E1E] hover:bg-[#132145] border border-[#1B2C5B] rounded-lg transition-colors"
                title="Cerrar (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Contenido Modal: Vista dividida Cámara / Extracción OCR */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-gradient-to-b from-[#0D1730] to-[#080E1E]">
              {/* Columna Izquierda: Captura de Foto / Cámara (5 cols) */}
              <div className="lg:col-span-5 flex flex-col space-y-3">
                <p className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>📸 Captura Fotográfica</span>
                  <span className="text-[10px] text-slate-400">Paso 1: Foto del tajo</span>
                </p>

                <div className="relative aspect-[4/3] w-full bg-[#080E1E] border-2 border-dashed border-[#1B2C5B] rounded-xl overflow-hidden flex flex-col items-center justify-center p-3 text-center group">
                  {/* Visor de Video en Vivo */}
                  {isCameraActive ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={capturePhoto}
                        className="absolute bottom-3 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-2 animate-bounce"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Capturar Foto</span>
                      </button>
                    </div>
                  ) : capturedImage ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={capturedImage}
                        alt="Albarán Capturado"
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={startCamera}
                          className="px-3 py-1.5 bg-[#0D1730] text-white text-xs rounded-lg border border-[#1B2C5B] flex items-center gap-1.5 shadow"
                        >
                          <RefreshCw className="h-3.5 w-3.5 text-[#1A6BFF]" />
                          <span>Repetir foto</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 p-4">
                      <div className="mx-auto w-12 h-12 rounded-2xl bg-[#132145] border border-[#1B2C5B] flex items-center justify-center text-slate-400">
                        <FileText className="h-6 w-6 text-[#1A6BFF]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-200">
                          Enfoca el albarán del proveedor
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Hormigón, ferralla, áridos o materiales recibidos
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        <button
                          onClick={startCamera}
                          className="px-3 py-1.5 bg-[#1A6BFF] hover:bg-[#337EFF] text-white text-xs font-semibold rounded-lg shadow-md flex items-center gap-1.5 transition-all"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          <span>Abrir Cámara</span>
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-[#132145] hover:bg-[#1B2C5B] text-slate-200 text-xs font-medium rounded-lg border border-[#1B2C5B] flex items-center gap-1.5 transition-all"
                        >
                          <FileUp className="h-3.5 w-3.5" />
                          <span>Galería / Archivo</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Elemento Canvas invisible para captura */}
                  <canvas ref={canvasRef} className="hidden" />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                {cameraError && (
                  <p className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
                    ⚠️ {cameraError}
                  </p>
                )}

                {/* Presets rápidos para pruebas */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    O Carga un Albarán de Prueba de Nuestras Obras:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {ALBARAN_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectPreset(preset)}
                        className={`text-left p-2 rounded-lg border transition-all text-xs flex items-center justify-between ${
                          albaranForm.numeroAlbaran === preset.numeroAlbaran
                            ? 'bg-[#1A6BFF]/15 border-[#1A6BFF] text-blue-200'
                            : 'bg-[#080E1E] border-[#1B2C5B] text-slate-300 hover:border-[#1A6BFF]/40'
                        }`}
                      >
                        <div className="truncate">
                          <span className="font-semibold block">{preset.material}</span>
                          <span className="text-[10px] text-slate-400">{preset.obraDestino}</span>
                        </div>
                        <span className="font-mono text-xs text-white font-bold ml-2">
                          €{preset.importeTotal.toLocaleString('es-ES')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Datos Extraídos OCR (7 cols) */}
              <div className="lg:col-span-7 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Scan className="h-3.5 w-3.5 text-[#1A6BFF]" />
                    <span>Datos Extraídos & Validación Técnica</span>
                  </p>
                  {isScanningOCR ? (
                    <span className="text-[11px] text-[#1A6BFF] flex items-center gap-1 animate-pulse">
                      <Loader2 className="h-3 w-3 animate-spin" /> Escaneando OCR...
                    </span>
                  ) : (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                      ✓ Lectura Lista
                    </span>
                  )}
                </div>

                <div className="bg-[#080E1E] border border-[#1B2C5B] rounded-xl p-3.5 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Nº de Albarán:
                      </label>
                      <input
                        type="text"
                        value={albaranForm.numeroAlbaran}
                        onChange={(e) => setAlbaranForm({ ...albaranForm, numeroAlbaran: e.target.value })}
                        className="w-full bg-[#0D1730] border border-[#1B2C5B] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#1A6BFF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Proveedor / Planta:
                      </label>
                      <input
                        type="text"
                        value={albaranForm.proveedor}
                        onChange={(e) => setAlbaranForm({ ...albaranForm, proveedor: e.target.value })}
                        className="w-full bg-[#0D1730] border border-[#1B2C5B] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#1A6BFF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Obra de Destino:
                    </label>
                    <input
                      type="text"
                      value={albaranForm.obraDestino}
                      onChange={(e) => setAlbaranForm({ ...albaranForm, obraDestino: e.target.value })}
                      className="w-full bg-[#0D1730] border border-[#1B2C5B] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#1A6BFF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Material Suministrado:
                      </label>
                      <input
                        type="text"
                        value={albaranForm.material}
                        onChange={(e) => setAlbaranForm({ ...albaranForm, material: e.target.value })}
                        className="w-full bg-[#0D1730] border border-[#1B2C5B] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#1A6BFF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Cantidad:
                      </label>
                      <input
                        type="text"
                        value={albaranForm.cantidad}
                        onChange={(e) => setAlbaranForm({ ...albaranForm, cantidad: e.target.value })}
                        className="w-full bg-[#0D1730] border border-[#1B2C5B] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#1A6BFF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Importe Total (€):
                      </label>
                      <input
                        type="number"
                        value={albaranForm.importeTotal}
                        onChange={(e) => setAlbaranForm({ ...albaranForm, importeTotal: Number(e.target.value) || 0 })}
                        className="w-full bg-[#0D1730] border border-[#1B2C5B] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#1A6BFF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Firmado en Tajo por:
                      </label>
                      <input
                        type="text"
                        value={albaranForm.firmadoPor}
                        onChange={(e) => setAlbaranForm({ ...albaranForm, firmadoPor: e.target.value })}
                        className="w-full bg-[#0D1730] border border-[#1B2C5B] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#1A6BFF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Observaciones / Ensayos Técnicos:
                    </label>
                    <textarea
                      rows={2}
                      value={albaranForm.observaciones}
                      onChange={(e) => setAlbaranForm({ ...albaranForm, observaciones: e.target.value })}
                      className="w-full bg-[#0D1730] border border-[#1B2C5B] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#1A6BFF] resize-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-200 text-xs flex items-start gap-2.5">
                  <HardHat className="h-4 w-4 text-[#1A6BFF] shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Al pulsar <strong>Auditar y Registrar con IA</strong>, el asistente verificará si los precios y m³/kg coinciden con el presupuesto del proyecto y registrará el albarán en la base de costes de la obra.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer de Acciones del Modal Albarán */}
            <div className="px-4 sm:px-6 py-3 border-t border-[#1B2C5B] bg-[#0B132B]/95 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400">
                💾 Registro homologado bajo protocolo <strong>OBR-SOP-02</strong>
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCloseAlbaranModal}
                  className="w-full sm:w-auto px-3.5 py-2 text-xs text-slate-400 hover:text-slate-200 bg-[#080E1E] hover:bg-[#132145] border border-[#1B2C5B] rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleProcessAlbaranWithAI}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-[#1A6BFF] hover:bg-[#337EFF] rounded-lg transition-colors shadow-lg shadow-blue-500/25 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Auditar y Registrar con IA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL: PANEL DE GESTIÓN Y ORGANIGRAMA DE LOS 4 DEPARTAMENTOS      */}
      {/* ================================================================== */}
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
                    Panel de Gestión & Estructura Operativa de la Constructora
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-400 hidden xs:block">
                    Dirección General, Estudio, Obras, Proyectos, RRHH y Sistema RAG
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

                {/* Línea Conectora Horizontal entre 4 Departamentos (Desktop) */}
                <div className="hidden lg:block w-[78%] h-0.5 bg-[#1B2C5B] relative">
                  <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-blue-400"></div>
                  <div className="absolute -top-1 left-1/3 w-2 h-2 rounded-full bg-amber-400"></div>
                  <div className="absolute -top-1 left-2/3 w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-indigo-400"></div>
                </div>
              </div>

              {/* Nivel 2 y 3: Los 4 Departamentos de la Constructora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 items-stretch">
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

                      {/* Botones de acción */}
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
                💡 Haz clic en <strong>Reportar</strong> en cualquier área para ver el formulario pre-rellenado de incidencias de obra.
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

      {/* Modal Formulario Pre-rellenado de Reporte de Incidencias */}
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
                    Reporte de Incidencia en Obra / IA
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
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    De (Emisor):
                  </label>
                  <div className="bg-[#080E1E] border border-[#1B2C5B] rounded-lg px-3 py-2 text-xs text-slate-200">
                    <span className="font-semibold text-blue-400">{reportFormData.emisor}</span>
                    <span className="text-slate-400 block text-[11px]">{reportFormData.cargo}</span>
                  </div>
                </div>

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

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-[11px] leading-relaxed">
                  <span className="font-semibold">Acción recomendada:</span> Puedes enviar este reporte directamente al asistente para auditar los datos del departamento y aplicar la corrección en tiempo real.
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
                  Analizando datos de la constructora y formulando respuesta...
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:block">
                  Consultando Estudio, Obras, Proyectos, RRHH, Albaranes o Google Calendar
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
              <Sparkles className="h-3 w-3 text-[#1A6BFF]" /> Obras & Consultas:
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
            placeholder="Pregúntale a Deskly (ej. ¿Cuál es el precio del m³ de hormigón?, ¿Cuándo es el corte de certificaciones?)..."
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
