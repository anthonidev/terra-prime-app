import { Project } from '@domain/entities/lotes/project.entity';
import { Block } from '@domain/entities/lotes/block.entity';
import { Stage } from '@domain/entities/lotes/stage.entity';
import { Lot } from '@domain/entities/lotes/lot.entity';
import { LotProjectResponse } from '@infrastructure/types/lotes/api-response.types';

export interface ProjectRepository {
  getProjects(): Promise<Project[]>;
}

export interface StageRepository {
  findById(id: string): Promise<Stage[]>;
}

export interface BlockRepository {
  findById(id: string): Promise<Block[]>;
}

export interface LotRepository {
  findById(id: string): Promise<Lot[]>;
}

export interface LotsProjectRepository {
  findById(
    id: string,
    params?: {
      order?: string;
      page?: number;
      limit?: number;
      stageId?: string;
      blockId?: string;
      term?: string;
    }
  ): Promise<LotProjectResponse>;
}
