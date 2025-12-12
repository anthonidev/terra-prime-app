import { MyPaymentDetailContainer } from '@/features/collections/components/containers/my-payment-detail-container';

interface MyPaymentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MyPaymentDetailPage({ params }: MyPaymentDetailPageProps) {
  const { id } = await params;
  return <MyPaymentDetailContainer paymentId={id} />;
}
