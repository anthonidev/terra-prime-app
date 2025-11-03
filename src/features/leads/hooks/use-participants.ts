'use client';

import { useQuery } from '@tanstack/react-query';
import { getParticipants } from '../lib/queries';

export function useParticipants() {
  return useQuery({
    queryKey: ['participants'],
    queryFn: getParticipants,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
