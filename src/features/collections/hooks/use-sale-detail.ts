import { useQuery } from '@tanstack/react-query';
import { getSaleDetail } from '../lib/queries';

export function useSaleDetail(saleId: string) {
  return useQuery({
    queryKey: ['sale-detail', saleId],
    queryFn: () => getSaleDetail(saleId),
    enabled: !!saleId,
  });
}
