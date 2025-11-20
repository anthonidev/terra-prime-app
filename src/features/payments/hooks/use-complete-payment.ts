'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { completePayment } from '../lib/mutations';
import { toast } from 'sonner';
import type { CompletePaymentInput } from '../types';

interface CompletePaymentParams {
  id: string;
  data: CompletePaymentInput;
}

export function useCompletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: CompletePaymentParams) => completePayment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success(data.message || 'Pago actualizado exitosamente');
    },
    onError: (error: Error) => {
      let message = 'Error al actualizar el pago';

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }

      toast.error(message);
      console.error('Error completing payment:', error);
    },
  });
}
