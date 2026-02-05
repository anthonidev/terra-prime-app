'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/common/page-header';

import { useMySalesContainer } from '../../hooks/use-my-sales-container';
import { MySalesSkeleton } from '../skeletons/my-sales-skeleton';
import { MySalesTable } from '../tables/my-sales-table';
import { SalesCardView } from './components/sales-card-view';
import { SalesEmptyState } from './components/sales-empty-state';
import { SalesErrorState } from './components/sales-error-state';
import { SalesFilters } from './components/sales-filters';
import { RegisterPaymentModal } from '../dialogs/register-payment-modal';
import { MySale, CurrencyType, StatusSale, SaleType } from '../../types';

// Calculate pending amount based on sale data
function calculatePendingAmount(sale: MySale): number {
  const status = sale.status;

  // For reservation states, use reservation amount pending
  if (status === StatusSale.RESERVATION_PENDING || status === StatusSale.RESERVATION_IN_PAYMENT) {
    return sale.reservationAmountPending ?? 0;
  }

  // For financed sales, use initial amount pending
  if (sale.type === SaleType.FINANCED && sale.financing) {
    return sale.financing.initialAmountPending ?? 0;
  }

  // For direct payment sales, use total amount pending
  return sale.totalAmountPending ?? 0;
}

// Check if sale status allows payment registration
function canRegisterPaymentByStatus(status: StatusSale): boolean {
  return [
    StatusSale.RESERVATION_PENDING,
    StatusSale.RESERVATION_IN_PAYMENT,
    StatusSale.RESERVED,
    StatusSale.PENDING,
    StatusSale.IN_PAYMENT,
    StatusSale.IN_PAYMENT_PROCESS,
  ].includes(status);
}

interface SelectedSaleForPayment {
  saleId: string;
  pendingAmount: number;
  currency: CurrencyType;
}

export function MySalesContainer() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSaleForPayment, setSelectedSaleForPayment] =
    useState<SelectedSaleForPayment | null>(null);

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

  const handleOpenPaymentModal = (sale: MySale) => {
    const pendingAmount = calculatePendingAmount(sale);
    setSelectedSaleForPayment({
      saleId: sale.id,
      pendingAmount,
      currency: sale.currency,
    });
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = (open: boolean) => {
    setIsPaymentModalOpen(open);
    if (!open) {
      setSelectedSaleForPayment(null);
    }
  };

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
                <MySalesTable
                  data={sales}
                  meta={meta}
                  onPageChange={handlePageChange}
                  onRegisterPayment={handleOpenPaymentModal}
                  canRegisterPaymentByStatus={canRegisterPaymentByStatus}
                  calculatePendingAmount={calculatePendingAmount}
                />
              </motion.div>

              {/* Mobile Card View */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="md:hidden"
              >
                <SalesCardView
                  sales={sales}
                  onRegisterPayment={handleOpenPaymentModal}
                  canRegisterPaymentByStatus={canRegisterPaymentByStatus}
                  calculatePendingAmount={calculatePendingAmount}
                />
              </motion.div>
            </>
          )}
        </>
      )}

      {/* Register Payment Modal */}
      {selectedSaleForPayment && (
        <RegisterPaymentModal
          open={isPaymentModalOpen}
          onOpenChange={handleClosePaymentModal}
          saleId={selectedSaleForPayment.saleId}
          pendingAmount={selectedSaleForPayment.pendingAmount}
          currency={selectedSaleForPayment.currency}
        />
      )}
    </div>
  );
}
