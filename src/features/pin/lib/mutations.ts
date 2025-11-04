import { apiClient } from '@/shared/lib/api-client';
import type { CreatePinResponse } from '../types';

export async function createPin(): Promise<CreatePinResponse> {
  const response = await apiClient.post<CreatePinResponse>('/api/lots/admin-token/create');
  return response.data;
}
