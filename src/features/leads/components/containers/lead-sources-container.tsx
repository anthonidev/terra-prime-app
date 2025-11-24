'use client';

import { useState } from 'react';
import { Loader2, Plus, Target } from 'lucide-react';

import { PageHeader } from '@/shared/components/common/page-header';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Fuentes de Leads"
        description={`${totalSources} ${totalSources === 1 ? 'fuente registrada' : 'fuentes registradas'}`}
        icon={Target}
      >
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva fuente
        </Button>
      </PageHeader>

      {/* Filters Card */}
      <Card className="border-none shadow-sm">
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
        <Card className="border-none shadow-sm">
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
