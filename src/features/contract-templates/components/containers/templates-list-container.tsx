'use client';

import { useState } from 'react';
import { FileText, Plus, ScrollText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/common/page-header';
import { EmptyContainer } from '@/shared/components/common/empty-container';
import { useTemplatesListContainer } from '../../hooks/use-templates-list-container';
import { TemplatesTable } from '../tables/templates-table';
import { TemplatesGrid } from '../displays/templates-grid';
import { TemplatesFilters } from '../filters/templates-filters';
import { TemplatesListSkeleton } from '../skeletons/templates-list-skeleton';
import { CreateTemplateDialog } from '../dialogs/create-template-dialog';

export function TemplatesListContainer() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const {
    templates,
    isLoading,
    isEmpty,
    viewMode,
    setViewMode,
    projectId,
    setProjectId,
    status,
    setStatus,
    term,
    setTerm,
    handlePublish,
    handleUnpublish,
    handleDelete,
    ConfirmationDialog,
  } = useTemplatesListContainer();

  if (isLoading) return <TemplatesListSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plantillas de Contrato"
        description="Gestiona las plantillas para generar contratos"
        icon={ScrollText}
      >
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Plantilla
        </Button>
      </PageHeader>

      <TemplatesFilters
        projectId={projectId}
        onProjectChange={setProjectId}
        status={status}
        onStatusChange={setStatus}
        term={term}
        onTermChange={setTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {isEmpty && (
        <EmptyContainer
          title="Sin plantillas"
          description="No se encontraron plantillas con los filtros seleccionados."
        >
          <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Crear plantilla
          </Button>
        </EmptyContainer>
      )}

      {!isEmpty && templates.length > 0 && viewMode === 'list' && (
        <TemplatesTable
          data={templates}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          onDelete={handleDelete}
        />
      )}

      {!isEmpty && templates.length > 0 && viewMode === 'grid' && (
        <TemplatesGrid
          data={templates}
          onPublish={handlePublish}
          onUnpublish={handleUnpublish}
          onDelete={handleDelete}
        />
      )}

      <CreateTemplateDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ConfirmationDialog />
    </div>
  );
}
