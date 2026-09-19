import { Client } from '@hubspot/api-client';
import { obtenerDealsHubspotMock } from './services/business-service';
import { CLIENTES_DB } from './data/business-database';

// Lazy client initialization to prevent server crash if token is missing during build
let hubspotClient: Client | null = null;

function getHubspotClient(): Client | null {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token || token.trim() === '' || token.includes('pat-na1-...')) {
    return null;
  }
  if (!hubspotClient) {
    hubspotClient = new Client({ accessToken: token });
  }
  return hubspotClient;
}

export interface HubspotContactResult {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  etapaCicloDeVida: string;
  estadoLead: string;
  empresa?: string;
}

export interface HubspotDealResult {
  id: string;
  nombreNegocio: string;
  monto: string;
  etapa: string;
  pipeline: string;
  fechaCierre: string;
  fechaCreacion: string;
}

/**
 * Busca contactos en HubSpot CRM por nombre, apellido o email.
 * Si no hay token de HubSpot o falla, busca en la base de datos empresarial de Deskly.
 */
export async function buscarContactoHubspot(query: string): Promise<HubspotContactResult[]> {
  const client = getHubspotClient();

  if (client) {
    try {
      const publicObjectSearchRequest = {
        query: query.trim(),
        limit: 10,
        after: '0',
        sorts: [],
        properties: [
          'firstname',
          'lastname',
          'email',
          'phone',
          'lifecyclestage',
          'hs_lead_status',
          'company',
        ],
        filterGroups: [],
      };

      const searchResponse = await client.crm.contacts.searchApi.doSearch(publicObjectSearchRequest as any);

      if (searchResponse.results && searchResponse.results.length > 0) {
        return searchResponse.results.map((contact) => ({
          id: contact.id,
          nombreCompleto: `${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim() || 'Sin nombre',
          email: contact.properties.email || 'No especificado',
          telefono: contact.properties.phone || 'No especificado',
          etapaCicloDeVida: contact.properties.lifecyclestage || 'Sin definir',
          estadoLead: contact.properties.hs_lead_status || 'Sin definir',
          empresa: contact.properties.company || 'Sin empresa',
        }));
      }
    } catch (error: any) {
      console.warn('HubSpot API no disponible o token inválido, usando CRM interno de Deskly:', error?.message || error);
    }
  }

  // Fallback inteligente usando la cartera de clientes de Deskly
  const q = query.toLowerCase().trim();
  const clientesCoincidentes = CLIENTES_DB.filter(
    (c) =>
      c.contactoPrincipal.toLowerCase().includes(q) ||
      c.nombreEmpresa.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q)
  );

  return clientesCoincidentes.map((c) => ({
    id: c.id,
    nombreCompleto: c.contactoPrincipal,
    email: c.email,
    telefono: c.telefono,
    etapaCicloDeVida: c.estado === 'Activo' ? 'Cliente Activo (Enterprise/Growth)' : c.estado,
    estadoLead: `Gestor: ${c.gestorCuenta} | NPS: ${c.nps}/10`,
    empresa: c.nombreEmpresa,
  }));
}

/**
 * Obtiene los negocios (deals) recientes registrados en HubSpot o en la base de datos empresarial.
 */
export async function obtenerDealsHubspot(limit: number = 10): Promise<HubspotDealResult[]> {
  const client = getHubspotClient();

  if (client) {
    try {
      const dealsResponse = await client.crm.deals.basicApi.getPage(
        limit,
        undefined,
        ['dealname', 'amount', 'dealstage', 'closedate', 'pipeline', 'createdate']
      );

      if (dealsResponse.results && dealsResponse.results.length > 0) {
        return dealsResponse.results.map((deal) => ({
          id: deal.id,
          nombreNegocio: deal.properties.dealname || 'Sin título',
          monto: deal.properties.amount ? `$${deal.properties.amount}` : 'No definido',
          etapa: deal.properties.dealstage || 'Sin etapa',
          pipeline: deal.properties.pipeline || 'Default',
          fechaCierre: deal.properties.closedate || 'No definida',
          fechaCreacion: deal.properties.createdate || 'No definida',
        }));
      }
    } catch (error: any) {
      console.warn('HubSpot API no disponible o token inválido, usando deals de Deskly:', error?.message || error);
    }
  }

  // Fallback enriquecido con negocios del pipeline de Deskly
  const mockDeals = obtenerDealsHubspotMock();
  return mockDeals.slice(0, limit).map((deal) => ({
    id: deal.id,
    nombreNegocio: deal.dealname,
    monto: `€${deal.amount}`,
    etapa: deal.dealstage,
    pipeline: deal.pipeline,
    fechaCierre: deal.fechaCierre,
    fechaCreacion: deal.fechaCreacion,
  }));
}
