'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSaleDetailContainer } from '../../hooks/use-sale-detail-container';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { SaleDetailHeader } from '../displays/sale-detail-header';
import { SaleDetailInfo } from '../displays/sale-detail-info';
import { SalePaymentsTable } from '../tables/sale-payments-table';
import { SaleDetailSkeleton } from '../skeletons/sale-detail-skeleton';
import { PaymentSummaryHeader } from './components/payment-summary-header';
import { PaymentCardsView } from './components/payment-cards-view';
import { SaleDetailErrorState } from './components/sale-detail-error-state';
import { RegisterPaymentModal } from '../dialogs/register-payment-modal';
import { StatusSale } from '../../types';

interface SaleDetailContainerProps {
  id: string;
}

export function SaleDetailContainer({ id }: SaleDetailContainerProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const {
    sale,
    clientName,
    totalPaid,
    pendingAmount,
    maxPayableAmount,
    hasPayments,
    status,
    isLoading,
    isError,
  } = useSaleDetailContainer(id);

  const { user } = useAuth();

  // Loading state
  if (isLoading) {
    return <SaleDetailSkeleton />;
  }

  // Error state
  if (isError || !sale) {
    return <SaleDetailErrorState />;
  }

  // Check if user can register payment (must be VEN role)
  const canRegisterPayment = user?.role.code === 'VEN';

  // Determine if payment can be registered based on status
  const canPayByStatus = (() => {
    switch (status) {
      case StatusSale.RESERVATION_PENDING:
      case StatusSale.RESERVED:
      case StatusSale.PENDING:
        return true;
      default:
        return false;
    }
  })();

  // Show register payment button only if user is VEN, status allows it, and there's a payable amount
  const showRegisterPayment = canRegisterPayment && canPayByStatus && maxPayableAmount > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SaleDetailHeader
          clientName={clientName}
          status={status!}
          radicationPdfUrl={sale.radicationPdfUrl}
          paymentAcordPdfUrl={sale.paymentAcordPdfUrl}
        />
      </motion.div>

      {/* Payment Summary Header */}
      <PaymentSummaryHeader
        totalAmount={sale.totalAmount}
        totalPaid={totalPaid}
        pendingAmount={pendingAmount}
        paymentsCount={sale.paymentsSummary.length}
        currency={sale.currency}
        action={
          showRegisterPayment ? (
            <Button onClick={() => setIsPaymentModalOpen(true)}>
              Registrar Pago
            </Button>
          ) : undefined
        }
      />

      {/* Payments Table/Cards */}
      {hasPayments ? (
        <>
          {/* Desktop Table View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden md:block"
          >
            <SalePaymentsTable payments={sale.paymentsSummary} currency={sale.currency} />
          </motion.div>

          {/* Mobile Card View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="md:hidden"
          >
            <PaymentCardsView payments={sale.paymentsSummary} currency={sale.currency} />
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-32 rounded-lg border bg-muted/30">
                <p className="text-muted-foreground">No hay pagos registrados</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Sale Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <SaleDetailInfo sale={sale} />
      </motion.div>

      {/* Register Payment Modal */}
      {showRegisterPayment && (
        <RegisterPaymentModal
          open={isPaymentModalOpen}
          onOpenChange={setIsPaymentModalOpen}
          saleId={id}
          pendingAmount={maxPayableAmount}
          currency={sale.currency}
        />
      )}
    </div>
  );
}
