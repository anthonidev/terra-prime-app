'use server';

import { CreateUserDto, UsersResponse, UpdateUserDto, UserList } from '@/types/user';
import { revalidatePath, revalidateTag } from 'next/cache';
import { httpClient } from '@/lib/api/http-client';
import { Role } from '@/types/user';

const CACHE_TTL = 300;
const CACHE_TAG = 'users';

export async function getUsers(
  params?: Record<string, unknown> | undefined
): Promise<UsersResponse> {
  return httpClient<UsersResponse>('/api/users', {
    params,
    next: {
      tags: [CACHE_TAG],
      revalidate: CACHE_TTL
    }
  });
}

export async function getRoles(): Promise<Role[]> {
  try {
    return await httpClient<Role[]>('/api/users/roles', {
      next: {
        revalidate: CACHE_TTL * 2
      }
    });
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}

export async function createUser(data: CreateUserDto): Promise<UserList> {
  try {
    const response = await httpClient<UserList>('/api/users', {
      cache: 'no-store',
      method: 'POST',
      body: data
    });

    revalidateTag(CACHE_TAG);
    revalidatePath('/usuarios');

    return response;
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}

export async function updateUser(id: string, data: UpdateUserDto): Promise<UserList> {
  try {
    const response = await httpClient<UserList>(`/api/users/${id}`, {
      cache: 'no-store',
      method: 'PATCH',
      body: data
    });

    revalidateTag(CACHE_TAG);
    revalidatePath('/usuarios');

    return response;
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}
