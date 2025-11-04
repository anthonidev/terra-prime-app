'use client';

import { useQuery } from '@tanstack/react-query';
import { getActivePin } from '../lib/queries';

export function useActivePin() {
  return useQuery({
    queryKey: ['active-pin'],
    queryFn: getActivePin,
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 60 * 1000, // Refetch cada minuto para mantener actualizado el estado
  });
}
