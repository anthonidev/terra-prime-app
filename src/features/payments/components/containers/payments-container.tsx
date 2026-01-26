'use client';

import { motion } from 'framer-motion';
import { PageHeader } from '@/shared/components/common/page-header';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { usePaymentsContainer } from '../../hooks/use-payments-container';
import { PaymentsSkeleton } from '../skeletons/payments-skeleton';
import { PaymentsTable } from '../tables/payments-table';
import { PaymentsCardView } from '../tables/payments-card-view';
import { PaymentsFilters } from '../filters/payments-filters';
import { PaymentsErrorState } from '../states/payments-error-state';
import { PaymentsEmptyState } from '../states/payments-empty-state';
export function PaymentsContainer() {
  const {
    payments,
    meta,
    search,
    status,
    startDate,
    endDate,
    orderBy,
    order,
    isLoading,
    isError,
    isEmpty,
    setPage,
    setSearch,
    setStatus,
    setStartDate,
    setEndDate,
    setOrderBy,
    setOrder,
  } = usePaymentsContainer();

  const showEmptyState = isEmpty && !isError && !search && !status && !startDate && !endDate;
  const showContent = !isError && (!isEmpty || search || status || startDate || endDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PageHeader
          title="Gestión de Pagos"
          description="Lista de todos los pagos realizados en el sistema"
        />
      </motion.div>

      {/* Error State */}
      {isError && <PaymentsErrorState />}

      {/* Empty State (only show when no filters and initial load complete) */}
      {showEmptyState && !isLoading && <PaymentsEmptyState />}

      {/* Content */}
      {showContent && (
        <>
          {/* Filters - Always visible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <PaymentsFilters
              search={search}
              status={status}
              startDate={startDate}
              endDate={endDate}
              orderBy={orderBy}
              order={order}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onOrderByChange={setOrderBy}
              onOrderChange={setOrder}
              totalItems={meta?.totalItems ?? 0}
            />
          </motion.div>

          {/* Loading State - Only for table/cards */}
          {isLoading ? (
            <PaymentsSkeleton />
          ) : (
            <>
              {/* Desktop Table View */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="hidden md:block"
              >
                <PaymentsTable data={payments} />
              </motion.div>

              {/* Mobile Card View */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="md:hidden"
              >
                <PaymentsCardView payments={payments} />
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
    </div>
  );
}
