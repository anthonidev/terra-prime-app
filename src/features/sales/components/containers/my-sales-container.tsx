'use client';

import { useState } from 'react';
import { useMySales } from '../../hooks/use-my-sales';
import { MySalesTable } from '../tables/my-sales-table';
import { MySalesSkeleton } from '../skeletons/my-sales-skeleton';
import { PageHeader } from '@/shared/components/common/page-header';

export function MySalesContainer() {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');

  const { data, isLoading, isError } = useMySales({ page, limit: 20, order });

  if (isLoading) {
    return <MySalesSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Mis ventas"
          description="Lista de ventas realizadas por ti"
        />
        <div className="flex items-center justify-center h-64 rounded-lg border bg-card">
          <p className="text-muted-foreground">Error al cargar las ventas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis ventas"
        description="Lista de ventas realizadas por ti"
      />
      <MySalesTable data={data.items} />
    </div>
  );
}
