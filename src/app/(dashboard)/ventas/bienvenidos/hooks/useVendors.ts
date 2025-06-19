'use client';

import { getVendorsActives } from '@infrastructure/server-actions/sales.actions';
import { VendorsActives } from '@domain/entities/sales/leadsvendors.entity';
import { useCallback, useEffect, useState } from 'react';

interface TData {
  data: VendorsActives[];
  isLoading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

export function useVendors(): TData {
  const [data, setData] = useState<VendorsActives[]>([]);
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
