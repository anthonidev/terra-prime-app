'use client';

import { getVendorsActives } from '@/lib/actions/sales/vendors.action';
import { VendorsActivesItem } from '@/types/sales';
import { useCallback, useEffect, useState } from 'react';

interface TData {
  data: VendorsActivesItem[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useVendors(): TData {
  const [data, setData] = useState<VendorsActivesItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getVendorsActives();
      setData(response);
      console.log(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchData
  };
}
