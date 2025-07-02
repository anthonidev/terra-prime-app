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

export class GetProjectsUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(): Promise<{ projects: ProjectList[]; total: number }> {
    return this.repository.getProjects();
  }
}

export class GetProjectDetailUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(dto: GetProjectDetailDTO): Promise<ProjectDetail> {
    return this.repository.getProjectDetail(dto);
  }
}

export class GetProjectLotsUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(dto: GetProjectLotsDTO): Promise<{ items: LotResponse[]; meta: Meta }> {
    return this.repository.getProjectLots(dto);
  }
}

export class ValidateProjectExcelUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(dto: ValidateProjectExcelDTO): Promise<ExcelValidation> {
    return this.repository.validateExcel(dto);
  }
}

export class CreateBulkProjectUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(dto: CreateBulkProjectDTO): Promise<unknown> {
    return this.repository.createBulk(dto);
  }
}

export class UpdateProjectWithImageUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(dto: UpdateProjectWithImageDTO): Promise<ProjectDetail> {
    return this.repository.updateWithImage(dto);
  }
}

export class CreateStageUseCase {
  constructor(private readonly repository: StageRepository) {}

  async execute(dto: CreateStageDTO): Promise<StageDetail> {
    return this.repository.create(dto);
  }
}

export class UpdateStageUseCase {
  constructor(private readonly repository: StageRepository) {}

  async execute(id: string, dto: UpdateStageDTO): Promise<StageDetail> {
    return this.repository.update(id, dto);
  }
}

export class CreateBlockUseCase {
  constructor(private readonly repository: BlockRepository) {}

  async execute(dto: CreateBlockDTO): Promise<BlockDetail> {
    return this.repository.create(dto);
  }
}

export class UpdateBlockUseCase {
  constructor(private readonly repository: BlockRepository) {}

  async execute(id: string, dto: UpdateBlockDTO): Promise<BlockDetail> {
    return this.repository.update(id, dto);
  }
}

export class CreateLotUseCase {
  constructor(private readonly repository: LotRepository) {}

  async execute(dto: CreateLotDTO): Promise<LotResponse> {
    return this.repository.create(dto);
  }
}

export class UpdateLotUseCase {
  constructor(private readonly repository: LotRepository) {}

  async execute(id: string, dto: UpdateLotDTO): Promise<LotResponse> {
    return this.repository.update(id, dto);
  }
}
