'use client';

import { useQuery } from '@tanstack/react-query';
import { getActiveParticipants } from '../lib/queries';

export function useActiveParticipants() {
  return useQuery({
    queryKey: ['active-participants'],
    queryFn: getActiveParticipants,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
