'use server';

import { httpClient } from '@/lib/api/http-client';
import {
  ProyectBlocksDTO,
  ProyectBlocksResponse,
  ProyectLotsDTO,
  ProyectLotsResponse,
  ProyectsActivesResponse,
  ProyectStagesDTO,
  ProyectStagesResponse
} from '@/types/sales';

export const getProyectBlocks = async (data: ProyectBlocksDTO): Promise<ProyectBlocksResponse> => {
  try {
    return await httpClient<ProyectBlocksResponse>(`/api/sales/blocks/${data.id}`);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};

export const getProyectLots = async (data: ProyectLotsDTO): Promise<ProyectLotsResponse> => {
  try {
    return await httpClient<ProyectLotsResponse>(`/api/sales/lots/${data.id}`);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};

export const getProyectsActives = async (): Promise<ProyectsActivesResponse> => {
  try {
    return await httpClient<ProyectsActivesResponse>('/api/sales/projects/actives');
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};

export const getProyectStages = async (data: ProyectStagesDTO): Promise<ProyectStagesResponse> => {
  try {
    return await httpClient<ProyectStagesResponse>(`/api/sales/stages/${data.id}`);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};
