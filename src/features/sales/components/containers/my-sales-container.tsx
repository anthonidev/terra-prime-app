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
import { SalesEmptyState } from './components/sales-empty-state';
import { SalesErrorState } from './components/sales-error-state';
import { SalesFilters } from './components/sales-filters';

export function MySalesContainer() {
  const {
    sales,
    meta,
    order,
    isLoading,
    isError,
    isEmpty,
    toggleOrder,
    status,
    setStatus,
    type,
    setType,
    projectId,
    setProjectId,
    clientName,
    setClientName,
    handlePageChange,
  } = useMySalesContainer();

  const showEmptyState = isEmpty && !isError && !status && !type && !projectId && !clientName;
  const showContent = !isError && (!isEmpty || status || type || projectId || clientName);

  return (
    <div className="space-y-4 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PageHeader title="Mis ventas" description="Lista de ventas realizadas por ti">
          {!isEmpty && !isError && (
            <Button asChild>
              <Link href="/ventas/crear-venta">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Venta
              </Link>
            </Button>
          )}
        </PageHeader>
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
                <MySalesTable data={sales} meta={meta} onPageChange={handlePageChange} />
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
        </>
      )}
    </div>
  );
}
