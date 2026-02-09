'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { updateInstallmentsParkingStatus } from '../lib/mutations';
import type { UpdateParkingStatusInput } from '../types';

export function useUpdateParkingStatus(saleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateParkingStatusInput) => updateInstallmentsParkingStatus(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sale-detail', saleId] });
      toast.success(data.message || 'Estado de cochera actualizado');
    },
    onError: (error: Error) => {
      let message = 'Error al actualizar el estado de cochera';

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }

      toast.error(message);
    },
  });
}
