'use client';

import { useQuery } from '@tanstack/react-query';
import { getBlockLots } from '../lib/queries';
import { SALES_QUERY_KEYS } from '../constants';

export function useBlockLots(blockId: string) {
  return useQuery({
    queryKey: SALES_QUERY_KEYS.projectLots(blockId),
    queryFn: () => getBlockLots(blockId),
    enabled: !!blockId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
