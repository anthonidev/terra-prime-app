import { getProyectStages } from '@infrastructure/server-actions/lotes.actions';
import { Stage } from '@domain/entities/lotes/stage.entity';
import { useEffect, useState } from 'react';

export function useStages(projectId?: string) {
  const [state, setState] = useState<{
    stages: Stage[];
    loading: boolean;
    error: string | null;
  }>({
    stages: [],
    loading: true,
    error: null
  });

  const fetchStages = async (id?: string) => {
    if (!id) {
      setState({ stages: [], loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const stages = await getProyectStages({ id });
      setState({ stages, loading: false, error: null });
    } catch (error) {
      setState({
        stages: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Error loading stages'
      });
    }
  };

  useEffect(() => {
    fetchStages(projectId);
  }, [projectId]);

  return {
    ...state,
    fetchStages
  };
}
