'use client';

import { useQuery } from '@tanstack/react-query';
import { getProjectParkingsForSale } from '../lib/queries';

export function useProjectParkingsForSale(projectId: string) {
  return useQuery({
    queryKey: ['project-parkings-for-sale', projectId],
    queryFn: () => getProjectParkingsForSale(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });
}
