'use client';

import { useState } from 'react';
import { useAssignedClients } from '../../hooks/use-assigned-clients';
import { AssignedClientsFilters } from '../filters/assigned-clients-filters';
import { AssignedClientsTable } from '../tables/assigned-clients-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';

export function AssignedClientsContainer() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    departamentoId: undefined,
    provinciaId: undefined,
    distritoId: undefined,
  });

  const { data, isLoading, isError } = useAssignedClients(filters);

  const handleFiltersChange = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-destructive">Error al cargar los clientes asignados</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AssignedClientsFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-muted-foreground">Cargando clientes...</div>
        </div>
      ) : (
        <>
          <AssignedClientsTable clients={data?.items || []} />
          {data?.meta && <DataTablePagination meta={data.meta} onPageChange={handlePageChange} />}
        </>
      )}
    </div>
  );
}
