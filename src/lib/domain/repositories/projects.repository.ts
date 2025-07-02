import { Meta } from '@infrastructure/types/pagination.types';
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

export interface ProjectRepository {
  getProjects(): Promise<{ projects: ProjectList[]; total: number }>;
  getProjectDetail(dto: GetProjectDetailDTO): Promise<ProjectDetail>;
  getProjectLots(dto: GetProjectLotsDTO): Promise<{ items: LotResponse[]; meta: Meta }>;
  validateExcel(dto: ValidateProjectExcelDTO): Promise<ExcelValidation>;
  createBulk(dto: CreateBulkProjectDTO): Promise<unknown>;
  updateWithImage(dto: UpdateProjectWithImageDTO): Promise<ProjectDetail>;
}

export interface StageRepository {
  create(dto: CreateStageDTO): Promise<StageDetail>;
  update(id: string, dto: UpdateStageDTO): Promise<StageDetail>;
}

export interface BlockRepository {
  create(dto: CreateBlockDTO): Promise<BlockDetail>;
  update(id: string, dto: UpdateBlockDTO): Promise<BlockDetail>;
}

export interface LotRepository {
  create(dto: CreateLotDTO): Promise<LotResponse>;
  update(id: string, dto: UpdateLotDTO): Promise<LotResponse>;
}
