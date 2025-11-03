'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { regenerateReport } from '../lib/mutations';

export function useRegenerateReport(leadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (visitId: string) => regenerateReport(visitId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
      toast.success('Reporte regenerado correctamente');
      // Optionally open the PDF in a new tab
      if (data.data.documentUrl) {
        window.open(data.data.documentUrl, '_blank');
      }
    },
    onError: (error) => {
      toast.error('Error al regenerar el reporte');
      console.error('Error regenerating report:', error);
    },
  });
}
