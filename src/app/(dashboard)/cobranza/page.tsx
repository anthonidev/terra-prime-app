import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import CobradoresData from './components/CobradoresData';
import CobradoresTableSkeleton from './components/TableSkeleton';

export default async function Page({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = await searchParams;

  return (
    <div className="container py-8">
      <PageHeader
        title="Clientes"
        subtitle="Lorem ipsum dolor amet sit dom"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<CobradoresTableSkeleton />}>
        <CobradoresData searchParams={filters} />
      </Suspense>
    </div>
  );
}
