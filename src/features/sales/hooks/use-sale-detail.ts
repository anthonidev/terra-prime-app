'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSaleDetail } from '../lib/queries';
import { useEffect } from 'react';
import type { SaleDetail } from '../types';

export function useSaleDetail(id: string) {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ['sale-detail', id],
    queryFn: async () => {
      const data = await getSaleDetail(id);

      // Validate that we have essential data
      if (!data || !data.lot || !data.client) {
        console.error('⚠️ BACKEND ERROR: API returned incomplete data:', {
          hasData: !!data,
          hasLot: !!data?.lot,
          hasClient: !!data?.client,
        });
        throw new Error('Incomplete data received from API - missing lot or client');
      }

      return data;
    },
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    enabled: !!id, // Only fetch if id exists
    // Smart placeholder: only use previous data if it's valid
    placeholderData: (previousData) => {
      if (previousData && previousData.lot && previousData.client) {
        return previousData as SaleDetail;
      }
      return undefined;
    },
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 2, // Retry twice if data is invalid
    retryDelay: 1000, // Wait 1 second between retries
  });

  // Validate data even when coming from cache
  useEffect(() => {
    if (result.data && (!result.data.lot || !result.data.client) && !result.isFetching) {
      console.warn('🔄 Detected corrupted cache data, auto-refreshing...');
      queryClient.invalidateQueries({ queryKey: ['sale-detail', id] });
    }
  }, [result.data, result.isFetching, id, queryClient]);

  return result;
}
