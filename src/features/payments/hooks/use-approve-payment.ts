'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approvePayment } from '../lib/mutations';
import { toast } from 'sonner';

export function useApprovePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approvePayment,
    onSuccess: (data, paymentId) => {
      queryClient.invalidateQueries({ queryKey: ['payment', paymentId] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success(data.message || 'Pago aprobado exitosamente');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al aprobar el pago';
      toast.error(message);
      console.error('Error approving payment:', error);
    },
  });
}
