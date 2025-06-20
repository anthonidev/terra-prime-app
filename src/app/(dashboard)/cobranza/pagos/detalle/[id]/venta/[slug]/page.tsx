import { Suspense } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import SkeletonData from './components/SkeletonData';
import Content from './components/Content';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const param = await params;
  return (
    <div className="container py-8">
      <PageHeader
        title="Detalle de pagos"
        subtitle="información de los pagos financiados y su administración"
        className="mb-6"
        variant="gradient"
        backUrl="/cobranza/clientes-asignados"
      />
      <Suspense fallback={<SkeletonData />}>
        <Content slug={param.slug} />
      </Suspense>
    </div>
  );
}
