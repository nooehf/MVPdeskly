# Ops AI Assistant - Gemini 2.5 Flash + HubSpot CRM + Google Calendar

Una aplicación web lista para producción construida con **Next.js (App Router, TypeScript)** y **Tailwind CSS**, optimizada para la capa serverless gratuita de **Vercel**. Integra el SDK oficial `@google/genai` con el modelo `gemini-2.5-flash` y capacidades nativas de **Function Calling** conectadas en tiempo real a **HubSpot CRM** y **Google Calendar**.

---

## 🚀 Características Principales

- **Modelo de IA:** Google Gemini 2.5 Flash con Function Calling bidireccional.
- **Integración HubSpot:** Búsqueda en vivo de contactos y consulta de oportunidades de venta / deals.
- **Integración Google Calendar:** Consulta de agenda y eventos por rangos de fecha con Service Account JWT.
- **Interfaz Moderna:**
  - Panel de chat oscuro minimalista con soporte completo para **Markdown** (tablas, listas, enlaces, negritas).
  - Indicadores visuales de ejecución de herramientas (*Tool Badges*).
  - Sugerencias rápidas de preguntas para testing inmediato.
  - Scroll automático, atajos de teclado (`Enter` para enviar, `Shift + Enter` para salto de línea) y botón para reiniciar chat.
- **Despliegue Serverless:** Configurado para Vercel Serverless (Node.js runtime, variables de entorno seguras y multilínea).

---

## 📁 Estructura del Proyecto

```
MVPdeskly/
├── .env.example                     # Plantilla de variables de entorno
├── package.json                     # Dependencias y scripts
├── tsconfig.json                    # Configuración TypeScript
├── next.config.mjs                  # Configuración Next.js para serverless
├── tailwind.config.ts               # Tema y colores Tailwind CSS
├── postcss.config.mjs               # Configuración PostCSS
├── app/
│   ├── layout.tsx                   # Layout global
│   ├── globals.css                  # Estilos globales y formateo Markdown
│   ├── page.tsx                     # Chat Dashboard interactivo
│   └── api/
│       └── chat/
│           └── route.ts             # Route Handler con Function Calling Loop y Gemini SDK
├── lib/
│   ├── gemini.ts                    # Instancia de GoogleGenAI (@google/genai)
│   ├── hubspot.ts                   # Cliente y consultas HubSpot (Contacts, Deals)
│   ├── google-calendar.ts           # Cliente JWT y consultas Google Calendar API
│   └── tools.ts                     # Declaraciones de herramientas y ejecutor
└── README.md
```

---

## 🛠️ Instalación y Configuración Local

### 1. Clonar o acceder al proyecto e instalar dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

Rellena las variables en `.env.local`:

```env
# Google AI Studio
GEMINI_API_KEY="AIzaSy..."

# HubSpot CRM (Private App Token)
HUBSPOT_ACCESS_TOKEN="pat-na1-..."

# Google Calendar Service Account
GOOGLE_SERVICE_ACCOUNT_EMAIL="calendar-assistant@tu-proyecto.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID="tu-email@gmail.com"
```

---

## 🔑 Guía para Obtener las Credenciales

### 1. Gemini API Key (Google AI Studio)
1. Entra en [Google AI Studio](https://aistudio.google.com/).
2. Haz clic en **"Get API key"** y crea una nueva clave.
3. Cópiala en `GEMINI_API_KEY`.

### 2. HubSpot CRM (Private App Token)
1. Inicia sesión en tu cuenta de [HubSpot](https://app.hubspot.com/).
2. Ve a **Configuración (⚙️)** > **Integraciones** > **Aplicaciones privadas (Private Apps)**.
3. Haz clic en **Crear una aplicación privada**.
4. En la pestaña **Scopes**, añade:
   - `crm.objects.contacts.read` (leer contactos)
   - `crm.objects.deals.read` (leer negocios/oportunidades)
5. Guarda y genera el token de acceso. Cópialo en `HUBSPOT_ACCESS_TOKEN`.

### 3. Google Calendar (Service Account)
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un proyecto (o selecciona uno existente).
3. En **APIs y Servicios** > **Biblioteca**, busca y habilita **Google Calendar API**.
4. En **IAM y Administración** > **Cuentas de servicio**, haz clic en **Crear cuenta de servicio**.
5. Copia el email generado (ej. `mi-cuenta@mi-proyecto.iam.gserviceaccount.com`) en `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
6. En la cuenta de servicio creada, ve a la pestaña **Claves** > **Agregar clave** > **Crear clave nueva (JSON)**.
7. Abre el archivo JSON descargado y copia el valor de `private_key` en `GOOGLE_PRIVATE_KEY`.
8. **MUY IMPORTANTE (Compartir Calendario):**
   - Abre [Google Calendar](https://calendar.google.com/).
   - En el menú lateral izquierdo, pasa el ratón sobre tu calendario personal > **Configuración y uso compartido**.
   - En la sección **"Compartir con personas o grupos específicos"**, haz clic en **Añadir personas**.
   - Pega el email de la Service Account (`GOOGLE_SERVICE_ACCOUNT_EMAIL`) con permisos **"Ver todos los detalles del evento"**.
   - Copia tu ID de calendario (o tu dirección de email de Google) en `GOOGLE_CALENDAR_ID`.

---

## 💻 Ejecución en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para interactuar con el asistente.

---

## 🚢 Despliegue en Vercel

1. Sube el repositorio a GitHub / GitLab.
2. Importa el proyecto en [Vercel](https://vercel.com/new).
3. En la sección **Environment Variables**, añade todas las variables de tu archivo `.env.local`:
   - `GEMINI_API_KEY`
   - `HUBSPOT_ACCESS_TOKEN`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (puedes pegarla con los `\n` escapados o con saltos de línea reales; el backend normaliza ambos formatos automáticamente).
   - `GOOGLE_CALENDAR_ID`
4. Haz clic en **Deploy**.
