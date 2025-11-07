'use client';

import { useQuery } from '@tanstack/react-query';
import { getMySales } from '../lib/queries';
import type { MySalesQueryParams } from '../types';

export function useMySales(params: MySalesQueryParams = {}) {
  return useQuery({
    queryKey: ['my-sales', params],
    queryFn: () => getMySales(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
