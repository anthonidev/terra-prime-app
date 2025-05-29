'use server';

import { httpClient } from '@/lib/api/http-client';
import { ProyectsActivesResponse } from '@/types/sales';

export const getProyectsActives = async (): Promise<ProyectsActivesResponse> => {
  try {
    return await httpClient<ProyectsActivesResponse>('/api/sales/projects/actives');
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};
