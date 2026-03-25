'use client';

import { useQuery } from '@tanstack/react-query';
import { getParkings } from '../lib/queries';
import type { ParkingsQueryParams } from '../types';

export function useParkings(params: ParkingsQueryParams = {}, enabled: boolean = true) {
  return useQuery({
    queryKey: ['parkings', params],
    queryFn: () => getParkings(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    enabled,
  });
}
