"use client";

import LeadsTable from "@/components/leads/LeadsTable";
import LeadsTableFilters from "@/components/leads/LeadsTableFilters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useLeadsList } from "@/hooks/leads/useLeadsList";
import { AlertCircle, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

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
    handleRegisterDeparture,
  } = useLeadsList();

  const handleViewDetails = useCallback(
    (id: string) => {
      router.push(`/leads/detalle/${id}`);
    },
    [router]
  );

  const handleCreateLead = useCallback(() => {
    router.push("/leads/nuevo");
  }, [router]);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Leads
        </h1>
        <p className="text-muted-foreground">
          Gestiona los leads y sus visitas a la inmobiliaria
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <Button
          onClick={handleCreateLead}
          className="bg-primary text-primary-foreground hover:bg-primary-hover w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
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
