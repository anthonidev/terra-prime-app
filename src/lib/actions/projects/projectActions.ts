'use server';
import { httpClient } from '@/lib/api/http-client';
import {
  ExcelValidationResponse,
  PaginatedLotsResponseDto,
  ProjectData,
  ProjectDetailDto,
  ProjectListResponseDto
} from '@/types/project.types';
export async function validateProjectExcel(formData: FormData): Promise<ExcelValidationResponse> {
  try {
    return await httpClient<ExcelValidationResponse>('/api/projects/validate-excel', {
      method: 'POST',
      body: formData,
      skipJsonStringify: true
    });
  } catch (error) {
    console.error('Error en validateProjectExcel:', error);
    throw error;
  }
}
export async function createBulkProject(projectData: ProjectData): Promise<unknown> {
  try {
    return await httpClient('/api/projects/bulk-create', {
      method: 'POST',
      body: { projectData: projectData }
    });
  } catch (error) {
    throw error;
  }
}
export async function getProjects(): Promise<ProjectListResponseDto> {
  try {
    const response = await httpClient<ProjectListResponseDto>('/api/projects', {
      method: 'GET'
    });
    const projectsWithDates = response.projects.map((project) => ({
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt)
    }));
    return {
      projects: projectsWithDates,
      total: response.total
    };
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    throw error;
  }
}
export async function getProjectDetail(id: string): Promise<ProjectDetailDto> {
  try {
    const response = await httpClient<ProjectDetailDto>(`/api/projects/${id}`, {
      method: 'GET'
    });
    return {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt)
    };
  } catch (error) {
    console.error(`Error al obtener detalle del proyecto ${id}:`, error);
    throw error;
  }
}
export async function getProjectLots(
  projectId: string,
  params?: Record<string, unknown> | undefined
): Promise<PaginatedLotsResponseDto> {
  try {
    const response = await httpClient<PaginatedLotsResponseDto>(`/api/projects/${projectId}/lots`, {
      method: 'GET',
      params
    });
    const itemsWithDates = response.items.map((lot) => ({
      ...lot,
      createdAt: new Date(lot.createdAt),
      updatedAt: new Date(lot.updatedAt)
    }));
    return {
      items: itemsWithDates,
      meta: response.meta
    };
  } catch (error) {
    console.error(`Error al obtener lotes del proyecto ${projectId}:`, error);
    throw error;
  }
}
interface UpdateProjectWithImageOptions {
  id: string;
  formData: FormData;
}
export async function updateProjectWithImage({
  id,
  formData
}: UpdateProjectWithImageOptions): Promise<ProjectDetailDto> {
  try {
    const response = await httpClient<ProjectDetailDto>(`/api/projects/${id}/with-image`, {
      method: 'PATCH',
      body: formData,
      skipJsonStringify: true
    });
    return {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt)
    };
  } catch (error) {
    console.error('Error en updateProjectWithImage:', error);
    throw error;
  }
}
