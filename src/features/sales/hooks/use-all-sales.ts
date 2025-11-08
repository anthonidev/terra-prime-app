'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllSales } from '../lib/queries';
import type { AdminSalesQueryParams } from '../types';

export function useAllSales(params: AdminSalesQueryParams = {}) {
  return useQuery({
    queryKey: ['all-sales', params],
    queryFn: () => getAllSales(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
