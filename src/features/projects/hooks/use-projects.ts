'use client';

import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../lib/queries';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
