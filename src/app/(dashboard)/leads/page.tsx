import { Suspense } from 'react';
import { PageHeader } from '@/components/common/PageHeader';

import LeadsTableSkeleton from './components/LeadsTableSkeleton';
import LeadsData from './components/LeadsData';

export default async function LeadsPage({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = await searchParams;

  return (
    <div className="container py-8">
      <PageHeader
        title="Leads"
        subtitle="Gestiona los leads y sus visitas a la inmobiliaria"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<LeadsTableSkeleton />}>
        <LeadsData searchParams={filters} />
      </Suspense>
    </div>
  );
}
