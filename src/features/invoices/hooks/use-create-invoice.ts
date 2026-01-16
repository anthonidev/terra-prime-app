'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { createInvoice } from '../lib/mutations';
import type { CreateInvoiceInput, Invoice } from '../types';

interface CreateInvoiceCallbacks {
  onSuccess?: (data: Invoice) => void;
  onError?: (error: Error) => void;
}

export function useCreateInvoice(callbacks?: CreateInvoiceCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceInput) => createInvoice(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['invoice', 'by-payment', String(data.payment?.id)],
      });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Comprobante generado exitosamente');
      callbacks?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      let message = 'Error al generar el comprobante';

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }

      toast.error(message);
      callbacks?.onError?.(error);
    },
  });
}
