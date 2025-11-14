import { PaymentDetailContainer } from '@/features/payments/components/containers/payment-detail-container';

interface PaymentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentDetailPage({ params }: PaymentDetailPageProps) {
  const { id } = await params;
  return <PaymentDetailContainer paymentId={id} />;
}
