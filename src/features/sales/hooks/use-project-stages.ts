'use client';

import { useQuery } from '@tanstack/react-query';
import { getProjectStages } from '../lib/queries';

export function useProjectStages(projectId: string) {
  return useQuery({
    queryKey: ['project-stages', projectId],
    queryFn: () => getProjectStages(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
