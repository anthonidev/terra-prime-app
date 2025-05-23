'use server';
import { httpClient } from '@/lib/api/http-client';
import { ActiveLeadSourcesResponse } from '@/types/leads.types';

export async function getActiveLeadSources(): Promise<ActiveLeadSourcesResponse> {
  try {
    return await httpClient<ActiveLeadSourcesResponse>('/api/lead-sources/active/list');
  } catch (error) {
    console.error('Error al obtener fuentes de leads activas:', error);
    throw error;
  }
}
