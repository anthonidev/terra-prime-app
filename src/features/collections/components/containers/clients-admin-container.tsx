'use client';

import { PageHeader } from '@/shared/components/common/page-header';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { useClients } from '../../hooks/use-clients';
import { ClientsAdminFilters } from '../filters/clients-admin-filters';
import { ClientsAdminTable } from '../tables/clients-admin-table';

export function ClientsAdminContainer() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [filters, setFilters] = useState({});

  const { data, isLoading, isError } = useClients({
    page,
    limit,
    ...filters,
  });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de clientes con ventas financiadas"
        description="Lista de clientes asignados a cobradores"
        icon={Users}
      />

      <div className="space-y-4">
        <ClientsAdminFilters filters={filters} onFiltersChange={handleFiltersChange} />

        {isLoading ? (
          <div className="bg-card flex h-64 items-center justify-center rounded-lg border">
            <div className="text-muted-foreground">Cargando clientes...</div>
          </div>
        ) : isError ? (
          <div className="bg-card flex h-64 items-center justify-center rounded-lg border">
            <div className="text-destructive">Error al cargar los clientes</div>
          </div>
        ) : (
          <>
            <ClientsAdminTable clients={data?.items || []} />
            {data?.meta && <DataTablePagination meta={data.meta} onPageChange={handlePageChange} />}
          </>
        )}
      </div>
    </div>
  );
}
