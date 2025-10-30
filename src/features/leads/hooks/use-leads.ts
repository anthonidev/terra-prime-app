'use client';

import { useQuery } from '@tanstack/react-query';
import { getLeads } from '../lib/queries';
import type { LeadsQueryParams } from '../types';

export function useLeads(params: LeadsQueryParams = {}) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => getLeads(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
