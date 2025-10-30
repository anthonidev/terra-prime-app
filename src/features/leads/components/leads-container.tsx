'use client';

import { useState } from 'react';

import { PageHeader } from '@/shared/components/common/page-header';

import { useLeads } from '../hooks/use-leads';
import { LeadsFilters } from './leads-filters';
import { LeadsTable } from './leads-table';

export function LeadsContainer() {
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isInOffice, setIsInOffice] = useState('all');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useLeads({
    page,
    limit: 20,
    search: search || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    isInOffice: isInOffice === 'all' ? undefined : (isInOffice as 'true' | 'false'),
    order,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Gestión de Leads"
        description="Administra y consulta los leads registrados en el sistema"
      />

      {/* Filters Section */}
      <div className="rounded-lg border bg-card shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <LeadsFilters
          search={search}
          startDate={startDate}
          endDate={endDate}
          isInOffice={isInOffice}
          order={order}
          onSearchChange={setSearch}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onIsInOfficeChange={setIsInOffice}
          onOrderChange={setOrder}
          onSearchSubmit={() => setPage(1)}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="rounded-lg border bg-card shadow-sm p-8">
          <p className="text-center text-muted-foreground">Cargando leads...</p>
        </div>
      ) : data ? (
        <LeadsTable leads={data.items} meta={data.meta} onPageChange={setPage} />
      ) : null}
    </div>
  );
}
