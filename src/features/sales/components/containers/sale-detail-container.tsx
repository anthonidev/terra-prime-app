'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSaleDetailContainer } from '../../hooks/use-sale-detail-container';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { SaleDetailHeader } from '../displays/sale-detail-header';
import { SaleDetailInfo } from '../displays/sale-detail-info';
import { SaleDetailSkeleton } from '../skeletons/sale-detail-skeleton';
import { PaymentSummaryHeader } from './components/payment-summary-header';
import { PaymentBreakdownCard } from './components/payment-breakdown-card';
import { FinancingInstallmentsView } from './components/financing-installments-view';
import { SaleDetailTabs } from './components/sale-detail-tabs';
import { SaleDetailErrorState } from './components/sale-detail-error-state';
import { RegisterPaymentModal } from '../dialogs/register-payment-modal';
import { ExtendReservationModal } from '../dialogs/extend-reservation-modal';
import { DeleteSaleModal } from '../dialogs/delete-sale-modal';
import { StatusSale, StatusPayment } from '../../types';

interface SaleDetailContainerProps {
  id: string;
}

export function SaleDetailContainer({ id }: SaleDetailContainerProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isExtendReservationModalOpen, setIsExtendReservationModalOpen] = useState(false);
  const [isDeleteSaleModalOpen, setIsDeleteSaleModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('payments');

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

  // Check if user is JVE (Sales Manager)
  const isJVE = user?.role.code === 'JVE';

  // Check if user is ADM (Administrator)
  const isADM = user?.role.code === 'ADM';

  // Check if user can register payment (must be VEN role)
  const canRegisterPayment = user?.role.code === 'VEN';

  // Determine if payment can be registered based on status
  const canPayByStatus = useMemo(() => {
    switch (status) {
      case StatusSale.RESERVATION_PENDING:
      case StatusSale.RESERVATION_IN_PAYMENT:
      case StatusSale.RESERVED:
      case StatusSale.PENDING:
      case StatusSale.IN_PAYMENT:
      case StatusSale.IN_PAYMENT_PROCESS:
        return true;
      default:
        return false;
    }
  }, [status]);

  // Show register payment button only if user is VEN, status allows it, and there's a payable amount
  const showRegisterPayment = canRegisterPayment && canPayByStatus && maxPayableAmount > 0;

  // Determine if reservation can be extended
  const canExtendReservation = useMemo(() => {
    if (!isJVE || !sale) return false;

    const reservationStatuses = [
      StatusSale.RESERVATION_PENDING,
      StatusSale.RESERVATION_PENDING_APPROVAL,
      StatusSale.RESERVED,
    ];

    return reservationStatuses.includes(status as StatusSale);
  }, [isJVE, status, sale]);

  // Determine if sale can be deleted
  const canDeleteSale = useMemo(() => {
    if (!isJVE || !sale) return false;

    // Check if there are any approved, completed, or pending payments
    const hasActivePayments = sale.paymentsSummary?.some(
      (payment) =>
        payment.status === StatusPayment.APPROVED ||
        payment.status === StatusPayment.PENDING ||
        payment.status === StatusPayment.COMPLETED
    );

    return !hasActivePayments;
  }, [isJVE, sale]);

  // Check if ADM can view financing detail
  const canViewFinancing = useMemo(() => {
    // Check if there's financing with lot data
    const hasFinancing = sale?.financing?.lot?.id;
    return isADM && hasFinancing;
  }, [isADM, sale]);

  // Get financing IDs for navigation
  const lotFinancingId = sale?.financing?.lot?.id;

  // Loading state
  if (isLoading) {
    return <SaleDetailSkeleton />;
  }

  // Error state
  if (isError || !sale) {
    return <SaleDetailErrorState />;
  }

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
          saleId={id}
          isADM={isADM}
          radicationPdfUrl={sale.radicationPdfUrl}
          paymentAcordPdfUrl={sale.paymentAcordPdfUrl}
        />
      </motion.div>

      {/* JVE Actions */}
      {(canExtendReservation || canDeleteSale) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle>Acciones de Gestión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row">
                {canExtendReservation && (
                  <Button
                    onClick={() => setIsExtendReservationModalOpen(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Extender Reserva
                  </Button>
                )}

                {canDeleteSale && (
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteSaleModalOpen(true)}
                    className="flex-1"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar Venta
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ADM Financing Actions */}
      {canViewFinancing && lotFinancingId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Administración de Financiamiento</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={`/ventas/detalle/${id}/financing/${lotFinancingId}`}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Ver Detalle de Financiamiento
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Payment Summary Header */}
      <PaymentSummaryHeader
        totalAmount={sale.totalAmount}
        totalPaid={totalPaid}
        pendingAmount={pendingAmount}
        paymentsCount={sale.paymentsSummary.length}
        currency={sale.currency}
        action={
          showRegisterPayment ? (
            <Button onClick={() => setIsPaymentModalOpen(true)}>Registrar Pago</Button>
          ) : undefined
        }
      />

      {/* Payment Breakdown */}
      <PaymentBreakdownCard sale={sale} />

      {/* Financing Installments (COB Role) */}
      <FinancingInstallmentsView saleId={id} />

      {/* Payments and Installments Tabs */}
      <SaleDetailTabs
        payments={sale.paymentsSummary}
        financing={sale.financing}
        currency={sale.currency}
        hasPayments={!!hasPayments}
        saleId={id}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        canRegisterInstallmentPayment={isADM}
      />

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

      {/* Extend Reservation Modal */}
      {canExtendReservation && (
        <ExtendReservationModal
          open={isExtendReservationModalOpen}
          onOpenChange={setIsExtendReservationModalOpen}
          saleId={id}
        />
      )}

      {/* Delete Sale Modal */}
      {canDeleteSale && (
        <DeleteSaleModal
          open={isDeleteSaleModalOpen}
          onOpenChange={setIsDeleteSaleModalOpen}
          saleId={id}
          clientName={clientName}
        />
      )}
    </div>
  );
}
