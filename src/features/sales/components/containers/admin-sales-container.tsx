'use client';

import { motion } from 'framer-motion';
import { PageHeader } from '@/shared/components/common/page-header';
import { useAdminSalesContainer } from '../../hooks/use-admin-sales-container';
import { MySalesSkeleton } from '../skeletons/my-sales-skeleton';
import { AdminSalesTable } from '../tables/admin-sales-table';
import { AdminSalesCardView } from './admin-sales-card-view';
import { SalesFilters } from './components/sales-filters';
import { SalesErrorState } from './components/sales-error-state';
import { SalesEmptyState } from './components/sales-empty-state';
import { AdminSale } from '../../types';

export function AdminSalesContainer() {
  const {
    sales,
    meta,
    order,
    status,
    type,
    projectId,
    clientName,
    isLoading,
    isError,
    isEmpty,
    toggleOrder,
    handlePageChange,
    setStatus,
    setType,
    setProjectId,
    setClientName,
  } = useAdminSalesContainer();

  const showEmptyState = isEmpty && !isError && !status && !type && !projectId && !clientName;
  const showContent = !isError && (!isEmpty || status || type || projectId || clientName);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PageHeader
          title="Administrar Ventas"
          description="Gestiona todas las ventas del sistema"
        />
      </motion.div>

      {/* Error State */}
      {isError && <SalesErrorState />}

      {/* Empty State (only show when no filters and initial load complete) */}
      {showEmptyState && !isLoading && <SalesEmptyState />}

      {/* Content */}
      {showContent && (
        <>
          {/* Filters - Always visible */}
          <SalesFilters
            order={order}
            onToggleOrder={toggleOrder}
            status={status}
            onStatusChange={setStatus}
            type={type}
            onTypeChange={setType}
            projectId={projectId}
            onProjectChange={setProjectId}
            clientName={clientName}
            onClientNameChange={setClientName}
          />

          {/* Loading State - Only for table/cards */}
          {isLoading ? (
            <MySalesSkeleton />
          ) : (
            <>
              {/* Desktop Table View */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="hidden md:block"
              >
                <AdminSalesTable
                  data={sales as unknown as AdminSale[]}
                  meta={meta}
                  onPageChange={handlePageChange}
                />
              </motion.div>

              {/* Mobile Card View */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="md:hidden"
              >
                <AdminSalesCardView sales={sales as unknown as AdminSale[]} />
              </motion.div>
            </>
          )}
        </>
      )}
    </div>
  );
}
