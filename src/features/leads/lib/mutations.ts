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
  UpdateLeadInput,
  UpdateLeadResponse,
  RegisterDepartureResponse,
  GenerateReportResponse,
  AssignParticipantsInput,
  AssignParticipantsResponse,
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

export async function updateLead(
  id: string,
  data: UpdateLeadInput
): Promise<UpdateLeadResponse> {
  const response = await apiClient.patch<UpdateLeadResponse>(
    `/api/leads/update/${id}`,
    data
  );
  return response.data;
}

export async function registerDeparture(
  id: string
): Promise<RegisterDepartureResponse> {
  console.log('Registering departure for lead ID:', id);
  const response = await apiClient.post<RegisterDepartureResponse>(
    `/api/leads/register-departure/${id}`
  );
  return response.data;
}

export async function generateReport(
  visitId: string
): Promise<GenerateReportResponse> {
  const response = await apiClient.post<GenerateReportResponse>(
    `/api/reports-leads/generate/${visitId}`
  );
  return response.data;
}

export async function regenerateReport(
  visitId: string
): Promise<GenerateReportResponse> {
  const response = await apiClient.post<GenerateReportResponse>(
    `/api/reports-leads/regenerate/${visitId}`
  );
  return response.data;
}

export async function assignParticipants(
  visitId: string,
  data: AssignParticipantsInput
): Promise<AssignParticipantsResponse> {
  console.log('Assigning participants for lead ID:', visitId);
  const response = await apiClient.post<AssignParticipantsResponse>(
    `/api/leads/assign/participants/${visitId}`,
    data
  );
  return response.data;
}

export async function assignLeadsToVendor(data: {
  leadsId: string[];
  vendorId: string;
}): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    '/api/sales/leads/assign/vendor',
    data
  );
  return response.data;
}
