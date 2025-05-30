'use client';

import { getVendorsActives } from '@/lib/actions/sales/vendorsAction';
import { VendorsActivesItem } from '@/types/sales';
import { useCallback, useEffect, useState } from 'react';

interface TData {
  data: VendorsActivesItem[];
  isLoading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

export function useVendors(): TData {
  const [data, setData] = useState<VendorsActivesItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await getVendorsActives();
      setData(response);
      console.log(response);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
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
