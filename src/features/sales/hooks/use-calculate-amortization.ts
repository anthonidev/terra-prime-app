'use client';

import { useMutation } from '@tanstack/react-query';
import { calculateAmortization } from '../lib/mutations';
import { toast } from 'sonner';

export function useCalculateAmortization() {
  return useMutation({
    mutationFn: calculateAmortization,
    onError: (error) => {
      toast.error('Error al calcular la tabla de amortización');
      console.error('Error calculating amortization:', error);
    },
  });
}
