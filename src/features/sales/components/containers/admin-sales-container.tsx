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

export function AdminSalesContainer() {
  const { sales, totalItems, order, isLoading, isError, isEmpty, toggleOrder } =
    useAdminSalesContainer();

  // Loading state
  if (isLoading) {
    return <MySalesSkeleton />;
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
          title="Administrar Ventas"
          description="Gestiona todas las ventas del sistema"
        />
      </motion.div>

      {/* Error State */}
      {isError && <SalesErrorState />}

      {/* Empty State */}
      {isEmpty && !isError && <SalesEmptyState />}

      {/* Content */}
      {!isError && !isEmpty && (
        <>
          {/* Filters */}
          <SalesFilters order={order} totalItems={totalItems} onToggleOrder={toggleOrder} />

          {/* Desktop Table View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden md:block"
          >
            <AdminSalesTable data={sales} />
          </motion.div>

          {/* Mobile Card View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="md:hidden"
          >
            <AdminSalesCardView sales={sales} />
          </motion.div>
        </>
      )}
    </div>
  );
}
