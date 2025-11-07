import { AvailableLotsContainer } from '@/features/sales/components/containers/available-lots-container';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AvailableLotsDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <AvailableLotsContainer projectId={id} />;
}
