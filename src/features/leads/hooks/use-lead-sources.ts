'use client';

import { useQuery } from '@tanstack/react-query';
import { getLeadSources } from '../lib/queries';
import type { LeadSourcesQueryParams } from '../types';

export function useLeadSources(params: LeadSourcesQueryParams = {}) {
  return useQuery({
    queryKey: ['lead-sources', params],
    queryFn: () => getLeadSources(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
