import { FinancingDetailContainer } from '@/features/sales/components/containers/financing-detail-container';

interface PageProps {
  params: Promise<{ id: string; financingId: string }>;
}

export default async function FinancingDetailPage({ params }: PageProps) {
  const { id, financingId } = await params;
  return <FinancingDetailContainer saleId={id} financingId={financingId} />;
}
