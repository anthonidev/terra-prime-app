import { PageHeader } from '@components/common/PageHeader';
import { Suspense } from 'react';
import TableSkeleton from './components/TableSkeleton';
import UsersData from './components/UsersData';

export default async function Usuarios({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = await searchParams;
  return (
    <div className="container py-8">
      <PageHeader title="Usuarios" subtitle="Gestiona los usuarios del sistema" variant="default" />
      <Suspense fallback={<TableSkeleton />}>
        <UsersData searchParams={filters} />
      </Suspense>
    </div>
  );
}
