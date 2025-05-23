'use server';
import { httpClient } from '@/lib/api/http-client';
import { Role } from '@/types/user';

export async function getRoles(): Promise<Role[]> {
  try {
    return await httpClient<Role[]>('/api/users/roles');
  } catch (error) {
    console.error('Error al obtener roles:', error);
    throw error;
  }
}
