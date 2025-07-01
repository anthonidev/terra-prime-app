import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import PagosData from './components/PagosData';
import TableSkeleton from './components/TableSkeleton';

interface SearchParams {
  order?: string;
  page?: string;
  limit?: string;
  search?: string;
}

interface PagosPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function PagosPage({ searchParams }: PagosPageProps) {
  const filters = await searchParams;

  return (
    <div className="container py-8">
      <PageHeader
        title="Pagos"
        subtitle="Todos los pagos realizados por cobradores"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<TableSkeleton />}>
        <PagosData searchParams={filters} />
      </Suspense>
    </div>
  );
}
