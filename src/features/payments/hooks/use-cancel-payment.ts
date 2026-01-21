'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { cancelPayment } from '../lib/mutations';
import { toast } from 'sonner';
import type { CancelPaymentInput } from '../types';

interface CancelPaymentParams {
  id: string;
  data: CancelPaymentInput;
}

export function useCancelPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: CancelPaymentParams) => cancelPayment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success(data.message || 'Pago cancelado exitosamente');
    },
    onError: (error: Error) => {
      let message = 'Error al cancelar el pago';

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }

      toast.error(message);
      console.error('Error cancelling payment:', error);
    },
  });
}
