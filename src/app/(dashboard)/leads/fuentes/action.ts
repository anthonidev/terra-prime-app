'use server';

import { httpClient } from '@/lib/api/http-client';
import { CreateLeadSourceDto, LeadSourcesResponse, UpdateLeadSourceDto } from '@/types/leads.types';
import { revalidatePath, revalidateTag } from 'next/cache';

const LEAD_SOURCES_CACHE_TAG = 'lead-sources';

export async function getLeadSources(
  params?: Record<string, unknown>
): Promise<LeadSourcesResponse> {
  try {
    return await httpClient<LeadSourcesResponse>('/api/lead-sources', {
      params,
      next: {
        tags: [LEAD_SOURCES_CACHE_TAG],
        revalidate: 300
      }
    });
  } catch (error) {
    throw error;
  }
}

export async function createLeadSource(data: CreateLeadSourceDto) {
  try {
    const result = await httpClient('/api/lead-sources', {
      cache: 'no-store',
      method: 'POST',
      body: data
    });

    revalidateTag(LEAD_SOURCES_CACHE_TAG);
    revalidatePath('/leads/fuentes');

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear fuente de lead'
    };
  }
}

export async function updateLeadSource(id: number, data: UpdateLeadSourceDto) {
  try {
    const result = await httpClient(`/api/lead-sources/${id}`, {
      cache: 'no-store',
      method: 'PATCH',
      body: data
    });

    revalidateTag(LEAD_SOURCES_CACHE_TAG);
    revalidatePath('/leads/fuentes');

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar fuente de lead'
    };
  }
}
