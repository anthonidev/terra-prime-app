import { apiClient } from '@/shared/lib/api-client';
import type {
  ProjectDetail,
  UpdateProjectInput,
  CreateStageInput,
  UpdateStageInput,
  CreateBlockInput,
  UpdateBlockInput,
  CreateLotInput,
  UpdateLotInput,
  Stage,
  Block,
  Lot,
  ValidateExcelResponse,
  BulkCreateResponse,
} from '../types';

// Project mutations
export async function updateProject(id: string, data: UpdateProjectInput): Promise<ProjectDetail> {
  const formData = new FormData();

  if (data.name) formData.append('name', data.name);
  if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
  if (data.logo) formData.append('logo', data.logo);

  const response = await apiClient.patch<ProjectDetail>(
    `/api/projects/${id}/with-image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

// Stage mutations
export async function createStage(data: CreateStageInput): Promise<Stage> {
  const response = await apiClient.post<Stage>('/api/stages', data);
  return response.data;
}

export async function updateStage(id: string, data: UpdateStageInput): Promise<Stage> {
  const response = await apiClient.patch<Stage>(`/api/stages/${id}`, data);
  return response.data;
}

// Block mutations
export async function createBlock(data: CreateBlockInput): Promise<Block> {
  const response = await apiClient.post<Block>('/api/blocks', data);
  return response.data;
}

export async function updateBlock(id: string, data: UpdateBlockInput): Promise<Block> {
  const response = await apiClient.patch<Block>(`/api/blocks/${id}`, data);
  return response.data;
}

// Lot mutations
export async function createLot(data: CreateLotInput): Promise<Lot> {
  const response = await apiClient.post<Lot>('/api/lots', data);
  return response.data;
}

export async function updateLot(id: string, data: UpdateLotInput): Promise<Lot> {
  const response = await apiClient.patch<Lot>(`/api/lots/${id}`, data);
  return response.data;
}

// Bulk creation mutations
export async function validateExcel(file: File): Promise<ValidateExcelResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<ValidateExcelResponse>(
    '/api/projects/validate-excel',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

export async function bulkCreateProject(file: File): Promise<BulkCreateResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<BulkCreateResponse>('/api/projects/bulk-create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}
