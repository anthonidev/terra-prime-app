'use client';

import { useState } from 'react';
import { useActiveProjects } from './use-active-projects';
import { useProjectStages } from './use-project-stages';
import { useStageBlocks } from './use-stage-blocks';
import { useBlockLots } from './use-block-lots';
import { useProjectParkingsForSale } from './use-project-parkings-for-sale';
import type { ProjectLotResponse, AvailableParkingForSale, Step1Data } from '../types';

interface UseLotSelectionProps {
  initialData?: Step1Data;
}

export function useLotSelection({ initialData }: UseLotSelectionProps = {}) {
  // Sale target state
  const [saleTarget, setSaleTarget] = useState<'lot' | 'parking'>(initialData?.saleTarget || 'lot');

  // State for selections
  const [projectId, setProjectId] = useState<string>(initialData?.projectId || '');
  const [projectName, setProjectName] = useState<string>(initialData?.projectName || '');
  const [projectCurrency, setProjectCurrency] = useState<string>(
    initialData?.projectCurrency || ''
  );
  const [stageId, setStageId] = useState<string>(initialData?.stageId || '');
  const [stageName, setStageName] = useState<string>(initialData?.stageName || '');
  const [blockId, setBlockId] = useState<string>(initialData?.blockId || '');
  const [blockName, setBlockName] = useState<string>(initialData?.blockName || '');
  const [selectedLot, setSelectedLot] = useState<ProjectLotResponse | null>(
    initialData?.selectedLot || null
  );
  const [selectedParking, setSelectedParking] = useState<AvailableParkingForSale | null>(
    initialData?.selectedParking || null
  );

  // Data queries
  const { data: projects, isLoading: isLoadingProjects } = useActiveProjects();
  const { data: stages, isLoading: isLoadingStages } = useProjectStages(projectId);
  const { data: blocks, isLoading: isLoadingBlocks } = useStageBlocks(stageId);
  const { data: lots, isLoading: isLoadingLots } = useBlockLots(blockId);
  const { data: parkings, isLoading: isLoadingParkings } = useProjectParkingsForSale(
    saleTarget === 'parking' ? projectId : ''
  );

  // Handlers
  const handleSaleTargetChange = (target: 'lot' | 'parking') => {
    setSaleTarget(target);
    // Reset all selections
    setProjectId('');
    setProjectName('');
    setProjectCurrency('');
    setStageId('');
    setStageName('');
    setBlockId('');
    setBlockName('');
    setSelectedLot(null);
    setSelectedParking(null);
  };

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
    setSelectedParking(null);
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

  const handleSelectParking = (parking: AvailableParkingForSale) => {
    setSelectedParking(parking);
  };

  const getFormData = (): Step1Data => ({
    saleTarget,
    projectId,
    projectName,
    projectCurrency,
    stageId,
    stageName,
    blockId,
    blockName,
    selectedLot,
    selectedParking,
  });

  const canProceed = saleTarget === 'lot' ? !!selectedLot : !!selectedParking;

  return {
    // State
    saleTarget,
    projectId,
    projectName,
    projectCurrency,
    stageId,
    stageName,
    blockId,
    blockName,
    selectedLot,
    selectedParking,

    // Data
    projects,
    stages,
    blocks,
    lots,
    parkings,

    // Loading states
    isLoadingProjects,
    isLoadingStages,
    isLoadingBlocks,
    isLoadingLots,
    isLoadingParkings,

    // Handlers
    handleSaleTargetChange,
    handleProjectChange,
    handleStageChange,
    handleBlockChange,
    handleSelectLot,
    handleSelectParking,

    // Utilities
    getFormData,
    canProceed,
  };
}
