import { getProyectsActives } from '@/lib/actions/sales/proyectsActivesActions';
import { ProyectsActivesItems } from '@/types/sales';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TLotes {
  data: ProyectsActivesItems[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useProyectsActives(): TLotes {
  const [data, setData] = useState<ProyectsActivesItems[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getProyectsActives();
      setData(response);
      console.log(response);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
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
    refresh: fetchData
  };
}
