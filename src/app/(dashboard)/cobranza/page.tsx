import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import CobradoresData from './components/CobradoresData';
import CobradoresTableSkeleton from './components/TableSkeleton';

interface SearchParams {
  order?: string;
  page?: string;
  limit?: string;
}

interface CobranzaPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CobranzaPage({ searchParams }: CobranzaPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="container py-8">
      <PageHeader
        title="Asignación de cobradores"
        subtitle="asigna cobradores a un cliente"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<CobradoresTableSkeleton />}>
        <CobradoresData searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  );
}
