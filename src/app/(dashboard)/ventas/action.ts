'use server';

import { httpClient } from '@/lib/api/http-client';
import { ProyectsActivesResponse } from '@/types/sales';

const SALES_VENDOR_CACHE_TAG = 'sales-vendor';

export const getSales = async (
  params?: Record<string, unknown>
): Promise<ProyectsActivesResponse> => {
  try {
    return await httpClient<ProyectsActivesResponse>('/api/sales/all/list/vendor', {
      params,
      next: {
        tags: [SALES_VENDOR_CACHE_TAG],
        revalidate: 300
      }
    });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};
