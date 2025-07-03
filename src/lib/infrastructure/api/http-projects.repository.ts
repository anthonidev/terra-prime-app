import { httpClient } from '@/lib/api/http-client';
import { Meta } from '@infrastructure/types/pagination.types';
import {
  ProjectRepository,
  StageRepository,
  BlockRepository,
  LotRepository
} from '@domain/repositories/projects.repository';
import {
  ValidateProjectExcelDTO,
  CreateBulkProjectDTO,
  GetProjectDetailDTO,
  GetProjectLotsDTO,
  UpdateProjectWithImageDTO,
  CreateStageDTO,
  UpdateStageDTO,
  CreateBlockDTO,
  UpdateBlockDTO,
  CreateLotDTO,
  UpdateLotDTO
} from '@application/dtos/projects';
import {
  ProjectList,
  ProjectDetail,
  LotResponse,
  ExcelValidation,
  StageDetail,
  BlockDetail
} from '@domain/entities/projects/project.entity';

export class HttpProjectRepository implements ProjectRepository {
  async getProjects(): Promise<{ projects: ProjectList[]; total: number }> {
    try {
      const response = await httpClient<{ projects: ProjectList[]; total: number }>(
        '/api/projects',
        {
          method: 'GET'
        }
      );

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
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }

  async getProjectDetail(dto: GetProjectDetailDTO): Promise<ProjectDetail> {
    try {
      const response = await httpClient<ProjectDetail>(`/api/projects/${dto.id}`, {
        method: 'GET'
      });
      return {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt)
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }

  async getProjectLots(dto: GetProjectLotsDTO): Promise<{ items: LotResponse[]; meta: Meta }> {
    try {
      const response = await httpClient<{ items: LotResponse[]; meta: Meta }>(
        `/api/projects/${dto.projectId}/lots`,
        {
          method: 'GET',
          params: dto.params
        }
      );

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
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }

  async validateExcel(dto: ValidateProjectExcelDTO): Promise<ExcelValidation> {
    try {
      return await httpClient<ExcelValidation>('/api/projects/validate-excel', {
        method: 'POST',
        body: dto.file,
        skipJsonStringify: true
      });
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }

  async createBulk(dto: CreateBulkProjectDTO): Promise<unknown> {
    try {
      return await httpClient('/api/projects/bulk-create', {
        method: 'POST',
        body: dto.formData,
        skipJsonStringify: true
      });
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }

  async updateWithImage(dto: UpdateProjectWithImageDTO): Promise<ProjectDetail> {
    try {
      const response = await httpClient<ProjectDetail>(`/api/projects/${dto.id}/with-image`, {
        method: 'PATCH',
        body: dto.formData,
        skipJsonStringify: true
      });
      return {
        ...response,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.updatedAt)
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpStageRepository implements StageRepository {
  async create(dto: CreateStageDTO): Promise<StageDetail> {
    try {
      const response = await httpClient<StageDetail>('/api/stages', {
        method: 'POST',
        body: dto
      });
      return response;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }

  async update(id: string, dto: UpdateStageDTO): Promise<StageDetail> {
    try {
      const response = await httpClient<StageDetail>(`/api/stages/${id}`, {
        method: 'PATCH',
        body: dto
      });
      return response;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpBlockRepository implements BlockRepository {
  async create(dto: CreateBlockDTO): Promise<BlockDetail> {
    try {
      const response = await httpClient<BlockDetail>('/api/blocks', {
        method: 'POST',
        body: dto
      });
      return response;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }

  async update(id: string, dto: UpdateBlockDTO): Promise<BlockDetail> {
    try {
      const response = await httpClient<BlockDetail>(`/api/blocks/${id}`, {
        method: 'PATCH',
        body: dto
      });
      return response;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpLotRepository implements LotRepository {
  async create(dto: CreateLotDTO): Promise<LotResponse> {
    try {
      const response = await httpClient<LotResponse>('/api/lots', {
        method: 'POST',
        body: dto
      });
      return response;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }

  async update(id: string, dto: UpdateLotDTO): Promise<LotResponse> {
    try {
      const response = await httpClient<LotResponse>(`/api/lots/${id}`, {
        method: 'PATCH',
        body: dto
      });
      return response;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}
