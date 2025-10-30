'use client';

import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../lib/queries';
import type { UsersQueryParams } from '../types';

export function useUsers(params: UsersQueryParams = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutos
    // Mantener datos previos mientras se carga nueva página
    placeholderData: (previousData) => previousData,
  });
}
