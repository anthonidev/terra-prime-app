'use client';

import { useQuery } from '@tanstack/react-query';
import { getActiveVendors } from '../lib/queries';

export function useActiveVendors() {
  return useQuery({
    queryKey: ['active-vendors'],
    queryFn: getActiveVendors,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
