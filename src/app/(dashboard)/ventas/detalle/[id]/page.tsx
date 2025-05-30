import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import SaleDetailContent from './components/SaleDetailContent';
import SaleDetailSkeleton from './components/SaleDetailSkeleton';

interface SaleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SaleDetailPage({ params }: SaleDetailPageProps) {
  const { id } = await params;

  return (
    <div className="container py-8">
      <PageHeader
        title="Detalle de Venta"
        subtitle="Gestiona la información de la venta y sus pagos"
        className="mb-6"
        variant="gradient"
        backUrl="/ventas"
      />

      <Suspense fallback={<SaleDetailSkeleton />}>
        <SaleDetailContent saleId={id} />
      </Suspense>
    </div>
  );
}
