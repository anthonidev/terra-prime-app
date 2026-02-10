'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { adjustInstallmentLateFee } from '../lib/mutations';
import type { AdjustLateFeeInput } from '../types';

export function useAdjustLateFee(saleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ installmentId, data }: { installmentId: string; data: AdjustLateFeeInput }) =>
      adjustInstallmentLateFee(installmentId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sale-detail', saleId] });
      toast.success(data.message || 'Mora ajustada exitosamente');
    },
    onError: (error: Error) => {
      let message = 'Error al ajustar la mora';

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }

      toast.error(message);
    },
  });
}
