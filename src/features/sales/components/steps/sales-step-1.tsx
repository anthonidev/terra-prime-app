'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useLotSelection } from '../../hooks/use-lot-selection';
import type { Step1Data } from '../../types';
import { SaleTargetSelector } from './components/sale-target-selector';
import { AvailableLotsTable } from './components/available-lots-table';
import { LotSelectionFilters } from './components/lot-selection-filters';
import { SelectedLotSummary } from './components/selected-lot-summary';
import { ParkingSelectionFilters } from './components/parking-selection-filters';
import { AvailableParkingsSaleTable } from './components/available-parkings-sale-table';
import { SelectedParkingSummary } from './components/selected-parking-summary';

interface SalesStep1Props {
  data?: Step1Data;
  onNext: (data: Step1Data) => void;
}

export function SalesStep1({ data, onNext }: SalesStep1Props) {
  const {
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
  } = useLotSelection({ initialData: data });

  // Refs for auto-scrolling
  const lotsTableRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lots/parkings table when ready
  useEffect(() => {
    if (saleTarget === 'lot' && blockId && lotsTableRef.current) {
      setTimeout(() => {
        lotsTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [blockId, saleTarget]);

  useEffect(() => {
    if (saleTarget === 'parking' && projectId && parkings && lotsTableRef.current) {
      setTimeout(() => {
        lotsTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [projectId, parkings, saleTarget]);

  // Auto-scroll to summary when selection is made
  useEffect(() => {
    if ((selectedLot || selectedParking) && summaryRef.current) {
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [selectedLot, selectedParking]);

  const handleNext = () => {
    if (!canProceed) return;
    onNext(getFormData());
  };

  return (
    <div className="space-y-8">
      {/* Sale Target Selector */}
      <section>
        <SaleTargetSelector value={saleTarget} onChange={handleSaleTargetChange} />
      </section>

      {/* Lot Flow */}
      {saleTarget === 'lot' && (
        <>
          <section>
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
          </section>

          {blockId && (
            <section ref={lotsTableRef} className="scroll-mt-6">
              <AvailableLotsTable
                lots={lots}
                isLoading={isLoadingLots}
                selectedLot={selectedLot}
                projectCurrency={projectCurrency}
                onSelectLot={handleSelectLot}
              />
            </section>
          )}

          {selectedLot && (
            <section ref={summaryRef} className="scroll-mt-6">
              <SelectedLotSummary
                projectName={projectName}
                stageName={stageName}
                blockName={blockName}
                selectedLot={selectedLot}
                projectCurrency={projectCurrency}
              />
            </section>
          )}
        </>
      )}

      {/* Parking Flow */}
      {saleTarget === 'parking' && (
        <>
          <section>
            <ParkingSelectionFilters
              projectId={projectId}
              projects={projects}
              isLoadingProjects={isLoadingProjects}
              onProjectChange={handleProjectChange}
            />
          </section>

          {projectId && (
            <section ref={lotsTableRef} className="scroll-mt-6">
              <AvailableParkingsSaleTable
                parkings={parkings}
                isLoading={isLoadingParkings}
                selectedParking={selectedParking ?? null}
                projectCurrency={projectCurrency}
                onSelectParking={handleSelectParking}
              />
            </section>
          )}

          {selectedParking && (
            <section ref={summaryRef} className="scroll-mt-6">
              <SelectedParkingSummary
                projectName={projectName}
                selectedParking={selectedParking}
                projectCurrency={projectCurrency}
              />
            </section>
          )}
        </>
      )}

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end pt-4"
      >
        <Button onClick={handleNext} disabled={!canProceed} size="lg" className="min-w-32">
          Siguiente
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
