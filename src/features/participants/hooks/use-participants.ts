'use client';

import { useQuery } from '@tanstack/react-query';
import { getParticipants } from '../lib/queries';
import type { ParticipantsQueryParams } from '../types';

export function useParticipants(params: ParticipantsQueryParams = {}) {
  return useQuery({
    queryKey: ['participants', params],
    queryFn: () => getParticipants(params),
    staleTime: 2 * 60 * 1000, // 2 minutos
    // Mantener datos previos mientras se carga nueva página
    placeholderData: (previousData) => previousData,
  });
}
