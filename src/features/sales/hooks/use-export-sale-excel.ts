import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { exportSaleToExcel } from '../lib/queries';

export function useExportSaleExcel() {
  return useMutation({
    mutationFn: (saleId: string) => exportSaleToExcel(saleId),
    onSuccess: (blob, saleId) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `venta-${saleId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Excel descargado correctamente');
    },
    onError: () => {
      toast.error('Error al descargar el Excel');
    },
  });
}
