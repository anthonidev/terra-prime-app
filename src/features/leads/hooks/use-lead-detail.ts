'use client';

import { useQuery } from '@tanstack/react-query';
import { getLeadDetail } from '../lib/queries';

export function useLeadDetail(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLeadDetail(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
}
