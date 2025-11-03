'use client';

import { useQuery } from '@tanstack/react-query';
import { getDayLeads } from '../lib/queries';

export function useDayLeads(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['leads', 'day', page, limit],
    queryFn: () => getDayLeads({ page, limit }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
