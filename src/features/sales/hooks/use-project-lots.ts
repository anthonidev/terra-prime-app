'use client';

import { useQuery } from '@tanstack/react-query';
import { getProjectLots } from '../lib/queries';
import type { LotsQueryParams } from '../types';

export function useProjectLots(projectId: string, params: LotsQueryParams = {}) {
  return useQuery({
    queryKey: ['project-lots', projectId, params],
    queryFn: () => getProjectLots(projectId, params),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
