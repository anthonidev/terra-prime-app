import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import DetalleData from './components/DetalleData';
import TableSkeleton from './components/TableSkeleton';

export default async function Page({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;

  return (
    <div className="container py-8">
      <PageHeader
        title="Lotes adquiridos"
        subtitle="Lista de sus lotes adquiridos de un cliente"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<TableSkeleton />}>
        <DetalleData id={id} />
      </Suspense>
    </div>
  );
}
