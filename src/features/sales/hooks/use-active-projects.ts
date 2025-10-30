'use client';

import { useQuery } from '@tanstack/react-query';
import { getActiveProjects } from '../lib/queries';

export function useActiveProjects() {
  return useQuery({
    queryKey: ['active-projects'],
    queryFn: getActiveProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
