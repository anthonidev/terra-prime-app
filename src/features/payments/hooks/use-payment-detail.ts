'use client';

import { useQuery } from '@tanstack/react-query';
import { getPaymentDetail } from '../lib/queries';

export function usePaymentDetail(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => getPaymentDetail(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
