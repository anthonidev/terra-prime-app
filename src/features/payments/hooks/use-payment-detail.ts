'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPaymentDetail } from '../lib/queries';
import { updateVoucherCodeOperation } from '../lib/mutations';
import { toast } from 'sonner';

export function usePaymentDetail(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => getPaymentDetail(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateVoucherCodeOperation(paymentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, codeOperation }: { id: number; codeOperation: string }) =>
      updateVoucherCodeOperation(id, { codeOperation }),
    onSuccess: () => {
      toast.success('Código de operación actualizado');
      queryClient.invalidateQueries({ queryKey: ['payment', paymentId] });
    },
    onError: (error) => {
      toast.error('Error al actualizar el código de operación');
      console.error(error);
    },
  });
}
