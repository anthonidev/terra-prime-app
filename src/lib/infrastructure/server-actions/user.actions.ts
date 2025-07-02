'use server';

import {
  CreateUserUseCase,
  GetRolesUseCase,
  GetUsersUseCase,
  UpdateUserUseCase
} from '@application/use-cases/user';
import {
  HttpCreateUserRepository,
  HttpGetRolesRepository,
  HttpGetUsersRepository,
  HttpUpdateUserRepository
} from '@infrastructure/api/user';
import { UsersResponse } from '@infrastructure/types/user';
import { Role, UserList } from '@domain/entities/user';
import { CreateUserDTO, UpdateUserDTO } from '@application/dtos/user';
import { revalidateTag } from 'next/cache';

export const getUsers = async (params?: {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
}): Promise<UsersResponse> => {
  const repository = new HttpGetUsersRepository();
  const useCase = new GetUsersUseCase(repository);

  const users = await useCase.execute(params);

  return {
    items: users.items,
    meta: users.meta
  };
};

export const getRoles = async (): Promise<Role[]> => {
  const repository = new HttpGetRolesRepository();
  const useCase = new GetRolesUseCase(repository);

  const roles = await useCase.execute();

  return roles.map((item) => ({ id: item.id, code: item.code, name: item.name }));
};

export const createUser = async (dto: CreateUserDTO): Promise<UserList> => {
  const repository = new HttpCreateUserRepository();
  const useCase = new CreateUserUseCase(repository);

  const response = await useCase.execute(dto);

  revalidateTag('users');

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
};

export const updateUser = async (id: string, dto: UpdateUserDTO): Promise<UserList> => {
  const repository = new HttpUpdateUserRepository();
  const useCase = new UpdateUserUseCase(repository);

  const response = await useCase.execute(id, dto);

  revalidateTag('users');

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
};
