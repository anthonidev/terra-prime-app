import { SaleDetailContainer } from '@/features/sales/components/containers/sale-detail-container';

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SaleDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <SaleDetailContainer id={id} />;
}
