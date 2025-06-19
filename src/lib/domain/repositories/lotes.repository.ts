import { Project } from '@lib/domain/entities/lotes/project.entity';
import { Block } from '@lib/domain/entities/lotes/block.entity';
import { Stage } from '@lib/domain/entities/lotes/stage.entity';
import { Lot } from '@lib/domain/entities/lotes/lot.entity';

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
