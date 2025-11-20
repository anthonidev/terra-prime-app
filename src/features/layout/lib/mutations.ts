import { apiClient } from '@/shared/lib/api-client';
import { UserMenuResponse } from '../types/menu.types';

export async function getUserMenu(): Promise<UserMenuResponse> {
  const response = await apiClient.get<UserMenuResponse>('/api/users/menu');
  return response.data;
}
