'use client';

import { useQuery } from '@tanstack/react-query';
import { getPayments } from '../lib/queries';
import type { PaymentsQueryParams } from '../types';

export function usePayments(params: PaymentsQueryParams = {}) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => getPayments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
