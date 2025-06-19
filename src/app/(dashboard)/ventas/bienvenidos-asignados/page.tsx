import { TableSkeleton } from '@components/common/table/TableSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import LeadsVendorData from './components/LeadsVendorData';

export default async function LeadsVendorPage({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = await searchParams;

  return (
    <div className="container pt-8">
      <PageHeader
        title="Bienvenidos asignados"
        subtitle="Lista de bienvenidos asignados"
        variant="default"
      />
      <Suspense fallback={<TableSkeleton />}>
        <LeadsVendorData searchParams={filters} />
      </Suspense>
    </div>
  );
}
