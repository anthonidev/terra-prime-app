'use client';

import { motion } from 'framer-motion';
import { PageHeader } from '@/shared/components/common/page-header';
import { usePaymentsContainer } from '../../hooks/use-payments-container';
import { PaymentsSkeleton } from '../skeletons/payments-skeleton';
import { PaymentsTable } from '../tables/payments-table';
import { PaymentsCardView } from '../tables/payments-card-view';
import { PaymentsFilters } from '../filters/payments-filters';
import { PaymentsErrorState } from '../states/payments-error-state';
import { PaymentsEmptyState } from '../states/payments-empty-state';
import { PaymentsPagination } from '../pagination/payments-pagination';

export function PaymentsContainer() {
  const {
    payments,
    meta,
    page,
    search,
    status,
    startDate,
    endDate,
    isLoading,
    isError,
    isEmpty,
    setPage,
    setSearch,
    setStatus,
    setStartDate,
    setEndDate,
  } = usePaymentsContainer();

  // Loading state
  if (isLoading) {
    return <PaymentsSkeleton />;
  }

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

      {/* Filters */}
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
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          totalItems={meta?.totalItems ?? 0}
        />
      </motion.div>

      {/* Error State */}
      {isError && <PaymentsErrorState />}

      {/* Empty State */}
      {isEmpty && !isError && <PaymentsEmptyState />}

      {/* Content */}
      {!isError && !isEmpty && (
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
          {meta && meta.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <PaymentsPagination meta={meta} page={page} onPageChange={setPage} />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
