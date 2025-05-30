'use server';

import { httpClient } from '@/lib/api/http-client';
import {
  AllVendorsActivesResponse,
  AssignLeadsToVendorDto,
  LeadsByDayItem,
  LeadsByDayResponse
} from '@/types/sales';
import { revalidatePath, revalidateTag } from 'next/cache';

const SALES_LEADS_CACHE_TAG = 'sales-leads';
const VENDORS_ACTIVES_CACHE_TAG = 'vendors-actives';

export async function getLeadsByDay(
  params?: Record<string, unknown> | undefined
): Promise<LeadsByDayResponse> {
  try {
    return await httpClient<LeadsByDayResponse>('/api/sales/leads/day', {
      params: params,
      next: {
        tags: [SALES_LEADS_CACHE_TAG],
        revalidate: 300
      }
    });
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}

export async function assignLeadsToVendor(data: AssignLeadsToVendorDto): Promise<LeadsByDayItem[]> {
  try {
    const result = await httpClient<LeadsByDayItem[]>('/api/sales/leads/assign/vendor', {
      cache: 'no-store',
      method: 'POST',
      body: data
    });
    revalidateTag(SALES_LEADS_CACHE_TAG);
    revalidatePath('/dashboard/sales/bienvenidos');
    return result;
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}

export async function getVendorsActives(): Promise<AllVendorsActivesResponse> {
  try {
    return await httpClient<AllVendorsActivesResponse>('/api/sales/vendors/actives', {
      next: {
        tags: [VENDORS_ACTIVES_CACHE_TAG],
        revalidate: 200
      }
    });
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}
