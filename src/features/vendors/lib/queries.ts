import { apiClient } from '@/shared/lib/api-client';
import type { VendorsActivesResponse } from '../types';

export async function getActiveVendors(): Promise<VendorsActivesResponse> {
  const response = await apiClient.get('/api/sales/vendors/actives');
  return response.data;
}
