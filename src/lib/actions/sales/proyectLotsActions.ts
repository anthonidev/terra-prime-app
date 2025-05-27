'use server';

import { httpClient } from '@/lib/api/http-client';
import { ProyectLotsDTO, ProyectLotsResponse } from '@/types/sales';

export const getProyectLots = async (data: ProyectLotsDTO): Promise<ProyectLotsResponse> => {
  try {
    return await httpClient<ProyectLotsResponse>(`/api/sales/lots/${data.id}`);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};
