'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
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
    onError: (error: Error) => {
      let message = 'Error al rechazar el pago';

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }

      toast.error(message);
      console.error('Error rejecting payment:', error);
    },
  });
}
