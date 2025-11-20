'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { assignLeadsToVendor } from '../lib/mutations';

export function useAssignVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignLeadsToVendor,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads', 'day'] });
      toast.success(data.message || 'Leads asignados exitosamente');
    },
    onError: (error: Error) => {
      let message = 'Error al asignar leads';

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }

      toast.error(message);
      console.error('Error assigning leads to vendor:', error);
    },
  });
}
