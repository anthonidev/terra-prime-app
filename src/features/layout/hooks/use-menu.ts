'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserMenu } from '../lib/mutations';

export function useMenu() {
  return useQuery({
    queryKey: ['user-menu'],
    queryFn: getUserMenu,
    staleTime: 5 * 60 * 1000, // 5 minutos - TanStack Query maneja el caché automáticamente
    retry: 1,
  });
}
