'use server';

import {
  GetBlocksUseCase,
  GetLotsByProject,
  GetLotsUseCase,
  GetProjectsUseCase,
  GetStagesUseCase
} from '@application/use-cases/get-lotes.usecase';

import {
  HttpProjectRepository,
  HttpBlockRepository,
  HttpStageRepository,
  HttpLotRepository,
  HttpLotProjectRepository
} from '@infrastructure/api/http-lotes.repository';

import {
  ProjectsResponse,
  ProjectBlocksResponse,
  ProjectStagesResponse,
  ProjectLotsResponse,
  LotProjectResponse
} from '@infrastructure/types/lotes/api-response.types';

import { GetBlocksDTO, GetLotsDTO, GetStagesDTO } from '@application/dtos/get-lotes.dto';

/**
 * Obtiene todos los proyectos activos
 * @params none
 * @returns ProjectsResponse
 */
export const getProjectActives = async (): Promise<ProjectsResponse[]> => {
  const repository = new HttpProjectRepository();
  const useCase = new GetProjectsUseCase(repository);

  const projects = await useCase.execute();

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    currency: project.currency,
    logo: project.logo,
    logoPublicId: project.logoPublicId,
    projectCode: project.projectCode,
    createdAt: project.createdAt
  }));
};

/**
 * Obtiene las etapas
 * @param data
 * @returns ProjectStagesResponse
 */
export const getProyectStages = async (data: GetStagesDTO): Promise<ProjectStagesResponse[]> => {
  const repository = new HttpStageRepository();
  const useCase = new GetStagesUseCase(repository);

  const stages = await useCase.execute(data);

  return stages.map((stage) => ({
    id: stage.id,
    name: stage.name,
    createdAt: stage.createdAt
  }));
};

/**
 * Obtiene las manzanas
 * @param data
 * @returns ProjectBlocksResponse
 */
export const getProyectBlocks = async (data: GetBlocksDTO): Promise<ProjectBlocksResponse[]> => {
  const repository = new HttpBlockRepository();
  const useCase = new GetBlocksUseCase(repository);

  const blocks = await useCase.execute(data);

  return blocks.map((block) => ({
    id: block.id,
    name: block.name,
    createdAt: block.createdAt
  }));
};

/**
 * Obtiene los lotes
 * @param data
 * @returns ProjectLotsResponse
 */
export const getProyectLots = async (data: GetLotsDTO): Promise<ProjectLotsResponse[]> => {
  const repository = new HttpLotRepository();
  const useCase = new GetLotsUseCase(repository);

  const lots = await useCase.execute(data);

  return lots.map((lot) => ({
    id: lot.id,
    name: lot.name,
    area: lot.area,
    lotPrice: lot.lotPrice,
    urbanizationPrice: lot.urbanizationPrice,
    totalPrice: lot.totalPrice,
    status: lot.status,
    createdAt: lot.createdAt
  }));
};

export const getLotsProject = async (id: string): Promise<LotProjectResponse> => {
  const repository = new HttpLotProjectRepository();
  const useCase = new GetLotsByProject(repository);

  const lots = await useCase.execute(id);

  return {
    items: lots.items,
    meta: lots.meta
  };
};
