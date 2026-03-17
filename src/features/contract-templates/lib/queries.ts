import { apiClient } from '@/shared/lib/api-client';
import type { PaginatedResponse } from '@/shared/types/pagination';
import type {
  ContractTemplate,
  ContractTemplateListItem,
  PredefinedVariable,
  TemplatesQueryParams,
} from '../types';

export async function getContractTemplates(
  params: TemplatesQueryParams
): Promise<PaginatedResponse<ContractTemplateListItem>> {
  const response = await apiClient.get<PaginatedResponse<ContractTemplateListItem>>(
    '/api/contract-templates',
    { params }
  );
  return response.data;
}

export async function getContractTemplate(id: string): Promise<ContractTemplate> {
  const response = await apiClient.get<ContractTemplate>(`/api/contract-templates/${id}`);
  return response.data;
}

export async function getTemplateVariables(category?: string): Promise<PredefinedVariable[]> {
  const response = await apiClient.get<PredefinedVariable[]>('/api/contract-template-variables', {
    params: category ? { category } : undefined,
  });
  return response.data;
}
