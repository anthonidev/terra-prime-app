'use server';

import { httpClient } from '@/lib/api/http-client';
import { AllVendorsActivesResponse } from '@/types/sales';

export async function getVendorsActives(): Promise<AllVendorsActivesResponse> {
  try {
    return await httpClient<AllVendorsActivesResponse>('/api/sales/vendors/actives');
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}
