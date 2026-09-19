import { google } from 'googleapis';
import { obtenerEventosCalendarioMock } from './services/business-service';

/**
 * Normaliza y formatea la clave privada de Google Service Account
 * para resolver problemas comunes con saltos de línea al desplegar en Vercel.
 */
function formatPrivateKey(key: string): string {
  if (!key) return '';
  // Remover comillas envolventes si existen
  let cleanKey = key.trim();
  if ((cleanKey.startsWith('"') && cleanKey.endsWith('"')) || (cleanKey.startsWith("'") && cleanKey.endsWith("'"))) {
    cleanKey = cleanKey.slice(1, -1);
  }
  // Reemplazar saltos de línea escapados \n por caracteres de nueva línea reales
  return cleanKey.replace(/\\n/g, '\n');
}

function getCalendarClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (
    !clientEmail ||
    !rawKey ||
    !calendarId ||
    clientEmail.includes('tu-proyecto') ||
    rawKey.includes('-----BEGIN PRIVATE KEY-----\\nMIIEvg')
  ) {
    return null;
  }

  const privateKey = formatPrivateKey(rawKey);

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  });

  const calendar = google.calendar({ version: 'v3', auth });

  return { calendar, calendarId };
}

export interface CalendarEventResult {
  id: string;
  titulo: string;
  descripcion: string;
  inicio: string;
  fin: string;
  ubicacion?: string;
  link?: string;
  estado?: string;
}

/**
 * Consulta eventos del calendario personal en un rango de fechas.
 * Si no están configuradas las credenciales de Google Cloud, devuelve la agenda operativa de Deskly.
 * @param timeMin Fecha y hora inicial en formato ISO 8601.
 * @param timeMax Fecha y hora final en formato ISO 8601.
 */
export async function obtenerEventosCalendario(
  timeMin?: string,
  timeMax?: string
): Promise<CalendarEventResult[]> {
  const clientData = getCalendarClient();

  if (clientData) {
    try {
      const { calendar, calendarId } = clientData;
      const now = new Date();
      const defaultTimeMin = timeMin || new Date(now.setHours(0, 0, 0, 0)).toISOString();

      const response = await calendar.events.list({
        calendarId: calendarId,
        timeMin: defaultTimeMin,
        timeMax: timeMax || undefined,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 20,
      });

      const items = response.data.items || [];

      if (items.length > 0) {
        return items.map((event) => ({
          id: event.id || 'sin-id',
          titulo: event.summary || 'Evento sin título',
          descripcion: event.description || 'Sin descripción',
          inicio: event.start?.dateTime || event.start?.date || 'Hora no especificada',
          fin: event.end?.dateTime || event.end?.date || 'Hora no especificada',
          ubicacion: event.location || 'Sin ubicación',
          link: event.htmlLink || undefined,
          estado: event.status || 'confirmado',
        }));
      }
    } catch (error: any) {
      console.warn('Google Calendar API no disponible o credenciales inválidas, usando agenda de Deskly:', error?.message || error);
    }
  }

  // Fallback con eventos de agenda operativa y reuniones de negocio de Deskly
  const mockEvents = obtenerEventosCalendarioMock();
  return mockEvents.map((evt) => ({
    id: evt.id,
    titulo: evt.summary,
    descripcion: evt.description,
    inicio: evt.start?.dateTime || 'Hora no especificada',
    fin: evt.end?.dateTime || 'Hora no especificada',
    ubicacion: evt.location || 'Sin ubicación',
    estado: 'confirmado',
  }));
}
