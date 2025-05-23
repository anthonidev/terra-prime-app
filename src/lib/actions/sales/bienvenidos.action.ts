'use server';

import { httpClient } from '@/lib/api/http-client';
import { AssignLeadsToVendorDto, LeadsByDayItem, LeadsByDayResponse } from '@/types/sales';

export async function getLeadsByDay(
  params?: Record<string, unknown> | undefined
): Promise<LeadsByDayResponse> {
  try {
    return await httpClient<LeadsByDayResponse>('/api/sales/leads-day', {
      params: params
    });
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}

export async function assignLeadsToVendor(data: AssignLeadsToVendorDto): Promise<LeadsByDayItem[]> {
  try {
    return await httpClient<LeadsByDayItem[]>('/api/sales/assign-leads-to-vendor', {
      method: 'POST',
      body: data
    });
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}
