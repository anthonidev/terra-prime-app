'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approvePayment } from '../lib/mutations';
import { toast } from 'sonner';
import type { ApprovePaymentInput } from '../types';

interface ApprovePaymentParams {
  id: string;
  data: ApprovePaymentInput;
}

export function useApprovePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: ApprovePaymentParams) => approvePayment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payment', variables.id] });
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
