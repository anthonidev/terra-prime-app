'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, FileEdit } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/common/page-header';
import { useAuth } from '@/features/auth/hooks/use-auth';

import { useFinancingDetail } from '../../hooks/use-financing-detail';
import { useAmendment } from '../../hooks/use-amendment';
import { FinancingSaleInfo } from '../displays/financing-sale-info';
import { FinancingSummaryInfo } from '../displays/financing-summary-info';
import { InstallmentsTable } from '../tables/installments-table';
import { AmendmentInstallmentsTable } from '../tables/amendment-installments-table';
import { FinancingDetailSkeleton } from '../skeletons/financing-detail-skeleton';

interface FinancingDetailContainerProps {
  saleId: string;
  financingId: string;
}

export function FinancingDetailContainer({ saleId, financingId }: FinancingDetailContainerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data, isLoading, isError } = useFinancingDetail(saleId, financingId);

  // Check if user is ADM (Administrator)
  const isADM = user?.role.code === 'ADM';

  // Amendment hook (initialized with empty financing, will be updated when data loads)
  const amendment = useAmendment({
    saleId,
    financingId,
    financing: data?.financing || {
      id: '',
      financingType: '',
      initialAmount: 0,
      initialAmountPaid: 0,
      initialAmountPending: 0,
      interestRate: 0,
      quantityCoutes: 0,
      totalCouteAmount: 0,
      totalPaid: 0,
      totalPending: 0,
      totalLateFee: 0,
      totalLateFeeePending: 0,
      totalLateFeePaid: 0,
      installments: [],
    },
  });

  const handleGoBack = () => {
    router.back();
  };

  // Loading state
  if (isLoading) {
    return <FinancingDetailSkeleton />;
  }

  // Error state
  if (isError || !data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="bg-destructive/10 border-destructive/20 flex h-64 items-center justify-center rounded-lg border">
          <div className="text-center">
            <p className="text-destructive font-medium">Error al cargar el financiamiento</p>
            <p className="text-muted-foreground mt-1 text-sm">
              No se pudo obtener la información del financiamiento
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { sale, financing } = data;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button variant="ghost" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PageHeader
          title="Detalle de Financiamiento"
          description={`Financiamiento de ${sale.client.fullName}`}
          icon={CreditCard}
        >
          {isADM && !amendment.isAmendmentMode && (
            <Button onClick={amendment.startAmendmentMode} variant="outline">
              <FileEdit className="mr-2 h-4 w-4" />
              Preparar Adenda
            </Button>
          )}
        </PageHeader>
      </motion.div>

      {/* Sale Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <FinancingSaleInfo sale={sale} />
      </motion.div>

      {/* Financing Summary (hidden in amendment mode) */}
      {!amendment.isAmendmentMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <FinancingSummaryInfo financing={financing} />
        </motion.div>
      )}

      {/* Installments Table or Amendment Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {amendment.isAmendmentMode ? (
          <AmendmentInstallmentsTable
            installments={amendment.installments}
            additionalAmount={amendment.additionalAmount}
            totalPaidAmount={amendment.totalPaidAmount}
            expectedTotal={amendment.expectedTotal}
            pendingInstallmentsTotal={amendment.pendingInstallmentsTotal}
            isBalanceValid={amendment.isBalanceValid}
            balanceDifference={amendment.balanceDifference}
            isSaving={amendment.isSaving}
            onAddInstallments={amendment.addInstallments}
            onUpdateInstallment={amendment.updateInstallment}
            onDeleteInstallment={amendment.deleteInstallment}
            onClearPendingInstallments={amendment.clearPendingInstallments}
            onSetAdditionalAmount={amendment.setAdditionalAmount}
            onSave={amendment.saveAmendment}
            onCancel={amendment.cancelAmendmentMode}
          />
        ) : (
          <InstallmentsTable installments={financing.installments} />
        )}
      </motion.div>
    </div>
  );
}
