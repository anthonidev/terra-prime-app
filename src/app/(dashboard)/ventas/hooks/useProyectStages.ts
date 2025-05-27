import { getProyectStages } from '@/lib/actions/sales/proyectStagesActions';
import { ProyectStagesItems } from '@/types/sales';
import { useCallback, useEffect, useState } from 'react';

interface UseProyectStagesResult {
  stages: ProyectStagesItems[];
  isLoading: boolean;
  error: string | null;
  refreshStages: () => Promise<void>;
}

export function useProyectStages(projectId: string): UseProyectStagesResult {
  const [stages, setStages] = useState<ProyectStagesItems[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStages = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getProyectStages({ id: projectId });
      setStages(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las etapas del proyecto');
      console.error('Error fetching project stages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchStages();
    } else {
      setStages([]);
      setIsLoading(false);
    }
  }, [projectId, fetchStages]);

  return {
    stages,
    isLoading,
    error,
    refreshStages: fetchStages
  };
}
