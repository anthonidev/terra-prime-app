'use client';

import { ReservationResponse } from '@infrastructure/types/sales/api-response.types';
import { extendReservationPeriod } from '@infrastructure/server-actions/sales.actions';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export function useExtendSeparation(saleId: string) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [reservationResponse, setReservationResponse] = useState<ReservationResponse | null>(null);

  const handleAction = useCallback(
    async (days: number) => {
      try {
        setIsSubmitting(true);
        const response = await extendReservationPeriod(saleId, days);
        setReservationResponse(response);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al extender el periodo de reservación';
        toast.error(errorMessage);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [saleId]
  );

  return {
    isSubmitting,
    handleAction,
    reservationResponse
  };
}
