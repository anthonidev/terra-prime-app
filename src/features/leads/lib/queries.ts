import { apiClient } from '@/shared/lib/api-client';
import type { PaginatedResponse } from '@/shared/types/pagination';
import type { LeadSource, LeadSourcesQueryParams, Lead, LeadsQueryParams, UbigeoItem } from '../types';

export async function getLeadSources(
  params: LeadSourcesQueryParams = {}
): Promise<PaginatedResponse<LeadSource>> {
  const response = await apiClient.get<{
    success: boolean;
    data: LeadSource[];
    meta: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }>('/api/lead-sources', { params });

  return {
    items: response.data.data,
    meta: response.data.meta,
  };
}

export async function getLeads(
  params: LeadsQueryParams = {}
): Promise<PaginatedResponse<Lead>> {
  const response = await apiClient.get<{
    data: Lead[];
    meta: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }>('/api/leads', { params });

  return {
    items: response.data.data,
    meta: response.data.meta,
  };
}

export async function getActiveLeadSources(): Promise<LeadSource[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: LeadSource[];
  }>('/api/lead-sources/active/list');
  return response.data.data;
}

export async function getUbigeos(): Promise<UbigeoItem[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: UbigeoItem[];
  }>('/api/ubigeos');
  return response.data.data;
}
