'use client';

import { useState } from 'react';
import { Filter, Loader2, Users } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useLeads } from '../../hooks/use-leads';
import { LeadsFilters } from '../filters/leads-filters';
import { LeadsTable } from '../tables/leads-table';

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

  const totalLeads = data?.meta.totalItems || 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Leads</h1>
          <p className="text-sm text-muted-foreground">
            {totalLeads} {totalLeads === 1 ? 'lead registrado' : 'leads registrados'}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center">
              <Filter className="h-4 w-4 text-accent" />
            </div>
            <CardTitle className="text-base">Filtros de Búsqueda</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Table */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Cargando leads...</span>
              </div>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : data ? (
        <LeadsTable leads={data.items} meta={data.meta} onPageChange={setPage} />
      ) : null}
    </div>
  );
}
