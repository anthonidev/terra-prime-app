import { PageHeader } from '@components/common/PageHeader';
import { TableSkeleton } from '@components/common/table/TableSkeleton';
import { Suspense } from 'react';
import VendorsActivesData from './components/VendorsActivesData';

export default async function VendorsActives({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = await searchParams;

  return (
    <div className="container pt-8">
      <PageHeader
        title="Vendedores Activos"
        subtitle="Lista los vendedores activos en el sistema"
        variant="default"
      />

      <Suspense fallback={<TableSkeleton />}>
        <VendorsActivesData searchParams={filters} />
      </Suspense>
    </div>
  );
}
