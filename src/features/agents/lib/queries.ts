import { apiClient } from '@/shared/lib/api-client';
import type { Vendor } from '../types';

// Get active vendors
export async function getActiveVendors(): Promise<Vendor[]> {
  const response = await apiClient.get<Vendor[]>('/api/sales/vendors/actives');
  return response.data;
}
