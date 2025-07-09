import {
  BlockRepository,
  ProjectRepository,
  StageRepository,
  LotRepository,
  LotsProjectRepository
} from '@lib/domain/repositories/lotes.repository';

import { Project } from '@lib/domain/entities/lotes/project.entity';
import { Stage } from '@lib/domain/entities/lotes/stage.entity';
import { Block } from '@lib/domain/entities/lotes/block.entity';
import { Lot } from '@/lib/domain/entities/lotes/lot.entity';

import { GetBlocksDTO, GetLotsDTO, GetStagesDTO } from '@lib/application/dtos/get-lotes.dto';
import { LotProjectResponse } from '@/lib/infrastructure/types/lotes/api-response.types';

export class GetProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(): Promise<Project[]> {
    return this.projectRepository.getProjects();
  }
}

export class GetBlocksUseCase {
  constructor(private readonly blockRepository: BlockRepository) {}

  async execute(dto: GetBlocksDTO): Promise<Block[]> {
    return this.blockRepository.findById(dto.id);
  }
}

export class GetStagesUseCase {
  constructor(private readonly stagesRepository: StageRepository) {}

  async execute(dto: GetStagesDTO): Promise<Stage[]> {
    return this.stagesRepository.findById(dto.id);
  }
}

export class GetLotsUseCase {
  constructor(private readonly lotsRepository: LotRepository) {}

  async execute(dto: GetLotsDTO): Promise<Lot[]> {
    return this.lotsRepository.findById(dto.id);
  }
}

export class GetLotsByProject {
  constructor(private readonly repository: LotsProjectRepository) {}

  async execute(id: string): Promise<LotProjectResponse> {
    return this.repository.findById(id);
  }
}
