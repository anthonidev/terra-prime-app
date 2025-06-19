import { UsersResponse } from '@infrastructure/types/user';
import {
  CreateUserRepository,
  GetRolesRespository,
  GetUsersRepository,
  UpdateUserRepository
} from '@domain/repositories/user';
import { Role, UserList } from '@domain/entities/user';
import { CreateUserDTO, UpdateUserDTO } from '@application/dtos/user';

export class GetUsersUseCase {
  constructor(private readonly repository: GetUsersRepository) {}

  async execute(params?: {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    order?: 'ASC' | 'DESC';
  }): Promise<UsersResponse> {
    return this.repository.getData(params);
  }
}

export class GetRolesUseCase {
  constructor(private readonly repository: GetRolesRespository) {}

  async execute(): Promise<Role[]> {
    return this.repository.getData();
  }
}

export class CreateUserUseCase {
  constructor(private readonly repository: CreateUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<UserList> {
    return this.repository.createData(dto);
  }
}

export class UpdateUserUseCase {
  constructor(private readonly repository: UpdateUserRepository) {}

  async execute(id: string, dto: UpdateUserDTO): Promise<UserList> {
    return this.repository.updateData(id, dto);
  }
}
