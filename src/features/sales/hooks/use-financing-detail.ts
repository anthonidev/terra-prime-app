'use client';

import { useQuery } from '@tanstack/react-query';
import { getFinancingDetail } from '../lib/queries';

export function useFinancingDetail(saleId: string, financingId: string) {
  return useQuery({
    queryKey: ['financing-detail', saleId, financingId],
    queryFn: () => getFinancingDetail(saleId, financingId),
    staleTime: 5 * 60 * 1000,
    enabled: !!saleId && !!financingId,
  });
}
