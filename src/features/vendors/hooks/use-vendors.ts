'use client';

import { useQuery } from '@tanstack/react-query';
import { getActiveVendors } from '../lib/queries';

export function useVendors() {
  return useQuery({
    queryKey: ['vendors', 'actives'],
    queryFn: getActiveVendors,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
