import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import PagosData from './components/PagosData';
import TableSkeleton from './components/TableSkeleton';

export default async function Page() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Pagos"
        subtitle="todos los pagos realizados por un cobrador"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<TableSkeleton />}>
        <PagosData />
      </Suspense>
    </div>
  );
}
