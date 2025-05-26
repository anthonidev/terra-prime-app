'use server';

import { httpClient } from '@/lib/api/http-client';
import { LeadsVendorResponse } from '@/types/sales';

export async function getLeadsVendor(): Promise<LeadsVendorResponse> {
  try {
    return await httpClient<LeadsVendorResponse>('/api/sales/leads-vendor');
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}
