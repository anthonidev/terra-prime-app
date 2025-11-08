import { PaymentDetailContainer } from '@/features/payments/components/containers/payment-detail-container';

interface PaymentDetailPageProps {
  params: {
    id: string;
  };
}

export default function PaymentDetailPage({ params }: PaymentDetailPageProps) {
  return <PaymentDetailContainer paymentId={params.id} />;
}
