'use server';

import { httpClient } from '@/lib/api/http-client';
import { revalidatePath, revalidateTag } from 'next/cache';
import {
  PaginatedLeadsResponse,
  CreateUpdateLeadDto,
  CreateUpdateLeadResponse,
  RegisterDepartureResponse
} from '@/types/leads.types';

const LEADS_CACHE_TAG = 'leads';

export async function getLeads(params?: Record<string, unknown>): Promise<PaginatedLeadsResponse> {
  try {
    return await httpClient<PaginatedLeadsResponse>('/api/leads', {
      params,
      next: {
        tags: [LEADS_CACHE_TAG],
        revalidate: 300
      }
    });
  } catch (error) {
    console.error('Error al obtener leads:', error);
    throw error;
  }
}

export async function createLead(data: CreateUpdateLeadDto) {
  try {
    const result = await httpClient<CreateUpdateLeadResponse>('/api/leads/register', {
      cache: 'no-store',
      method: 'POST',
      body: data
    });

    revalidateTag(LEADS_CACHE_TAG);
    revalidatePath('/leads');

    return { success: true, data: result };
  } catch (error) {
    console.error('Error al crear lead:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear lead'
    };
  }
}

export async function updateLead(id: string, data: CreateUpdateLeadDto) {
  try {
    const result = await httpClient<CreateUpdateLeadResponse>(`/api/leads/update/${id}`, {
      cache: 'no-store',
      method: 'PATCH',
      body: data
    });

    revalidateTag(LEADS_CACHE_TAG);
    revalidatePath('/leads');

    return { success: true, data: result };
  } catch (error) {
    console.error(`Error al actualizar lead (ID: ${id}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar lead'
    };
  }
}

export async function registerDeparture(id: string) {
  try {
    const result = await httpClient<RegisterDepartureResponse>(
      `/api/leads/register-departure/${id}`,
      {
        method: 'POST',
        cache: 'no-store'
      }
    );

    revalidateTag(LEADS_CACHE_TAG);
    revalidatePath('/leads');

    return { success: true, data: result };
  } catch (error) {
    console.error(`Error al registrar salida del lead (ID: ${id}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al registrar salida'
    };
  }
}

export async function generateReport(leadId: string) {
  try {
    const result = await httpClient<{
      success: string;
      message: string;
      data: {
        leadId: string;
        documentUrl: string;
        generatedAt: string;
        clientName: string;
        documentNumber: string;
        leadInfo: {
          documentType: string;
          phone: string;
          source: string;
        };
        isNewDocument: boolean;
      };
    }>(`/api/reports-leads/generate/${leadId}`, {
      method: 'POST',
      cache: 'no-store'
    });

    revalidateTag('leads');
    revalidatePath('/leads');

    return result;
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
}

export async function regenerateReport(leadId: string) {
  try {
    const result = await httpClient<{
      success: string;
      message: string;
      data: {
        leadId: string;
        documentUrl: string;
        generatedAt: string;
        clientName: string;
        documentNumber: string;
        leadInfo: {
          documentType: string;
          phone: string;
          source: string;
        };
        isNewDocument: boolean;
      };
    }>(`/api/reports-leads/regenerate/${leadId}`, {
      method: 'POST',
      cache: 'no-store'
    });

    revalidateTag('leads');
    revalidatePath('/leads');

    return result;
  } catch (error) {
    if (error instanceof Error) console.log(error.message);
  }
}
