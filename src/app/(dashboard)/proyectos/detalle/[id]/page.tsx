'use client';

import { Separator } from '@components/ui/separator';
import { Skeleton } from '@components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProject } from '@hooks/project/useProjectReturn';
import { motion } from 'framer-motion';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import ProjectDetailHeader from '@components/project/detalle/ProjectDetailHeader';
import ProjectLotFilters from '@components/project/detalle/ProjectLotFilters';
import ProjectLotsTable from '@components/project/detalle/ProjectLotsTable';
import ProjectStages from '@components/project/detalle/ProjectStages';
import BlockFormModal from '@components/project/detalle/modal/BlockFormModal';
import EditProjectModal from '@components/project/detalle/modal/EditProjectModal';
import LotFormModal from '@components/project/detalle/modal/LotFormModal';
import StageFormModal from '@components/project/detalle/modal/StageFormModal';
import { Info, LayoutGrid } from 'lucide-react';
import {
  BlockDetailDto,
  LotResponseDto,
  StageDetailDto
} from '@infrastructure/types/projects/project.types';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<StageDetailDto | null>(null);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<BlockDetailDto | null>(null);
  const [selectedStageIdForBlock, setSelectedStageIdForBlock] = useState<string | undefined>(
    undefined
  );
  const [selectedBlockIdForLot, setSelectedBlockIdForLot] = useState<string | undefined>(undefined);
  const [selectedLot, setSelectedLot] = useState<LotResponseDto | null>(null);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const {
    projectDetail,
    lots,
    totalLots,
    totalPages,
    currentPage,
    isLoadingDetail,
    isLoadingLots,
    isUpdating,
    error,
    filters,
    setFilters,
    setPage,
    resetFilters,
    updateProject,
    updateProjectStage,
    createProjectStage,
    createProjectBlock,
    updateProjectBlock,
    createProjectLot,
    updateProjectLot
  } = useProject({ projectId: params.id });

  if (!isLoadingDetail && !projectDetail && !error) notFound();

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleOpenCreateStageModal = () => {
    setSelectedStage(null);
    setIsStageModalOpen(true);
  };

  const handleOpenEditStageModal = (stage: StageDetailDto) => {
    setSelectedStage(stage);
    setIsStageModalOpen(true);
  };

  const handleCloseStageModal = () => {
    setIsStageModalOpen(false);
    setSelectedStage(null);
  };

  const handleOpenCreateBlockModal = (stageId?: string) => {
    setSelectedBlock(null);
    setSelectedStageIdForBlock(stageId);
    setIsBlockModalOpen(true);
  };

  const handleOpenEditBlockModal = (block: BlockDetailDto) => {
    setSelectedBlock(block);
    setSelectedStageIdForBlock(undefined);
    setIsBlockModalOpen(true);
  };

  const handleCloseBlockModal = () => {
    setIsBlockModalOpen(false);
    setSelectedBlock(null);
    setSelectedStageIdForBlock(undefined);
  };

  const handleOpenCreateLotModal = (blockId?: string) => {
    setSelectedLot(null);
    setSelectedBlockIdForLot(blockId);
    setIsLotModalOpen(true);
  };

  const handleOpenEditLotModal = (lot: LotResponseDto) => {
    setSelectedLot(lot);
    setSelectedBlockIdForLot(undefined);
    setIsLotModalOpen(true);
  };

  const handleCloseLotModal = () => {
    setIsLotModalOpen(false);
    setSelectedLot(null);
    setSelectedBlockIdForLot(undefined);
  };

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isLoadingDetail ? (
          <div className="mb-6">
            <Skeleton className="mb-2 h-8 w-1/3" />
            <Skeleton className="mb-2 h-4 w-1/4" />
            <div className="mt-4 flex gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
          </div>
        ) : (
          <ProjectDetailHeader project={projectDetail} onEditClick={handleOpenEditModal} />
        )}
        <Separator className="my-6" />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <div className="relative border-b">
            <motion.div
              key="tab-indicator"
              className="bg-primary absolute bottom-0 h-0.5"
              initial={false}
              animate={{
                left: activeTab === 'info' ? '0%' : '50%',
                right: activeTab === 'info' ? '50%' : '0%'
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
            <TabsList className="h-auto w-full bg-transparent p-0">
              <div className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="info"
                  className="data-[state=active]:text-primary flex h-11 items-center gap-1.5 rounded-none border-0 data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:shadow-none"
                >
                  <Info className="h-4 w-4" />
                  <span>Información General</span>
                </TabsTrigger>
                <TabsTrigger
                  value="lots"
                  className="data-[state=active]:text-primary flex h-11 items-center gap-1.5 rounded-none border-0 data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:shadow-none"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>Lotes</span>
                  {!isLoadingLots && totalLots > 0 && (
                    <span className="bg-primary/10 text-primary ml-1.5 rounded-full px-1.5 py-0.5 text-xs">
                      {totalLots}
                    </span>
                  )}
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <TabsContent
            value="info"
            className="mt-4 pt-2 outline-none focus-visible:ring-0 focus-visible:outline-none"
          >
            {isLoadingDetail ? (
              <motion.div
                key="loading-container"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                <motion.div
                  key="skeleton-1"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <Skeleton className="h-64 w-full" />
                </motion.div>
                <motion.div
                  key="skeleton-2"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <Skeleton className="mt-4 h-64 w-full" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="info-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="focus:outline-none"
              >
                <ProjectStages
                  stages={projectDetail?.stages || []}
                  onCreateStage={handleOpenCreateStageModal}
                  onEditStage={handleOpenEditStageModal}
                  onCreateBlock={handleOpenCreateBlockModal}
                  onEditBlock={handleOpenEditBlockModal}
                />
              </motion.div>
            )}
          </TabsContent>

          <TabsContent
            value="lots"
            className="mt-4 pt-2 outline-none focus-visible:ring-0 focus-visible:outline-none"
          >
            <motion.div
              key="lots-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 focus:outline-none"
            >
              <motion.div
                key="lot-filters"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectLotFilters
                  projectDetail={projectDetail}
                  currentFilters={filters}
                  onFilterChange={setFilters}
                  onReset={resetFilters}
                  isLoading={isLoadingDetail}
                />
              </motion.div>

              <motion.div
                key="lot-table"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <ProjectLotsTable
                  lots={lots}
                  isLoading={isLoadingLots}
                  totalItems={totalLots}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  pageSize={Number(filters.limit) || 10}
                  onEditLot={handleOpenEditLotModal}
                  onCreateLot={handleOpenCreateLotModal}
                  currency={projectDetail?.currency || 'USD'}
                />
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
      {projectDetail && (
        <EditProjectModal
          project={projectDetail}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUpdate={updateProject}
          isUpdating={isUpdating}
          error={error}
        />
      )}
      <StageFormModal
        isOpen={isStageModalOpen}
        onClose={handleCloseStageModal}
        stage={selectedStage}
        onCreateStage={createProjectStage}
        onUpdateStage={updateProjectStage}
        error={error}
      />
      {projectDetail && (
        <BlockFormModal
          isOpen={isBlockModalOpen}
          onClose={handleCloseBlockModal}
          block={selectedBlock}
          stages={projectDetail.stages}
          preselectedStageId={selectedStageIdForBlock}
          onCreateBlock={createProjectBlock}
          onUpdateBlock={updateProjectBlock}
          error={error}
        />
      )}
      {projectDetail && (
        <LotFormModal
          isOpen={isLotModalOpen}
          onClose={handleCloseLotModal}
          lot={selectedLot}
          stages={projectDetail.stages}
          preselectedBlockId={selectedBlockIdForLot}
          onCreateLot={createProjectLot}
          onUpdateLot={updateProjectLot}
          error={error}
        />
      )}
    </div>
  );
}
