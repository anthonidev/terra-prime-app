'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../lib/mutations';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 1,
  });
}
