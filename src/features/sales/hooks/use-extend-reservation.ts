'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { extendReservation } from '../lib/mutations';
import { toast } from 'sonner';
import type { ExtendReservationInput } from '../types';

interface ExtendReservationParams {
  saleId: string;
  data: ExtendReservationInput;
}

export function useExtendReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ saleId, data }: ExtendReservationParams) => extendReservation(saleId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sale', variables.saleId] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast.success(data.message || 'Reserva extendida exitosamente');
    },
    onError: (error: Error) => {
      let message = 'Error al extender la reserva';

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as { message?: string };
        message = data.message || message;
      }

      toast.error(message);
      console.error('Error extending reservation:', error);
    },
  });
}
