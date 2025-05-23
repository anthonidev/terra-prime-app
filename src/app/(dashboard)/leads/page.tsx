'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useLeadsList } from './hooks/useLeadsList';
import LeadsTableFilters from './components/LeadsTableFilters';
import LeadsTable from './components/LeadsTable';

export default function LeadsPage() {
  const router = useRouter();
  const {
    data,
    loading,
    error,
    search,
    isInOffice,
    startDate,
    endDate,
    currentPage,
    itemsPerPage,
    order,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleIsInOfficeChange,
    handleDateRangeChange,
    handleOrderChange,
    resetFilters,
    handleRegisterDeparture
  } = useLeadsList();

  const handleViewDetails = useCallback(
    (id: string) => {
      router.push(`/leads/detalle/${id}`);
    },
    [router]
  );

  const handleCreateLead = useCallback(() => {
    router.push('/leads/nuevo');
  }, [router]);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Users className="text-primary h-8 w-8" />
          Leads
        </h1>
        <p className="text-muted-foreground">Gestiona los leads y sus visitas a la inmobiliaria</p>
      </div>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <Button
          onClick={handleCreateLead}
          className="bg-primary text-primary-foreground hover:bg-primary-hover w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Lead
        </Button>
      </div>
      <div className="space-y-6">
        <LeadsTableFilters
          search={search}
          onSearchChange={handleSearchChange}
          isInOffice={isInOffice}
          onIsInOfficeChange={handleIsInOfficeChange}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
          order={order}
          onOrderChange={handleOrderChange}
          onResetFilters={resetFilters}
        />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <LeadsTable
          data={data}
          loading={loading}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          onViewDetails={handleViewDetails}
          onRegisterDeparture={handleRegisterDeparture}
        />
      </div>
    </div>
  );
}
