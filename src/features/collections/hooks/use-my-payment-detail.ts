import { useQuery } from '@tanstack/react-query';
import { getMyPaymentDetail } from '../lib/queries';

export function useMyPaymentDetail(paymentId: string) {
  return useQuery({
    queryKey: ['my-payment-detail', paymentId],
    queryFn: () => getMyPaymentDetail(paymentId),
    staleTime: 2 * 60 * 1000,
  });
}
