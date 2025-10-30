'use client';

import { useQuery } from '@tanstack/react-query';
import { getRoles } from '../lib/queries';

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    staleTime: 10 * 60 * 1000, // 10 minutos - los roles no cambian frecuentemente
  });
}
