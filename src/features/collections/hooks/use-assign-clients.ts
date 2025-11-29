import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignClientsToCollector } from '../lib/mutations';
import { toast } from 'sonner';

export function useAssignClients() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignClientsToCollector,
    onSuccess: () => {
      toast.success('Clientes asignados correctamente');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: () => {
      toast.error('Error al asignar clientes');
    },
  });
}
