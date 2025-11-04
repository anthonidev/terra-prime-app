import { apiClient } from '@/shared/lib/api-client';
import type { AdminPin } from '../types';

export async function getActivePin(): Promise<AdminPin> {
  const response = await apiClient.get<AdminPin>('/api/lots/admin-token/active');
  return response.data;
}
