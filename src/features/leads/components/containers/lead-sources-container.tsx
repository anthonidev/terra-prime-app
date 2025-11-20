'use client';

import { useState } from 'react';
import { Filter, Loader2, Plus, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useLeadSources } from '../../hooks/use-lead-sources';
import { LeadSourcesFilters } from '../filters/lead-sources-filters';
import { LeadSourcesTable } from '../tables/lead-sources-table';
import { LeadSourceFormDialog } from '../dialogs/lead-source-form-dialog';
import type { LeadSource } from '../../types';

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

  const totalSources = data?.meta.totalItems || 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Target className="text-primary h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Fuentes de Leads</h1>
            <p className="text-muted-foreground text-sm">
              {totalSources} {totalSources === 1 ? 'fuente registrada' : 'fuentes registradas'}
            </p>
          </div>
        </div>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva fuente
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-accent/20 flex h-8 w-8 items-center justify-center rounded">
              <Filter className="text-accent h-4 w-4" />
            </div>
            <CardTitle className="text-base">Filtros de Búsqueda</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <LeadSourcesFilters
            search={search}
            isActive={isActive}
            order={order}
            onSearchChange={setSearch}
            onIsActiveChange={setIsActive}
            onOrderChange={setOrder}
            onSearchSubmit={() => setPage(1)}
          />
        </CardContent>
      </Card>

      {/* Table or Loading */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="text-primary h-4 w-4 animate-spin" />
                <span className="text-muted-foreground text-sm">Cargando fuentes de leads...</span>
              </div>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
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
