import { useQuery } from '@tanstack/react-query';
import { getClientSales } from '../lib/queries';

export function useClientSales(clientId: string) {
  return useQuery({
    queryKey: ['client-sales', clientId],
    queryFn: () => getClientSales(clientId),
    enabled: !!clientId,
  });
}
