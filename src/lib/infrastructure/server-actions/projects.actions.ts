// src/lib/infrastructure/server-actions/projects.actions.ts
'use server';

import { Meta } from '@infrastructure/types/pagination.types';
import {
  HttpProjectRepository,
  HttpStageRepository,
  HttpBlockRepository,
  HttpLotRepository
} from '@infrastructure/api/http-projects.repository';
import {
  GetProjectsUseCase,
  GetProjectDetailUseCase,
  GetProjectLotsUseCase,
  ValidateProjectExcelUseCase,
  CreateBulkProjectUseCase,
  UpdateProjectWithImageUseCase,
  CreateStageUseCase,
  UpdateStageUseCase,
  CreateBlockUseCase,
  UpdateBlockUseCase,
  CreateLotUseCase,
  UpdateLotUseCase
} from '@application/use-cases/projects';
import {
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

export async function getProjects(): Promise<{ projects: ProjectList[]; total: number }> {
  const repository = new HttpProjectRepository();
  const useCase = new GetProjectsUseCase(repository);
  return await useCase.execute();
}

export async function getProjectDetail(id: string): Promise<ProjectDetail> {
  const repository = new HttpProjectRepository();
  const useCase = new GetProjectDetailUseCase(repository);
  return await useCase.execute({ id });
}

export async function getProjectLots(
  projectId: string,
  params?: Record<string, unknown>
): Promise<{ items: LotResponse[]; meta: Meta }> {
  const repository = new HttpProjectRepository();
  const useCase = new GetProjectLotsUseCase(repository);
  return await useCase.execute({ projectId, params });
}

export async function validateProjectExcel(formData: FormData): Promise<ExcelValidation> {
  const repository = new HttpProjectRepository();
  const useCase = new ValidateProjectExcelUseCase(repository);
  return await useCase.execute({ file: formData });
}

export async function createBulkProject(formData: FormData): Promise<unknown> {
  const repository = new HttpProjectRepository();
  const useCase = new CreateBulkProjectUseCase(repository);
  return await useCase.execute({ formData });
}

export async function updateProjectWithImage(
  id: string,
  formData: FormData
): Promise<ProjectDetail> {
  const repository = new HttpProjectRepository();
  const useCase = new UpdateProjectWithImageUseCase(repository);
  return await useCase.execute({ id, formData });
}

export async function createStage(data: CreateStageDTO): Promise<StageDetail> {
  const repository = new HttpStageRepository();
  const useCase = new CreateStageUseCase(repository);
  return await useCase.execute(data);
}

export async function updateStage(id: string, data: UpdateStageDTO): Promise<StageDetail> {
  const repository = new HttpStageRepository();
  const useCase = new UpdateStageUseCase(repository);
  return await useCase.execute(id, data);
}

export async function createBlock(data: CreateBlockDTO): Promise<BlockDetail> {
  const repository = new HttpBlockRepository();
  const useCase = new CreateBlockUseCase(repository);
  return await useCase.execute(data);
}

export async function updateBlock(id: string, data: UpdateBlockDTO): Promise<BlockDetail> {
  const repository = new HttpBlockRepository();
  const useCase = new UpdateBlockUseCase(repository);
  return await useCase.execute(id, data);
}

export async function createLot(data: CreateLotDTO): Promise<LotResponse> {
  const repository = new HttpLotRepository();
  const useCase = new CreateLotUseCase(repository);
  return await useCase.execute(data);
}

export async function updateLot(id: string, data: UpdateLotDTO): Promise<LotResponse> {
  const repository = new HttpLotRepository();
  const useCase = new UpdateLotUseCase(repository);
  return await useCase.execute(id, data);
}
