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
        tags: [LEADS_CACHE_TAG]
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
        method: 'POST'
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
