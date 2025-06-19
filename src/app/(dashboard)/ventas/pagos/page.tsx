import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import PagosData from './components/PagosData';
import PagosTableSkeleton from './components/PagosTableSkeleton';

export default async function PagosPage({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = await searchParams;

  return (
    <div className="container py-8">
      <PageHeader
        title="Pagos"
        subtitle="Gestiona la aprobacion de pagos"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<PagosTableSkeleton />}>
        <PagosData searchParams={filters} />
      </Suspense>
    </div>
  );
}
