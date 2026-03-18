import { apiClient } from '@/shared/lib/api-client';
import type { PaginatedResponse } from '@/shared/types/pagination';
import type {
  LeadSource,
  LeadSourcesQueryParams,
  Lead,
  LeadsQueryParams,
  UbigeoItem,
  LeadDetailResponse,
  ParticipantResponseActive,
} from '../types';

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

export async function getLeads(params: LeadsQueryParams = {}): Promise<PaginatedResponse<Lead>> {
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

export async function getLeadDetail(id: string): Promise<Lead> {
  const response = await apiClient.get<LeadDetailResponse>(`/api/leads/${id}`);
  return response.data.data;
}

export async function getParticipants(): Promise<ParticipantResponseActive[]> {
  const response = await apiClient.get<ParticipantResponseActive[]>(
    '/api/participants/all/actives'
  );
  return response.data;
}

export async function getDayLeads(params: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Lead>> {
  const response = await apiClient.get<{
    items: Lead[];
    meta: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }>('/api/sales/leads/day', { params });

  return {
    items: response.data.items,
    meta: response.data.meta,
  };
}

export async function getVendorLeads(): Promise<import('../types').VendorLead[]> {
  const response = await apiClient.get<import('../types').VendorLead[]>('/api/sales/leads/vendor');
  return response.data;
}
