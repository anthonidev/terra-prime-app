'use client';

import { motion } from 'framer-motion';
import { FileText, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/shared/components/common/page-header';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useInvoicesContainer } from '../../hooks/use-invoices-container';
import { InvoicesTable } from '../tables/invoices-table';
import { InvoicesCardView } from '../tables/invoices-card-view';
import { InvoicesFilters } from '../filters/invoices-filters';

function InvoicesSkeleton() {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function InvoicesEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="border-none shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="bg-muted rounded-full p-4">
            <FileText className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No hay comprobantes</h3>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            No se encontraron comprobantes electrónicos con los filtros aplicados.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InvoicesErrorState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="border-destructive/50 border-none shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="bg-destructive/10 rounded-full p-4">
            <AlertCircle className="text-destructive h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Error al cargar</h3>
          <p className="text-muted-foreground mt-2 text-center text-sm">
            Ocurrió un error al cargar los comprobantes. Por favor, intenta de nuevo.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function InvoicesContainer() {
  const {
    invoices,
    meta,
    search,
    status,
    documentType,
    startDate,
    endDate,
    isLoading,
    isError,
    isEmpty,
    hasFilters,
    setPage,
    setSearch,
    setStatus,
    setDocumentType,
    setStartDate,
    setEndDate,
    clearFilters,
  } = useInvoicesContainer();

  const showEmptyState = isEmpty && !isError && !hasFilters;
  const showContent = !isError && (!isEmpty || hasFilters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PageHeader
          title="Comprobantes SUNAT"
          description="Lista de facturas y boletas electrónicas generadas"
        />
      </motion.div>

      {/* Error State */}
      {isError && <InvoicesErrorState />}

      {/* Empty State (only show when no filters and initial load complete) */}
      {showEmptyState && !isLoading && <InvoicesEmptyState />}

      {/* Content */}
      {showContent && (
        <>
          {/* Filters - Always visible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <InvoicesFilters
              search={search}
              status={status}
              documentType={documentType}
              startDate={startDate}
              endDate={endDate}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onDocumentTypeChange={setDocumentType}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onClearFilters={clearFilters}
              hasFilters={hasFilters}
              totalItems={meta?.totalItems ?? 0}
            />
          </motion.div>

          {/* Loading State - Only for table/cards */}
          {isLoading ? (
            <InvoicesSkeleton />
          ) : (
            <>
              {/* No results with filters */}
              {isEmpty && hasFilters ? (
                <InvoicesEmptyState />
              ) : (
                <>
                  {/* Desktop Table View */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="hidden md:block"
                  >
                    <InvoicesTable data={invoices} />
                  </motion.div>

                  {/* Mobile Card View */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="md:hidden"
                  >
                    <InvoicesCardView invoices={invoices} />
                  </motion.div>

                  {/* Pagination */}
                  {meta && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <DataTablePagination meta={meta} onPageChange={setPage} />
                    </motion.div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
