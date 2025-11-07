'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSale } from '../lib/mutations';
import { toast } from 'sonner';

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      // Invalidate sales queries to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success('Venta creada exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear la venta');
      console.error('Error creating sale:', error);
    },
  });
}
