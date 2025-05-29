'use server';

import { httpClient } from '@/lib/api/http-client';
import {
  CreateUpdateLeadDto,
  CreateUpdateLeadResponse,
  LeadDetailResponse,
  RegisterDepartureResponse
} from '@/types/leads.types';
import { revalidatePath, revalidateTag } from 'next/cache';

const LEAD_CACHE_TAG = 'lead-detail';

export async function getLeadDetail(leadId: string): Promise<LeadDetailResponse> {
  try {
    return await httpClient<LeadDetailResponse>(`/api/leads/${leadId}`, {
      method: 'GET',
      next: {
        tags: [`${LEAD_CACHE_TAG}-${leadId}`],
        revalidate: 300
      }
    });
  } catch (error) {
    console.error('Error al obtener detalle del lead:', error);
    throw error;
  }
}

export async function updateLeadContact(leadId: string, data: CreateUpdateLeadDto) {
  try {
    const result = await httpClient<CreateUpdateLeadResponse>(`/api/leads/update/${leadId}`, {
      method: 'PATCH',
      body: data,
      cache: 'no-store'
    });

    revalidateTag(`${LEAD_CACHE_TAG}-${leadId}`);
    revalidatePath(`/leads/detalle/${leadId}`);
    revalidatePath('/leads');

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar lead'
    };
  }
}

export async function registerLeadDeparture(leadId: string) {
  try {
    const result = await httpClient<RegisterDepartureResponse>(
      `/api/leads/register-departure/${leadId}`,
      {
        method: 'POST',
        cache: 'no-store'
      }
    );

    revalidateTag(`${LEAD_CACHE_TAG}-${leadId}`);
    revalidatePath(`/leads/detalle/${leadId}`);
    revalidatePath('/leads');

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al registrar salida'
    };
  }
}
