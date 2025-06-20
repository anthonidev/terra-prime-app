export const dynamic = 'force-dynamic';

import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import MisClientesData from './components/MisClientesData';
import TableSkeleton from './components/TableSkeleton';

export default async function Page() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Clientes Asignados"
        subtitle="clientes asignados a un cobrador"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<TableSkeleton />}>
        <MisClientesData />
      </Suspense>
    </div>
  );
}
