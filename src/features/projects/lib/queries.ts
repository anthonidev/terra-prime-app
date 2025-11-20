import { apiClient } from '@/shared/lib/api-client';
import type {
  ProjectsResponse,
  ProjectDetail,
  PaginatedResponse,
  Lot,
  LotsQueryParams,
} from '../types';

export async function getProjects(): Promise<ProjectsResponse> {
  const response = await apiClient.get<ProjectsResponse>('/api/projects');
  return response.data;
}

export async function getProject(id: string): Promise<ProjectDetail> {
  const response = await apiClient.get<ProjectDetail>(`/api/projects/${id}`);
  return response.data;
}

export async function getProjectLots(
  projectId: string,
  params: LotsQueryParams = {}
): Promise<PaginatedResponse<Lot>> {
  const response = await apiClient.get<PaginatedResponse<Lot>>(`/api/projects/${projectId}/lots`, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      ...(params.stageId && { stageId: params.stageId }),
      ...(params.blockId && { blockId: params.blockId }),
      ...(params.status && { status: params.status }),
      ...(params.search && { search: params.search }),
    },
  });
  return response.data;
}
