'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al eliminar la venta';
      toast.error(message);
      console.error('Error deleting sale:', error);
    },
  });
}
