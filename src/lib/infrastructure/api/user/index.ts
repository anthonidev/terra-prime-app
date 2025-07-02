import { httpClient } from '@/lib/api/http-client';
import { CreateUserDTO, UpdateUserDTO } from '@/lib/application/dtos/user';
import { Role, UserList } from '@/lib/domain/entities/user';
import {
  CreateUserRepository,
  GetRolesRespository,
  GetUsersRepository,
  UpdateUserRepository
} from '@domain/repositories/user';
import { UsersResponse } from '@infrastructure/types/user';

export class HttpGetUsersRepository implements GetUsersRepository {
  async getData(params?: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    order?: 'ASC' | 'DESC';
  }): Promise<UsersResponse> {
    try {
      const response = await httpClient<UsersResponse>('/api/users', {
        params,
        next: {
          tags: ['users'],
          revalidate: 0
        }
      });

      return {
        items: response.items,
        meta: response.meta
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpGetRolesRepository implements GetRolesRespository {
  async getData(): Promise<Role[]> {
    try {
      const response = await httpClient<Role[]>('/api/users/roles', {
        next: {
          tags: ['roles'],
          revalidate: 60 * 60
        }
      });
      return response.map((item) => ({ id: item.id, code: item.code, name: item.name }));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpCreateUserRepository implements CreateUserRepository {
  async createData(dto: CreateUserDTO): Promise<UserList> {
    try {
      const response = await httpClient<UserList>('/api/users', {
        method: 'POST',
        body: dto
      });

      return {
        id: response.id,
        email: response.email,
        document: response.document,
        firstName: response.firstName,
        lastName: response.lastName,
        photo: response.photo,
        isActive: response.isActive,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        role: response.role
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpUpdateUserRepository implements UpdateUserRepository {
  async updateData(id: string, dto: UpdateUserDTO): Promise<UserList> {
    try {
      const response = await httpClient<UserList>(`/api/users/${id}`, {
        method: 'PATCH',
        body: dto
      });

      return {
        id: response.id,
        email: response.email,
        document: response.document,
        firstName: response.firstName,
        lastName: response.lastName,
        photo: response.photo,
        isActive: response.isActive,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        role: response.role
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}
