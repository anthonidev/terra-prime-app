import { apiClient } from '@/shared/lib/api-client';
import type { ContractTemplate, CreateTemplateInput, UpdateTemplateInput } from '../types';

export async function createContractTemplate(
  input: CreateTemplateInput
): Promise<ContractTemplate> {
  const response = await apiClient.post<ContractTemplate>('/api/contract-templates', input);
  return response.data;
}

export async function updateContractTemplate(
  id: string,
  input: UpdateTemplateInput
): Promise<ContractTemplate> {
  const response = await apiClient.patch<ContractTemplate>(`/api/contract-templates/${id}`, input);
  return response.data;
}

export async function publishTemplate(id: string): Promise<ContractTemplate> {
  const response = await apiClient.patch<ContractTemplate>(`/api/contract-templates/${id}/publish`);
  return response.data;
}

export async function unpublishTemplate(id: string): Promise<ContractTemplate> {
  const response = await apiClient.patch<ContractTemplate>(
    `/api/contract-templates/${id}/unpublish`
  );
  return response.data;
}

export async function deleteContractTemplate(id: string): Promise<{ message: string }> {
  const response = await apiClient.delete<{ message: string }>(`/api/contract-templates/${id}`);
  return response.data;
}
