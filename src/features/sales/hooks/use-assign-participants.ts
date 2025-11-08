'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { assignParticipantsToSale } from '../lib/mutations';
import type { AssignSaleParticipantsInput } from '../types';

export function useAssignParticipants() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      saleId,
      data,
    }: {
      saleId: string;
      data: AssignSaleParticipantsInput;
    }) => assignParticipantsToSale(saleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-sales'] });
      queryClient.invalidateQueries({ queryKey: ['sale-detail'] });
      toast.success('Participantes asignados exitosamente');
    },
    onError: (error) => {
      toast.error('Error al asignar participantes');
      console.error('Error assigning participants:', error);
    },
  });
}
