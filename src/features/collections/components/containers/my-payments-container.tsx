'use client';

import { PageHeader } from '@/shared/components/common/page-header';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { Receipt } from 'lucide-react';
import { useState } from 'react';
import { useMyPayments } from '../../hooks/use-my-payments';
import { MyPaymentsFilters } from '../filters/my-payments-filters';
import { MyPaymentsTable } from '../tables/my-payments-table';
import { MyPaymentsCards } from '../cards/my-payments-cards';
import { useMediaQuery } from '@/shared/hooks/use-media-query';

export function MyPaymentsContainer() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [filters, setFilters] = useState({});
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { data, isLoading, isError } = useMyPayments({
    page,
    limit,
    order: 'DESC',
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
        title="Mis Pagos"
        description="Lista de pagos registrados en el sistema"
        icon={Receipt}
      />

      <div className="space-y-4">
        <MyPaymentsFilters filters={filters} onFiltersChange={handleFiltersChange} />

        {isLoading ? (
          <div className="bg-card flex h-64 items-center justify-center rounded-lg border">
            <div className="text-muted-foreground">Cargando pagos...</div>
          </div>
        ) : isError ? (
          <div className="bg-card flex h-64 items-center justify-center rounded-lg border">
            <div className="text-destructive">Error al cargar los pagos</div>
          </div>
        ) : data?.items.length === 0 ? (
          <div className="bg-card flex h-64 items-center justify-center rounded-lg border">
            <div className="text-muted-foreground">No se encontraron pagos</div>
          </div>
        ) : (
          <>
            {isMobile ? (
              <MyPaymentsCards data={data?.items || []} />
            ) : (
              <MyPaymentsTable data={data?.items || []} />
            )}
            {data?.meta && <DataTablePagination meta={data.meta} onPageChange={handlePageChange} />}
          </>
        )}
      </div>
    </div>
  );
}
