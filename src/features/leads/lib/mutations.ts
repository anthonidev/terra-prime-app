import { apiClient } from '@/shared/lib/api-client';
import type {
  LeadSource,
  CreateLeadSourceInput,
  UpdateLeadSourceInput,
  LeadSourceResponse,
  FindLeadByDocumentInput,
  FindLeadByDocumentResponse,
  CreateUpdateLeadInput,
  RegisterLeadResponse,
} from '../types';

export async function createLeadSource(
  data: CreateLeadSourceInput
): Promise<LeadSource> {
  const response = await apiClient.post<LeadSourceResponse>(
    '/api/lead-sources',
    data
  );
  return response.data.data;
}

export async function updateLeadSource(
  id: number,
  data: UpdateLeadSourceInput
): Promise<LeadSource> {
  const response = await apiClient.patch<LeadSourceResponse>(
    `/api/lead-sources/${id}`,
    data
  );
  return response.data.data;
}

export async function findLeadByDocument(
  data: FindLeadByDocumentInput
): Promise<FindLeadByDocumentResponse> {
  const response = await apiClient.post<FindLeadByDocumentResponse>(
    '/api/leads/find-by-document',
    data
  );
  return response.data;
}

export async function registerLead(
  data: CreateUpdateLeadInput
): Promise<RegisterLeadResponse> {
  const response = await apiClient.post<RegisterLeadResponse>(
    '/api/leads/register',
    data
  );
  return response.data;
}
