import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import BienvenidosData from './components/BienvenidosData';
import BienvenidosTableSkeleton from './components/BienvenidosTableSkeleton';

export default async function BienvenidosPage({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = await searchParams;

  return (
    <div className="container py-8">
      <PageHeader
        title="Bienvenidos del día"
        subtitle="Gestiona los leads del día y asigna vendedores"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<BienvenidosTableSkeleton />}>
        <BienvenidosData searchParams={filters} />
      </Suspense>
    </div>
  );
}
