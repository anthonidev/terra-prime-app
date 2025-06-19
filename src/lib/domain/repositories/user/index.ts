import { UsersResponse } from '@infrastructure/types/user';
import { Role, UserList } from '@domain/entities/user';
import { CreateUserDTO, UpdateUserDTO } from '@/lib/application/dtos/user';

export interface GetUsersRepository {
  getData(params?: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    order?: 'ASC' | 'DESC';
  }): Promise<UsersResponse>;
}

export interface GetRolesRespository {
  getData(): Promise<Role[]>;
}

export interface CreateUserRepository {
  createData(dto: CreateUserDTO): Promise<UserList>;
}

export interface UpdateUserRepository {
  updateData(id: string, dto: UpdateUserDTO): Promise<UserList>;
}
