'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { usePaymentDetail } from '../../hooks/use-payment-detail';
import { PaymentDetailSkeleton } from '../skeletons/payment-detail-skeleton';
import { PaymentDetailError } from '../detail/payment-detail-error';
import { PaymentDetailHeader } from '../detail/payment-detail-header';
import { PaymentInfoSection } from '../detail/payment-info-section';
import { ClientLotSection } from '../detail/client-lot-section';
import { VouchersSection } from '../detail/vouchers-section';
import { PaymentActions } from '../detail/payment-actions';

interface PaymentDetailContainerProps {
  paymentId: string;
}

export function PaymentDetailContainer({ paymentId }: PaymentDetailContainerProps) {
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
  const canReview = user?.role?.code === 'FAC' && payment.status === 'PENDING';

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
    </div>
  );
}
