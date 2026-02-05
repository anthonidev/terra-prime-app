'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { registerPayment } from '../lib/mutations';

export function useRegisterPayment(saleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof registerPayment>[1]) => registerPayment(saleId, data),
    onSuccess: () => {
      // Invalidate sale detail query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ['sale-detail', saleId] });
      toast.success('Pago registrado exitosamente');
    },
    onError: (error: Error) => {
      let message = 'Error al registrar el pago';

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }

      toast.error(message);
      console.error('Error registering payment:', error);
    },
  });
}
