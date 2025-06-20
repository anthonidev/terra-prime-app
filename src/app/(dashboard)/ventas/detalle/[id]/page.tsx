import { PageHeader } from '@components/common/PageHeader';
import { Suspense } from 'react';
import SaleDetailSkeleton from './components/SaleDetailSkeleton';
import SaleNotFound from './components/SaleNotFound';
import SaleDetailHeader from './components/SaleDetailHeader';
import SaleGeneralInfo from './components/SaleGeneralInfo';
import SaleFinancingInfo from './components/SaleFinancingInfo';
import { getSaleDetail } from '@infrastructure/server-actions/sales.actions';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SaleDetailPage({ params }: Props) {
  const { id } = await params;

  const data = await getSaleDetail(id);

  if (!data) return <SaleNotFound saleId={id} />;

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
        <div className="space-y-6">
          <SaleDetailHeader sale={data} />
          {data.financing && <SaleFinancingInfo sale={data} />}
          <SaleGeneralInfo sale={data} />
        </div>
      </Suspense>
    </div>
  );
}
