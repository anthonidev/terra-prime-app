import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import LeadSourcesTableSkeleton from './components/LeadSourcesTableSkeleton';
import LeadSoucesData from './components/LeadSoucesData';

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
        <LeadSoucesData searchParams={filters} />
      </Suspense>
    </div>
  );
}
