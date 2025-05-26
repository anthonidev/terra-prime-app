import { getProyectsActives } from '@/lib/actions/sales/proyectsActivesActions';
import { ProyectsActivesItems } from '@/types/sales';
import { useCallback, useEffect, useState } from 'react';

interface TLotes {
  data: ProyectsActivesItems[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useProyectsActives(): TLotes {
  const [data, setData] = useState<ProyectsActivesItems[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getProyectsActives();
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
