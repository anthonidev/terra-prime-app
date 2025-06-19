'use client';

import { useEffect, useState } from 'react';
import { getProyectBlocks } from '@infrastructure/server-actions/lotes.actions';
import { Block } from '@domain/entities/lotes/block.entity';

export function useBlocks(stageId?: string) {
  const [state, setState] = useState<{
    blocks: Block[];
    loading: boolean;
    error: string | null;
  }>({
    blocks: [],
    loading: true,
    error: null
  });

  const fetchBlocks = async (id?: string) => {
    if (!id) {
      setState({ blocks: [], loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const blocks = await getProyectBlocks({ id });
      setState({ blocks, loading: false, error: null });
    } catch (error) {
      setState({
        blocks: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Error loading blocks'
      });
    }
  };

  useEffect(() => {
    fetchBlocks(stageId);
  }, [stageId]);

  return {
    ...state,
    fetchBlocks
  };
}
