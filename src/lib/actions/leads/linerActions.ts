'use server';
import { httpClient } from '@/lib/api/http-client';
import { ActiveLinersResponse } from '@/types/leads.types';

export async function getActiveLiners(): Promise<ActiveLinersResponse> {
  try {
    return await httpClient<ActiveLinersResponse>('/api/liners/active/list');
  } catch (error) {
    console.error('Error al obtener liners activos:', error);
    throw error;
  }
}
