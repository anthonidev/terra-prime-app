'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerPayment } from '../lib/mutations';
import { toast } from 'sonner';

export function useRegisterPayment(saleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof registerPayment>[1]) => registerPayment(saleId, data),
    onSuccess: () => {
      // Invalidate sale detail query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ['sale-detail', saleId] });
      toast.success('Pago registrado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al registrar el pago');
      console.error('Error registering payment:', error);
    },
  });
}
