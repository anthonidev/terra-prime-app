'use client';

import { getLeadsVendor } from '@/lib/actions/sales/leadsVendorActions';
import { LeadsVendorItems } from '@/types/sales';
import { useCallback, useEffect, useState } from 'react';

interface TData {
  data: LeadsVendorItems[];
  isLoading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

export function useLeadsVendor(): TData {
  const [data, setData] = useState<LeadsVendorItems[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await getLeadsVendor();
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
