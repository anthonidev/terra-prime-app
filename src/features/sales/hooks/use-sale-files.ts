import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getSaleFiles } from '../lib/queries';
import { uploadSaleFile, deleteSaleFile } from '../lib/mutations';

export function useSaleFiles(saleId: string) {
  return useQuery({
    queryKey: ['sale-files', saleId],
    queryFn: () => getSaleFiles(saleId),
    enabled: !!saleId,
  });
}

export function useUploadSaleFile(saleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, description }: { file: File; description: string }) =>
      uploadSaleFile(saleId, file, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sale-files', saleId] });
      toast.success('Archivo subido correctamente');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Error al subir el archivo');
    },
  });
}

export function useDeleteSaleFile(saleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => deleteSaleFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sale-files', saleId] });
      toast.success('Archivo eliminado correctamente');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Error al eliminar el archivo');
    },
  });
}
