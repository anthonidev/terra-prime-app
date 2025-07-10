'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export function useExtendSeparation(saleId: string) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // const [approveResponse, setApproveResponse] = useState<PaymentApproveRejectResponse | null>(null);

  const handleAction = useCallback(async (days: number) => {
    try {
      setIsSubmitting(true);

      // const response = await approvePaymentDetail(Number(saleId), approvalData!);

      // setApproveResponse(response);

      // return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aprobar el pago';
      toast.error(errorMessage);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    handleAction
  };
}
