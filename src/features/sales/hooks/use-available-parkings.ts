'use client';

import { useQuery } from '@tanstack/react-query';
import { getAvailableParkings } from '../lib/queries';
import type { AvailableParkingsQueryParams } from '../types';

export function useAvailableParkings(
  projectId: string,
  params: AvailableParkingsQueryParams = {},
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['available-parkings', projectId, params],
    queryFn: () => getAvailableParkings(projectId, params),
    enabled: !!projectId && enabled,
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
