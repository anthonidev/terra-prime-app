import { useQuery } from '@tanstack/react-query';
import { getMyPayments } from '../lib/queries';
import type { GetMyPaymentsParams } from '../types';

export function useMyPayments(params: GetMyPaymentsParams) {
  return useQuery({
    queryKey: ['my-payments', params],
    queryFn: () => getMyPayments(params),
    staleTime: 2 * 60 * 1000,
  });
}
