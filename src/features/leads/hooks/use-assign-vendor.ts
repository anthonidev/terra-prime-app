'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
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
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al asignar leads';
      toast.error(message);
      console.error('Error assigning leads to vendor:', error);
    },
  });
}
