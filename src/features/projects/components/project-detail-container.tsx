'use client';

import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useProjectDetailContainer } from '../hooks/use-project-detail-container';
import { EditProjectDialog } from './edit-project-dialog';
import { StageFormDialog, BlockFormDialog } from './stage-block-dialogs';
import { LotFormDialog } from './lot-form-dialog';
import { ProjectStagesTab } from './project-stages-tab';
import { ProjectLotsTab } from './project-lots-tab';

interface ProjectDetailContainerProps {
  projectId: string;
}

export function ProjectDetailContainer({ projectId }: ProjectDetailContainerProps) {
  const {
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
  } = useProjectDetailContainer(projectId);

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (isError || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">Error al cargar el proyecto</p>
          <p className="text-sm text-muted-foreground mt-2">
            Intenta recargar la página
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Back */}
      <Link href="/proyectos">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a proyectos
        </Button>
      </Link>

      {/* Header del Proyecto */}
      <div className="rounded-lg border bg-card shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 rounded-lg">
              <AvatarImage src={project.logo || undefined} alt={project.name} />
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-2xl font-semibold">
                {projectInitials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={project.isActive ? 'default' : 'secondary'}>
                  {project.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  {project.currency}
                </Badge>
              </div>
            </div>
          </div>

          <Button onClick={() => handleEditProjectChange(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar proyecto
          </Button>
        </div>
      </div>

      {/* Tabs: Etapas y Lotes */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="border-b border-border dark:border-primary/20">
          <TabsList className="h-auto p-0 border-0">
            <TabsTrigger
              value="stages"
              className="relative  rounded-none border-b-2 border-transparent bg-transparent px-6 py-3 font-semibold text-muted-foreground shadow-none transition-all hover:bg-muted/50 hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none dark:data-[state=active]:border-primary/20"
            >
              Etapas
            </TabsTrigger>
            <TabsTrigger
              value="lots"
              className="relative rounded-none border-b-2 border-transparent bg-transparent px-6 py-3 font-semibold text-muted-foreground shadow-none transition-all hover:bg-muted/50 hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none dark:data-[state=active]:border-primary/20"
            >
              Lotes
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content: Etapas */}
        <TabsContent value="stages" className="mt-6">
          <ProjectStagesTab
            project={project}
            onCreateStage={openCreateStageDialog}
            onEditStage={openEditStageDialog}
            onCreateBlock={openCreateBlockDialog}
            onEditBlock={openEditBlockDialog}
          />
        </TabsContent>

        {/* Tab Content: Lotes */}
        <TabsContent value="lots" className="mt-6">
          <ProjectLotsTab
            project={project}
            lotsData={lotsData}
            lotsLoading={lotsLoading}
            filters={{
              search: lotsFilters.search,
              stageId: lotsFilters.stageId,
              blockId: lotsFilters.blockId,
              status: lotsFilters.status,
            }}
            onStageChange={handleStageFilterChange}
            onBlockChange={handleBlockFilterChange}
            onStatusChange={handleStatusFilterChange}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            onPageChange={handleLotsPageChange}
            onCreateLot={openCreateLotDialog}
            onEditLot={openEditLotDialog}
            canCreateLot={canCreateLot}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <EditProjectDialog
        open={editProjectOpen}
        onOpenChange={handleEditProjectChange}
        project={project}
      />

      <StageFormDialog
        open={stageDialogOpen}
        onOpenChange={handleStageDialogChange}
        projectId={projectId}
        stage={selectedStage}
      />

      {selectedStageForBlock && (
        <BlockFormDialog
          open={blockDialogOpen}
          onOpenChange={handleBlockDialogChange}
          projectId={projectId}
          stageId={selectedStageForBlock.id}
          stageName={selectedStageForBlock.name}
          block={selectedBlock}
        />
      )}

      {selectedBlockForLot && (
        <LotFormDialog
          open={lotDialogOpen}
          onOpenChange={handleLotDialogChange}
          projectId={projectId}
          blockId={selectedBlockForLot.id}
          blockName={selectedBlockForLot.name}
          lot={selectedLot}
        />
      )}
    </div>
  );
}

function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-40" />

      <div className="rounded-lg border bg-card shadow-sm p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-20 w-20 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-sm p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <Skeleton className="h-5 w-40 mb-3" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-32 rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
