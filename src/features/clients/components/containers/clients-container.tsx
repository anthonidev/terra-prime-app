'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { PageHeader } from '@/shared/components/common/page-header';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { EmptyContainer } from '@/shared/components/common/empty-container';
import { useClients } from '../../hooks/use-clients';
import { ClientsFiltersComponent, type ClientsFilters } from '../filters/clients-filters';
import { ClientsTable } from '../tables/clients-table';
import { ClientsSkeleton } from '../skeletons/clients-skeleton';

const DEFAULT_LIMIT = 20;

export function ClientsContainer() {
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [filters, setFilters] = useState<ClientsFilters>({
    order: 'DESC',
  });

  const { data, isLoading, isError } = useClients({
    page,
    limit,
    ...filters,
  });

  const handleFiltersChange = (newFilters: ClientsFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const isEmpty = !isLoading && (!data?.items || data.items.length === 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Lista de todos los clientes registrados"
        icon={Users}
      />

      <div className="space-y-4">
        <ClientsFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} />

        {isLoading ? (
          <ClientsSkeleton />
        ) : isError ? (
          <div className="bg-card flex h-64 items-center justify-center rounded-lg border">
            <div className="text-destructive">Error al cargar los clientes</div>
          </div>
        ) : isEmpty ? (
          <EmptyContainer
            title="No hay clientes"
            description="No se encontraron clientes con los filtros seleccionados"
          />
        ) : (
          <>
            <ClientsTable clients={data?.items || []} />
            {data?.meta && <DataTablePagination meta={data.meta} onPageChange={handlePageChange} />}
          </>
        )}
      </div>
    </div>
  );
}
