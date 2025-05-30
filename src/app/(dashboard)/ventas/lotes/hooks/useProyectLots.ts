import { getProyectLots } from '@/lib/actions/sales/proyectLotsActions';
import { ProyectLotsItems } from '@/types/sales';
import { useCallback, useEffect, useState } from 'react';

interface TUseProyectLotsResult {
  lots: ProyectLotsItems[];
  isLoading: boolean;
  error: string | null;
  refreshStages: () => Promise<void>;
}

export function useProyectLots(blockId: string | undefined): TUseProyectLotsResult {
  const [lots, setLots] = useState<ProyectLotsItems[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLots = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getProyectLots({ id: blockId });
      setLots(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las etapas del proyecto');
    } finally {
      setIsLoading(false);
    }
  }, [blockId]);

  useEffect(() => {
    if (blockId) {
      fetchLots();
    } else {
      setLots([]);
      setIsLoading(false);
    }
  }, [blockId, fetchLots]);

  return {
    lots,
    isLoading,
    error,
    refreshStages: fetchLots
  };
}
