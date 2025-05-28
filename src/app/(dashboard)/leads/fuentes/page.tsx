import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import LeadSourcesTable from './components/LeadSoucesTable';
import LeadSourcesTableSkeleton from './components/LeadSourcesTableSkeleton';

export default async function LeadSourcesPage({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = await searchParams;
  return (
    <div className="container py-8">
      <PageHeader
        title="Fuentes de Bienvenidos"
        subtitle="Gestiona las fuentes de adquisición de leads"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<LeadSourcesTableSkeleton />}>
        <LeadSourcesTable searchParams={filters} />
      </Suspense>
    </div>
  );
}
