import { apiClient } from '@/shared/lib/api-client';
import type { User, CreateUserInput, UpdateUserInput } from '../types';

export async function createUser(data: CreateUserInput): Promise<User> {
  const response = await apiClient.post<User>('/api/users', data);
  return response.data;
}

export async function updateUser(
  id: string,
  data: UpdateUserInput
): Promise<User> {
  const response = await apiClient.patch<User>(`/api/users/${id}`, data);
  return response.data;
}
