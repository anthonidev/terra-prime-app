'use server';

import { httpClient } from '@/lib/api/http-client';
import { revalidatePath, revalidateTag } from 'next/cache';
import {
  CreateUpdateLeadDto,
  CreateUpdateLeadResponse,
  FindLeadByDocumentDto,
  FindLeadResponse,
  ActiveLeadSourcesResponse,
  ActiveLinersResponse,
  UbigeoResponse
} from '@/types/leads.types';

const LEADS_CACHE_TAG = 'leads';

export async function findLeadByDocument(
  findDto: FindLeadByDocumentDto
): Promise<FindLeadResponse> {
  try {
    return await httpClient<FindLeadResponse>('/api/leads/find-by-document', {
      method: 'POST',
      body: findDto
    });
  } catch (error) {
    console.error('Error al buscar lead por documento:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
      data: null
    };
  }
}

export async function createOrUpdateLead(
  leadData: CreateUpdateLeadDto
): Promise<CreateUpdateLeadResponse> {
  try {
    const result = await httpClient<CreateUpdateLeadResponse>('/api/leads/register', {
      method: 'POST',
      body: leadData
    });

    revalidateTag(LEADS_CACHE_TAG);
    revalidatePath('/leads');
    revalidatePath('/leads/nuevo');

    return result;
  } catch (error) {
    console.error('Error al crear o actualizar lead:', error);
    throw error;
  }
}

export async function getActiveLeadSources(): Promise<ActiveLeadSourcesResponse> {
  try {
    return await httpClient<ActiveLeadSourcesResponse>('/api/lead-sources/active/list', {
      next: {
        tags: ['lead-sources-active']
      }
    });
  } catch (error) {
    console.error('Error al obtener fuentes de leads activas:', error);
    throw error;
  }
}

export async function getActiveLiners(): Promise<ActiveLinersResponse> {
  try {
    return await httpClient<ActiveLinersResponse>('/api/liners/active/list', {
      next: {
        tags: ['liners-active']
      }
    });
  } catch (error) {
    console.error('Error al obtener liners activos:', error);
    throw error;
  }
}

export async function getUbigeos(): Promise<UbigeoResponse> {
  try {
    return await httpClient<UbigeoResponse>('/api/ubigeos', {
      next: {
        tags: ['ubigeos'],
        revalidate: 3600 // Cache por 1 hora ya que no cambian frecuentemente
      }
    });
  } catch (error) {
    console.error('Error al obtener ubigeos:', error);
    throw error;
  }
}
