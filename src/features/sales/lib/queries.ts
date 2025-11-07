import { apiClient } from '@/shared/lib/api-client';
import type { PaginatedResponse } from '@/shared/types/pagination';
import type {
  Project,
  ProjectStage,
  ProjectBlock,
  Lot,
  LotsQueryParams,
  ProjectLotResponse,
  ClientByDocumentResponse,
  MySale,
  MySalesQueryParams,
  SaleDetail,
} from '../types';

// Get active projects
export async function getActiveProjects(): Promise<Project[]> {
  const response = await apiClient.get<Project[]>('/api/sales/projects/actives');
  return response.data;
}

// Get project lots with pagination and filters
export async function getProjectLots(
  projectId: string,
  params: LotsQueryParams = {}
): Promise<PaginatedResponse<Lot>> {
  const response = await apiClient.get<{
    items: Lot[];
    meta: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }>(`/api/sales/projects/lots/${projectId}`, { params });

  return {
    items: response.data.items,
    meta: response.data.meta,
  };
}

// Get project stages
export async function getProjectStages(projectId: string): Promise<ProjectStage[]> {
  const response = await apiClient.get<ProjectStage[]>(`/api/sales/stages/${projectId}`);
  return response.data;
}

// Get stage blocks
export async function getStageBlocks(stageId: string): Promise<ProjectBlock[]> {
  const response = await apiClient.get<ProjectBlock[]>(`/api/sales/blocks/${stageId}`);
  return response.data;
}

// Get block lots (filtered by active status)
export async function getBlockLots(blockId: string): Promise<ProjectLotResponse[]> {
  const response = await apiClient.get<ProjectLotResponse[]>(
    `/api/sales/lots/${blockId}`,
    { params: { status: 'Activo' } }
  );
  return response.data;
}

// Get client by document
export async function getClientByDocument(document: string): Promise<ClientByDocumentResponse | null> {
  try {
    const response = await apiClient.get<ClientByDocumentResponse>(
      `/api/sales/clients/document/${document}`
    );
    return response.data;
  } catch (error) {
    // Return null if client not found (404)
    return null;
  }
}

// Get my sales (vendor's sales)
export async function getMySales(
  params: MySalesQueryParams = {}
): Promise<PaginatedResponse<MySale>> {
  const response = await apiClient.get<{
    items: MySale[];
    meta: {
      totalItems: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }>('/api/sales/all/list/vendor', { params });

  return {
    items: response.data.items,
    meta: response.data.meta,
  };
}

// Get sale detail by id
export async function getSaleDetail(id: string): Promise<SaleDetail> {
  const response = await apiClient.get<SaleDetail>(`/api/sales/${id}`);
  return response.data;
}
