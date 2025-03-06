"use client";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProject } from "@/hooks/project/useProjectReturn";
import { motion } from "framer-motion";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import ProjectDetailHeader from "@/components/project/detalle/ProjectDetailHeader";
import ProjectLotFilters from "@/components/project/detalle/ProjectLotFilters";
import ProjectLotsTable from "@/components/project/detalle/ProjectLotsTable";
import ProjectStages from "@/components/project/detalle/ProjectStages";
import BlockFormModal from "@/components/project/detalle/modal/BlockFormModal";
import EditProjectModal from "@/components/project/detalle/modal/EditProjectModal";
import LotFormModal from "@/components/project/detalle/modal/LotFormModal";
import StageFormModal from "@/components/project/detalle/modal/StageFormModal";
import {
  BlockDetailDto,
  LotResponseDto,
  StageDetailDto,
} from "@/types/project.types";
export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("info");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<StageDetailDto | null>(
    null
  );
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<BlockDetailDto | null>(
    null
  );
  const [selectedStageIdForBlock, setSelectedStageIdForBlock] = useState<
    string | undefined
  >(undefined);
  const [selectedBlockIdForLot, setSelectedBlockIdForLot] = useState<
    string | undefined
  >(undefined);
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
    updateProjectLot,
  } = useProject({ projectId: params.id });
  if (!isLoadingDetail && !projectDetail && !error) {
    notFound();
  }
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };
  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };
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
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-2" />
            <div className="flex gap-6 mt-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
          </div>
        ) : (
          <ProjectDetailHeader
            project={projectDetail}
            onEditClick={handleOpenEditModal}
          />
        )}
        <Separator className="my-6" />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <div className="flex items-center justify-between mb-1">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:inline-flex">
              <TabsTrigger
                value="info"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Información General
              </TabsTrigger>
              <TabsTrigger
                value="lots"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Lotes
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="info" className="mt-3 space-y-4">
            {isLoadingDetail ? (
              <motion.div
                variants={containerAnimation}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={itemAnimation}>
                  <Skeleton className="h-64 w-full" />
                </motion.div>
                <motion.div variants={itemAnimation}>
                  <Skeleton className="h-64 w-full mt-4" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
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
          <TabsContent value="lots" className="mt-3 space-y-4">
            <motion.div
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
              />
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
