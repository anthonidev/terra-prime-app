'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { deleteSale } from '../lib/mutations';
import { toast } from 'sonner';
import type { DeleteSaleInput } from '../types';

interface DeleteSaleParams {
  saleId: string;
  data: DeleteSaleInput;
}

export function useDeleteSale() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ saleId, data }: DeleteSaleParams) => deleteSale(saleId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success(data.message || 'Venta eliminada exitosamente');
      // Redirect to sales list after deletion
      router.push('/ventas');
    },
    onError: (error: Error) => {
      let message = 'Error al eliminar la venta';

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }

      toast.error(message);
      console.error('Error deleting sale:', error);
    },
  });
}
