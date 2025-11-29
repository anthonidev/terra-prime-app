import { useQuery } from '@tanstack/react-query';
import { getCollectorStatistics } from '../lib/queries';
import type { GetCollectorStatisticsParams } from '../types';

export function useCollectorStatistics(params: GetCollectorStatisticsParams = {}) {
  return useQuery({
    queryKey: ['collector-statistics', params],
    queryFn: () => getCollectorStatistics(params),
    placeholderData: (previousData) => previousData,
  });
}
