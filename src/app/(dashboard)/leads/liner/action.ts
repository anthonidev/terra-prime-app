'use server';

import { httpClient } from '@/lib/api/http-client';
import { CreateLinerDto, LinersResponse, UpdateLinerDto } from '@/types/leads.types';
import { revalidatePath, revalidateTag } from 'next/cache';

const LINERS_CACHE_TAG = 'liners';

export async function getLiners(params?: Record<string, unknown>): Promise<LinersResponse> {
  try {
    return await httpClient<LinersResponse>('/api/liners', {
      params,

      next: {
        tags: [LINERS_CACHE_TAG],
        revalidate: 300
      }
    });
  } catch (error) {
    console.error('Error al obtener liners:', error);
    throw error;
  }
}

export async function createLiner(data: CreateLinerDto) {
  try {
    const result = await httpClient('/api/liners', {
      cache: 'no-store',
      method: 'POST',
      body: data
    });

    revalidateTag(LINERS_CACHE_TAG);
    revalidatePath('/leads/liner');

    return { success: true, data: result };
  } catch (error) {
    console.error('Error al crear liner:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear liner'
    };
  }
}

export async function updateLiner(id: string, data: UpdateLinerDto) {
  try {
    const result = await httpClient(`/api/liners/${id}`, {
      cache: 'no-store',
      method: 'PATCH',
      body: data
    });

    revalidateTag(LINERS_CACHE_TAG);
    revalidatePath('/leads/liner');

    return { success: true, data: result };
  } catch (error) {
    console.error(`Error al actualizar liner (ID: ${id}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar liner'
    };
  }
}
