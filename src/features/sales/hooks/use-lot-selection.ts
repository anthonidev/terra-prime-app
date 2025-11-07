'use client';

import { useState } from 'react';
import { useActiveProjects } from './use-active-projects';
import { useProjectStages } from './use-project-stages';
import { useStageBlocks } from './use-stage-blocks';
import { useBlockLots } from './use-block-lots';
import type { ProjectLotResponse, Step1Data } from '../types';

interface UseLotSelectionProps {
  initialData?: Step1Data;
}

export function useLotSelection({ initialData }: UseLotSelectionProps = {}) {
  // State for selections
  const [projectId, setProjectId] = useState<string>(initialData?.projectId || '');
  const [projectName, setProjectName] = useState<string>(initialData?.projectName || '');
  const [projectCurrency, setProjectCurrency] = useState<string>(initialData?.projectCurrency || '');
  const [stageId, setStageId] = useState<string>(initialData?.stageId || '');
  const [stageName, setStageName] = useState<string>(initialData?.stageName || '');
  const [blockId, setBlockId] = useState<string>(initialData?.blockId || '');
  const [blockName, setBlockName] = useState<string>(initialData?.blockName || '');
  const [selectedLot, setSelectedLot] = useState<ProjectLotResponse | null>(
    initialData?.selectedLot || null
  );

  // Data queries
  const { data: projects, isLoading: isLoadingProjects } = useActiveProjects();
  const { data: stages, isLoading: isLoadingStages } = useProjectStages(projectId);
  const { data: blocks, isLoading: isLoadingBlocks } = useStageBlocks(stageId);
  const { data: lots, isLoading: isLoadingLots } = useBlockLots(blockId);

  // Handlers
  const handleProjectChange = (value: string) => {
    const selected = projects?.find((p) => p.id === value);
    setProjectId(value);
    setProjectName(selected?.name || '');
    setProjectCurrency(selected?.currency || '');
    // Reset dependent selections
    setStageId('');
    setStageName('');
    setBlockId('');
    setBlockName('');
    setSelectedLot(null);
  };

  const handleStageChange = (value: string) => {
    const selected = stages?.find((s) => s.id === value);
    setStageId(value);
    setStageName(selected?.name || '');
    // Reset dependent selections
    setBlockId('');
    setBlockName('');
    setSelectedLot(null);
  };

  const handleBlockChange = (value: string) => {
    const selected = blocks?.find((b) => b.id === value);
    setBlockId(value);
    setBlockName(selected?.name || '');
    // Reset lot selection
    setSelectedLot(null);
  };

  const handleSelectLot = (lot: ProjectLotResponse) => {
    setSelectedLot(lot);
  };

  const getFormData = (): Step1Data => ({
    projectId,
    projectName,
    projectCurrency,
    stageId,
    stageName,
    blockId,
    blockName,
    selectedLot,
  });

  const canProceed = !!selectedLot;

  return {
    // State
    projectId,
    projectName,
    projectCurrency,
    stageId,
    stageName,
    blockId,
    blockName,
    selectedLot,

    // Data
    projects,
    stages,
    blocks,
    lots,

    // Loading states
    isLoadingProjects,
    isLoadingStages,
    isLoadingBlocks,
    isLoadingLots,

    // Handlers
    handleProjectChange,
    handleStageChange,
    handleBlockChange,
    handleSelectLot,

    // Utilities
    getFormData,
    canProceed,
  };
}
