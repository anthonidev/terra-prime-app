'use server';
import { CreateUserDto, UsersResponse, UpdateUserDto, UserList } from '@/types/user';
import { httpClient } from '@/lib/api/http-client';

export async function createUser(data: CreateUserDto): Promise<UserList> {
  try {
    return await httpClient<UserList>('/api/users', {
      method: 'POST',
      body: data
    });
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}

export async function updateUser(id: string, data: UpdateUserDto): Promise<UserList> {
  try {
    return await httpClient<UserList>(`/api/users/${id}`, {
      method: 'PATCH',
      body: data
    });
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}

export async function getUsers(
  params?: Record<string, unknown> | undefined
): Promise<UsersResponse> {
  return httpClient<UsersResponse>('/api/users', {
    params
  });
}
