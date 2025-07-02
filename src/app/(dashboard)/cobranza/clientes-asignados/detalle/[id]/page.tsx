import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import DetalleData from './components/DetalleData';
import TableSkeleton from './components/TableSkeleton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) throw new Error('ID de cliente inválido');

  return (
    <div className="container py-8">
      <PageHeader
        title="Lotes adquiridos"
        subtitle="Lista de sus lotes adquiridos de un cliente"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<TableSkeleton />}>
        <DetalleData id={numericId} />
      </Suspense>
    </div>
  );
}
