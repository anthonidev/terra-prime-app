import { getProyectBlocks } from '@/lib/actions/lotes/proyectBlocksActions';
import { ProyectBlocksItems } from '@/types/lotes';
import { useCallback, useEffect, useState } from 'react';

interface TUseProyectBlocksResult {
  blocks: ProyectBlocksItems[];
  isLoading: boolean;
  error: string | null;
  refreshStages: () => Promise<void>;
}

export function useProyectBlocks(stageId: string): TUseProyectBlocksResult {
  const [blocks, setBlocks] = useState<ProyectBlocksItems[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocks = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getProyectBlocks({ id: stageId });
      setBlocks(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las etapas del proyecto');
    } finally {
      setIsLoading(false);
    }
  }, [stageId]);

  useEffect(() => {
    if (stageId) {
      fetchBlocks();
    } else {
      setBlocks([]);
      setIsLoading(false);
    }
  }, [stageId, fetchBlocks]);

  return {
    blocks,
    isLoading,
    error,
    refreshStages: fetchBlocks
  };
}
