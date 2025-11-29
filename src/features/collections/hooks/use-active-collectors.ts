import { useQuery } from '@tanstack/react-query';
import { getActiveCollectors } from '../lib/queries';

export function useActiveCollectors() {
  return useQuery({
    queryKey: ['active-collectors'],
    queryFn: getActiveCollectors,
  });
}
