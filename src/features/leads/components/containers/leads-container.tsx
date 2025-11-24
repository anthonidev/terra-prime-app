'use client';

import { useState } from 'react';
import { Loader2, Plus, Users } from 'lucide-react';
import Link from 'next/link';

import { PageHeader } from '@/shared/components/common/page-header';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Gestión de Leads"
        description={`${totalLeads} ${totalLeads === 1 ? 'lead registrado' : 'leads registrados'}`}
        icon={Users}
      >
        <Link href="/leads/nuevo">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Lead
          </Button>
        </Link>
      </PageHeader>

      {/* Filters Section */}
      <Card className="border-none shadow-sm">
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
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="text-primary h-4 w-4 animate-spin" />
                <span className="text-muted-foreground text-sm">Cargando leads...</span>
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
