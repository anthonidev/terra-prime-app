'use client';

import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '../lib/queries';
import type { InvoicesQueryParams } from '../types';

export function useInvoices(params?: InvoicesQueryParams) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => getInvoices(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
