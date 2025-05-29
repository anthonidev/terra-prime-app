import { Suspense } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import LinersTableSkeleton from './components/LinersTableSkeleton';
import LinersData from './components/LinersData';

export default async function LinersPage({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = await searchParams;

  return (
    <div className="container py-8">
      <PageHeader
        title="Liners"
        subtitle="Gestiona los liners para la captación de leads"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<LinersTableSkeleton />}>
        <LinersData searchParams={filters} />
      </Suspense>
    </div>
  );
}
