'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectPayment } from '../lib/mutations';
import { toast } from 'sonner';

export function useRejectPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectPayment,
    onSuccess: (data, paymentId) => {
      queryClient.invalidateQueries({ queryKey: ['payment', paymentId] });
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
