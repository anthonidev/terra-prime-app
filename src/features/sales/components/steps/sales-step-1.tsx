'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useLotSelection } from '../../hooks/use-lot-selection';
import type { Step1Data } from '../../types';
import { AvailableLotsTable } from './components/available-lots-table';
import { LotSelectionFilters } from './components/lot-selection-filters';
import { SelectedLotSummary } from './components/selected-lot-summary';

interface SalesStep1Props {
  data?: Step1Data;
  onNext: (data: Step1Data) => void;
}

export function SalesStep1({ data, onNext }: SalesStep1Props) {
  const {
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
  } = useLotSelection({ initialData: data });

  const handleNext = () => {
    if (!canProceed) return;
    onNext(getFormData());
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <LotSelectionFilters
        projectId={projectId}
        projects={projects}
        isLoadingProjects={isLoadingProjects}
        onProjectChange={handleProjectChange}
        stageId={stageId}
        stages={stages}
        isLoadingStages={isLoadingStages}
        onStageChange={handleStageChange}
        blockId={blockId}
        blocks={blocks}
        isLoadingBlocks={isLoadingBlocks}
        onBlockChange={handleBlockChange}
      />

      {/* Lots Table */}
      {blockId && (
        <AvailableLotsTable
          lots={lots}
          isLoading={isLoadingLots}
          selectedLot={selectedLot}
          projectCurrency={projectCurrency}
          onSelectLot={handleSelectLot}
        />
      )}

      {/* Selected Lot Summary */}
      {selectedLot && (
        <SelectedLotSummary
          projectName={projectName}
          stageName={stageName}
          blockName={blockName}
          selectedLot={selectedLot}
          projectCurrency={projectCurrency}
        />
      )}

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end pt-2"
      >
        <Button onClick={handleNext} disabled={!canProceed} size="lg" className="min-w-32">
          Siguiente
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
