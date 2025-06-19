import {
  BlockRepository,
  LotRepository,
  ProjectRepository,
  StageRepository
} from '@domain/repositories/lotes.repository';

import {
  ProjectsResponse,
  ProjectBlocksResponse,
  ProjectStagesResponse,
  ProjectLotsResponse
} from '@infrastructure/types/lotes/api-response.types';

import { Block } from '@domain/entities/lotes/block.entity';
import { Stage } from '@domain/entities/lotes/stage.entity';
import { Project } from '@domain/entities/lotes/project.entity';

import { httpClient } from '@/lib/api/http-client';
import { Lot } from '@/lib/domain/entities/lotes/lot.entity';

export class HttpProjectRepository implements ProjectRepository {
  async getProjects(): Promise<Project[]> {
    try {
      const response = await httpClient<ProjectsResponse[]>('/api/sales/projects/actives');

      return response.map(
        (item) =>
          new Project(
            item.id,
            item.name,
            item.currency,
            item.logo,
            item.logoPublicId,
            item.projectCode,
            item.createdAt
          )
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpStageRepository implements StageRepository {
  async findById(id: string): Promise<Stage[]> {
    try {
      const response = await httpClient<ProjectStagesResponse[]>(`/api/sales/stages/${id}`);

      return response.map((item) => new Stage(item.id, item.name, item.createdAt));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpBlockRepository implements BlockRepository {
  async findById(id: string): Promise<Block[]> {
    try {
      const response = await httpClient<ProjectBlocksResponse[]>(`/api/sales/blocks/${id}`);

      return response.map((item) => new Block(item.id, item.name, item.createdAt));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpLotRepository implements LotRepository {
  async findById(id: string): Promise<Lot[]> {
    try {
      const response = await httpClient<ProjectLotsResponse[]>(
        `/api/sales/lots/${id}?status=Activo`
      );

      return response.map(
        (item) =>
          new Lot(
            item.id,
            item.name,
            item.area,
            item.lotPrice,
            item.urbanizationPrice,
            item.totalPrice,
            item.status,
            item.createdAt
          )
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}
