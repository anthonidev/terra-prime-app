import { PageHeader } from '@components/common/PageHeader';
import { Suspense } from 'react';
import SupervisorData from './components/SupervisorData';
import TableSkeleton from './components/TableSkeleton';

interface Props {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SupervisorPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="container py-8">
      <PageHeader
        title="Pagos por supervisor"
        subtitle="pagos realizados por filtro de cobradores"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<TableSkeleton />}>
        <SupervisorData searchParams={params} />
      </Suspense>
    </div>
  );
}
