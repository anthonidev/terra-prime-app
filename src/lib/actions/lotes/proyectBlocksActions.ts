'use server';

import { httpClient } from '@/lib/api/http-client';
import { ProyectBlocksDTO, ProyectBlocksResponse } from '@/types/lotes';

export const getProyectBlocks = async (data: ProyectBlocksDTO): Promise<ProyectBlocksResponse> => {
  try {
    return await httpClient<ProyectBlocksResponse>(`/api/sales/blocks/${data.id}`);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};
