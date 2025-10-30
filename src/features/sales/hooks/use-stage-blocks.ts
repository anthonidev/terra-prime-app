'use client';

import { useQuery } from '@tanstack/react-query';
import { getStageBlocks } from '../lib/queries';

export function useStageBlocks(stageId: string) {
  return useQuery({
    queryKey: ['stage-blocks', stageId],
    queryFn: () => getStageBlocks(stageId),
    enabled: !!stageId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
