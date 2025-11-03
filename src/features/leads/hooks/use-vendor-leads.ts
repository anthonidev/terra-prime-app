'use client';

import { useQuery } from '@tanstack/react-query';
import { getVendorLeads } from '../lib/queries';

export function useVendorLeads() {
  return useQuery({
    queryKey: ['leads', 'vendor'],
    queryFn: getVendorLeads,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
