'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { usePaymentDetail } from '../../hooks/use-payment-detail';
import { PaymentDetailSkeleton } from '../skeletons/payment-detail-skeleton';
import { PaymentDetailError } from '../detail/payment-detail-error';
import { PaymentDetailHeader } from '../detail/payment-detail-header';
import { PaymentInfoSection } from '../detail/payment-info-section';
import { ClientLotSection } from '../detail/client-lot-section';
import { VouchersSection } from '../detail/vouchers-section';
import { PaymentActions } from '../detail/payment-actions';
import { CompletePaymentModal } from '../dialogs/complete-payment-modal';
import { StatusPayment } from '../../types';

interface PaymentDetailContainerProps {
  paymentId: string;
}

export function PaymentDetailContainer({ paymentId }: PaymentDetailContainerProps) {
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const { data: payment, isLoading, isError } = usePaymentDetail(paymentId);
  const { user } = useAuth();

  // Loading state
  if (isLoading) {
    return <PaymentDetailSkeleton />;
  }

  // Error state
  if (isError || !payment) {
    return <PaymentDetailError />;
  }

  // Check if user can approve/reject (role code "FAC" and status PENDING)
  const canReview = user?.role?.code === 'FAC' && payment.status === StatusPayment.PENDING;

  // Check if user can update approved payment (role code "FAC" and status APPROVED)
  const canUpdate = user?.role?.code === 'FAC' && payment.status === StatusPayment.APPROVED;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PaymentDetailHeader payment={payment} />
      </motion.div>

      {/* Actions (if applicable) */}
      {canReview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <PaymentActions paymentId={paymentId} />
        </motion.div>
      )}

      {/* Update Payment (if approved) */}
      {canUpdate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Actualizar Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Este pago ha sido aprobado. Puedes actualizar información adicional.
              </p>
              <Button onClick={() => setCompleteModalOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Actualizar Pago
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <PaymentInfoSection payment={payment} />
        </motion.div>

        {/* Client and Lot Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <ClientLotSection payment={payment} />
        </motion.div>

        {/* Vouchers Section - Full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <VouchersSection payment={payment} />
        </motion.div>
      </div>

      {/* Complete Payment Modal */}
      <CompletePaymentModal
        open={completeModalOpen}
        onOpenChange={setCompleteModalOpen}
        paymentId={paymentId}
      />
    </div>
  );
}
