import { useCallback, useMemo, useState } from 'react';

import { useProject } from './use-project';
import { useProjectLots } from './use-project-lots';
import type { Block, Lot, LotStatus, Stage } from '../types';

interface LotsFiltersState {
  search: string;
  stageId: string;
  blockId: string;
  status: LotStatus | 'all';
  page: number;
}

export function useProjectDetailContainer(projectId: string) {
  const { data: project, isLoading, isError } = useProject(projectId);

  const [activeTab, setActiveTab] = useState('stages');
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [stageDialogOpen, setStageDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedStageForBlock, setSelectedStageForBlock] = useState<Stage | null>(null);
  const [lotDialogOpen, setLotDialogOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [selectedBlockForLot, setSelectedBlockForLot] = useState<Block | null>(null);

  const [lotsFilters, setLotsFilters] = useState<LotsFiltersState>({
    search: '',
    stageId: 'all',
    blockId: 'all',
    status: 'all',
    page: 1,
  });

  const lotsQueryParams = useMemo(
    () => ({
      search: lotsFilters.search || undefined,
      stageId: lotsFilters.stageId !== 'all' ? lotsFilters.stageId : undefined,
      blockId: lotsFilters.blockId !== 'all' ? lotsFilters.blockId : undefined,
      status: lotsFilters.status !== 'all' ? lotsFilters.status : undefined,
      page: lotsFilters.page,
      limit: 10,
    }),
    [lotsFilters]
  );

  const { data: lotsData, isLoading: lotsLoading } = useProjectLots(
    projectId,
    lotsQueryParams,
    activeTab === 'lots'
  );

  const projectInitials = project?.name
    ? project.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  const canCreateLot = !!project && project.stages.some((stage) => stage.blocks.length > 0);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const handleEditProjectChange = useCallback((open: boolean) => {
    setEditProjectOpen(open);
  }, []);

  const openCreateStageDialog = useCallback(() => {
    setSelectedStage(null);
    setStageDialogOpen(true);
  }, []);

  const openEditStageDialog = useCallback((stage: Stage) => {
    setSelectedStage(stage);
    setStageDialogOpen(true);
  }, []);

  const handleStageDialogChange = useCallback((open: boolean) => {
    setStageDialogOpen(open);
    if (!open) {
      setSelectedStage(null);
    }
  }, []);

  const openCreateBlockDialog = useCallback((stage: Stage) => {
    setSelectedStageForBlock(stage);
    setSelectedBlock(null);
    setBlockDialogOpen(true);
  }, []);

  const openEditBlockDialog = useCallback((stage: Stage, block: Block) => {
    setSelectedStageForBlock(stage);
    setSelectedBlock(block);
    setBlockDialogOpen(true);
  }, []);

  const handleBlockDialogChange = useCallback((open: boolean) => {
    setBlockDialogOpen(open);
    if (!open) {
      setSelectedStageForBlock(null);
      setSelectedBlock(null);
    }
  }, []);

  const openCreateLotDialog = useCallback(() => {
    if (!project) {
      return;
    }

    const firstBlock = project.stages
      .flatMap((stage) => stage.blocks)
      .find((blockCandidate) => blockCandidate.isActive);

    if (!firstBlock) {
      return;
    }

    setSelectedBlockForLot(firstBlock);
    setSelectedLot(null);
    setLotDialogOpen(true);
  }, [project]);

  const openEditLotDialog = useCallback(
    (lot: Lot) => {
      if (!project) {
        return;
      }

      const block = project.stages
        .flatMap((stage) => stage.blocks)
        .find((blockCandidate) => blockCandidate.id === lot.blockId);

      if (!block) {
        return;
      }

      setSelectedBlockForLot(block);
      setSelectedLot(lot);
      setLotDialogOpen(true);
    },
    [project]
  );

  const handleLotDialogChange = useCallback((open: boolean) => {
    setLotDialogOpen(open);
    if (!open) {
      setSelectedBlockForLot(null);
      setSelectedLot(null);
    }
  }, []);

  const handleStageFilterChange = useCallback((stageId: string) => {
    setLotsFilters((prev) => ({
      ...prev,
      stageId,
      blockId: 'all',
      page: 1,
    }));
  }, []);

  const handleBlockFilterChange = useCallback((blockId: string) => {
    setLotsFilters((prev) => ({
      ...prev,
      blockId,
      page: 1,
    }));
  }, []);

  const handleStatusFilterChange = useCallback((status: LotStatus | 'all') => {
    setLotsFilters((prev) => ({
      ...prev,
      status,
      page: 1,
    }));
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setLotsFilters((prev) => ({
      ...prev,
      search,
    }));
  }, []);

  const handleSearchSubmit = useCallback(() => {
    setLotsFilters((prev) => ({
      ...prev,
      page: 1,
    }));
  }, []);

  const handleLotsPageChange = useCallback((page: number) => {
    setLotsFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  return {
    project,
    projectInitials,
    isLoading,
    isError,
    activeTab,
    handleTabChange,
    editProjectOpen,
    handleEditProjectChange,
    openCreateStageDialog,
    openEditStageDialog,
    stageDialogOpen,
    selectedStage,
    handleStageDialogChange,
    openCreateBlockDialog,
    openEditBlockDialog,
    blockDialogOpen,
    selectedBlock,
    selectedStageForBlock,
    handleBlockDialogChange,
    openCreateLotDialog,
    openEditLotDialog,
    lotDialogOpen,
    selectedLot,
    selectedBlockForLot,
    handleLotDialogChange,
    lotsFilters,
    lotsData,
    lotsLoading,
    handleStageFilterChange,
    handleBlockFilterChange,
    handleStatusFilterChange,
    handleSearchChange,
    handleSearchSubmit,
    handleLotsPageChange,
    canCreateLot,
  };
}
