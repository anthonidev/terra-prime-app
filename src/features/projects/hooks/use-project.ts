'use client';

import { useQuery } from '@tanstack/react-query';
import { getProject } from '../lib/queries';

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}
