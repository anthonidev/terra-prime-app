'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PaymentDetailItem } from '@domain/entities/sales/payment.entity';
import { getPaymentByCollector } from '@infrastructure/server-actions/cobranza.actions';

export function usePagoDetail(paymentId: number) {
  const [payment, setPayment] = useState<PaymentDetailItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPagoDetail = useCallback(async () => {
    try {
      setIsLoading(true);

      const paymentData = await getPaymentByCollector(paymentId);
      setPayment(paymentData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al cargar los detalles del pago';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [paymentId]);

  useEffect(() => {
    fetchPagoDetail();
  }, [fetchPagoDetail]);

  return {
    payment,
    isLoading
  };
}
