import type { PaginationMeta, PaginatedResponse } from '@/shared/types/pagination';

export type { PaginationMeta, PaginatedResponse };

export interface Role {
  id: number;
  code: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  document: string;
  firstName: string;
  lastName: string;
  photo: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: Role;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  isActive?: boolean;
  search?: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  document: string;
  firstName: string;
  lastName: string;
  roleId: number;
}

export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId?: number;
  isActive?: boolean;
}
