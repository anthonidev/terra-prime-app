'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectPayment } from '../lib/mutations';
import { toast } from 'sonner';
import type { RejectPaymentInput } from '../types';

interface RejectPaymentParams {
  id: string;
  data: RejectPaymentInput;
}

export function useRejectPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: RejectPaymentParams) => rejectPayment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success(data.message || 'Pago rechazado exitosamente');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al rechazar el pago';
      toast.error(message);
      console.error('Error rejecting payment:', error);
    },
  });
}
