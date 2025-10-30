'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/common/page-header';

import { useLeadSources } from '../hooks/use-lead-sources';
import { LeadSourcesFilters } from './lead-sources-filters';
import { LeadSourcesTable } from './lead-sources-table';
import { LeadSourceFormDialog } from './lead-source-form-dialog';
import type { LeadSource } from '../types';

export function LeadSourcesContainer() {
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState('all');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeadSource, setSelectedLeadSource] = useState<LeadSource | null>(null);

  const { data, isLoading } = useLeadSources({
    page,
    limit: 20,
    order,
    search: search || undefined,
    isActive: isActive === 'all' ? undefined : isActive === 'true',
  });

  const handleEdit = (leadSource: LeadSource) => {
    setSelectedLeadSource(leadSource);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedLeadSource(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedLeadSource(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Gestión de fuentes de leads"
        description="Administra las fuentes de generación de leads"
      />

      {/* Filters Section */}
      <div className="rounded-lg border bg-card shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Crear fuente
          </Button>
        </div>

        <LeadSourcesFilters
          search={search}
          isActive={isActive}
          order={order}
          onSearchChange={setSearch}
          onIsActiveChange={setIsActive}
          onOrderChange={setOrder}
          onSearchSubmit={() => setPage(1)}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="rounded-lg border bg-card shadow-sm p-8">
          <p className="text-center text-muted-foreground">Cargando...</p>
        </div>
      ) : data ? (
        <LeadSourcesTable
          leadSources={data.items}
          meta={data.meta}
          onEdit={handleEdit}
          onPageChange={setPage}
        />
      ) : null}

      {/* Dialog */}
      <LeadSourceFormDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        leadSource={selectedLeadSource}
      />
    </div>
  );
}
