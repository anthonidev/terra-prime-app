'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { generateReport } from '../lib/mutations';

export function useGenerateReport(leadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (visitId: string) => generateReport(visitId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lead', leadId] });
      toast.success('Reporte generado correctamente');
      // Optionally open the PDF in a new tab
      if (data.data.documentUrl) {
        window.open(data.data.documentUrl, '_blank');
      }
    },
    onError: (error) => {
      toast.error('Error al generar el reporte');
      console.error('Error generating report:', error);
    },
  });
}
