'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/common/page-header';
import { useMySalesContainer } from '../../hooks/use-my-sales-container';
import { MySalesSkeleton } from '../skeletons/my-sales-skeleton';
import { MySalesTable } from '../tables/my-sales-table';
import { SalesCardView } from './components/sales-card-view';
import { SalesFilters } from './components/sales-filters';
import { SalesErrorState } from './components/sales-error-state';
import { SalesEmptyState } from './components/sales-empty-state';

export function MySalesContainer() {
  const { sales, totalItems, order, isLoading, isError, isEmpty, toggleOrder } =
    useMySalesContainer();

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
          title="Mis ventas"
          description="Lista de ventas realizadas por ti"
          action={
            !isEmpty && !isError ? (
              <Button asChild>
                <Link href="/ventas/crear-venta">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Venta
                </Link>
              </Button>
            ) : undefined
          }
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
            <MySalesTable data={sales} />
          </motion.div>

          {/* Mobile Card View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="md:hidden"
          >
            <SalesCardView sales={sales} />
          </motion.div>
        </>
      )}
    </div>
  );
}
