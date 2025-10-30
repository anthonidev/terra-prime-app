import { apiClient } from '@/shared/lib/api-client';
import type { PaginatedResponse } from '@/shared/types/pagination';
import type { Project, ProjectStage, ProjectBlock, Lot, LotsQueryParams } from '../types';

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
