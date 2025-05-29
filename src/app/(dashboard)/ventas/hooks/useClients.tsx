import { createClientAndGuarantor, getClients } from '@/lib/actions/sales/clientsActions';
import { Client, ClientGuarantorPayload, ClientGuarantorResponse } from '@/types/sales';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface TUseClients {
  client: Client | null;
  isLoading: boolean;
  searchClient: (documentClient: number) => Promise<void>;
  createClientGuarantor: (payload: ClientGuarantorPayload) => Promise<ClientGuarantorResponse>;
}

export function useClients(): TUseClients {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchClient = useCallback(async (documentClient: number): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getClients(documentClient);
      toast.success('Cliente encontrado correctamente');
      setClient(response);
    } catch (error) {
      toast.error('Cliente no encontrado');
      setClient(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createClientGuarantor = useCallback(
    async (payload: ClientGuarantorPayload): Promise<ClientGuarantorResponse> => {
      try {
        const response = await createClientAndGuarantor(payload);
        toast.success('Cliente y garante creados exitosamente');
        return response;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al crear cliente/garante';
        toast.error(message);
        throw error;
      }
    },
    []
  );

  return {
    client,
    isLoading,
    searchClient: fetchClient,
    createClientGuarantor
  };
}
