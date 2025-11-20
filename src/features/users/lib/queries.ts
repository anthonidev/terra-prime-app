import { apiClient } from '@/shared/lib/api-client';
import type { Role, User, PaginatedResponse, UsersQueryParams } from '../types';

export async function getRoles(): Promise<Role[]> {
  const response = await apiClient.get<Role[]>('/api/users/roles');
  return response.data;
}

export async function getUsers(params: UsersQueryParams = {}): Promise<PaginatedResponse<User>> {
  const response = await apiClient.get<PaginatedResponse<User>>('/api/users', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      order: params.order ?? 'ASC',
      ...(params.isActive !== undefined && { isActive: params.isActive }),
      ...(params.search && { search: params.search }),
    },
  });
  return response.data;
}
