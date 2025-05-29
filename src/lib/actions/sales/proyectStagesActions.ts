'use server';

import { httpClient } from '@/lib/api/http-client';
import { ProyectStagesDTO, ProyectStagesResponse } from '@/types/sales';

export const getProyectStages = async (data: ProyectStagesDTO): Promise<ProyectStagesResponse> => {
  try {
    return await httpClient<ProyectStagesResponse>(`/api/sales/stages/${data.id}`);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};
