'use client';

import { useQuery } from '@tanstack/react-query';
import { getSaleDetail } from '../lib/queries';

export function useSaleDetail(id: string) {
  return useQuery({
    queryKey: ['sale-detail', id],
    queryFn: () => getSaleDetail(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only fetch if id exists
  });
}
