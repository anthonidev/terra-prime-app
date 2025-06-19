import { getProyectLots } from '@infrastructure/server-actions/lotes.actions';
import { Lot } from '@domain/entities/lotes/lot.entity';
import { useEffect, useState } from 'react';

export function useLots(blockId?: string) {
  const [state, setState] = useState<{
    lots: Lot[];
    loading: boolean;
    error: string | null;
  }>({
    lots: [],
    loading: true,
    error: null
  });

  const fetchLots = async (id?: string) => {
    if (!id) {
      setState({ lots: [], loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const lots = await getProyectLots({ id });
      setState({ lots, loading: false, error: null });
    } catch (error) {
      setState({
        lots: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Error loading lots'
      });
    }
  };

  useEffect(() => {
    fetchLots(blockId);
  }, [blockId]);

  return {
    ...state,
    fetchLots
  };
}
