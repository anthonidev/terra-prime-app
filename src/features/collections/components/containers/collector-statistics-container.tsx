'use client';

import { useState } from 'react';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { useCollectorStatistics } from '@/features/collections/hooks/use-collector-statistics';
import { CollectorStatisticsTable } from '../collector-statistics-table';
import { CollectorStatisticsFilters } from '../collector-statistics-filters';

export function CollectorStatisticsContainer() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const { data, isLoading, isError } = useCollectorStatistics({
    page,
    limit,
    month,
    year,
    order: 'DESC',
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    setPage(1);
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <CollectorStatisticsFilters
          month={month}
          year={year}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
        />
      </div>

      {isLoading ? (
        <div className="bg-card flex h-64 items-center justify-center rounded-lg border">
          <div className="text-muted-foreground">Cargando estadísticas...</div>
        </div>
      ) : isError ? (
        <div className="bg-card flex h-64 items-center justify-center rounded-lg border">
          <div className="text-destructive">Error al cargar las estadísticas</div>
        </div>
      ) : (
        <>
          <CollectorStatisticsTable data={data?.items || []} />
          {data?.meta && <DataTablePagination meta={data.meta} onPageChange={handlePageChange} />}
        </>
      )}
    </div>
  );
}
