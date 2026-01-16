'use client';

import { useQuery } from '@tanstack/react-query';
import { getInvoiceByPaymentId } from '../lib/queries';

export function useInvoiceByPayment(paymentId: string) {
  return useQuery({
    queryKey: ['invoice', 'by-payment', paymentId],
    queryFn: () => getInvoiceByPaymentId(paymentId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!paymentId,
  });
}
