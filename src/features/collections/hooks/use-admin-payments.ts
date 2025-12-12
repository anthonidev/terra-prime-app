import { useQuery } from '@tanstack/react-query';
import { getAdminPayments } from '../lib/queries';
import type { GetAdminPaymentsParams } from '../types';

export function useAdminPayments(params: GetAdminPaymentsParams) {
  return useQuery({
    queryKey: ['admin-payments', params],
    queryFn: () => getAdminPayments(params),
    staleTime: 2 * 60 * 1000,
  });
}
