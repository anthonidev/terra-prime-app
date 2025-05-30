import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import VentasData from './components/VentasData';
import VentasTableSkeleton from './components/VentasTableSkeleton';

export default async function VentasPage({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = await searchParams;

  return (
    <div className="container py-8">
      <PageHeader
        title="Ventas"
        subtitle="Gestiona las ventas y pagos realizados"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<VentasTableSkeleton />}>
        <VentasData searchParams={filters} />
      </Suspense>
    </div>
  );
}
