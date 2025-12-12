'use client';

import { motion } from 'framer-motion';
import { useMyPaymentDetail } from '../../hooks/use-my-payment-detail';
import { PaymentDetailSkeleton } from '@/features/payments/components/skeletons/payment-detail-skeleton';
import { PaymentDetailError } from '@/features/payments/components/detail/payment-detail-error';
import { PaymentDetailHeader } from '../detail/my-payment-detail-header';
import { PaymentInfoSection } from '../detail/my-payment-info-section';
import { ClientLotSection } from '../detail/my-client-lot-section';
import { VouchersSection } from '../detail/my-vouchers-section';

interface MyPaymentDetailContainerProps {
  paymentId: string;
}

export function MyPaymentDetailContainer({ paymentId }: MyPaymentDetailContainerProps) {
  const { data: payment, isLoading, isError } = useMyPaymentDetail(paymentId);

  // Loading state
  if (isLoading) {
    return <PaymentDetailSkeleton />;
  }

  // Error state
  if (isError || !payment) {
    return <PaymentDetailError />;
  }

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
