export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import NewLeadSkeleton from './components/NewLeadSkeleton';
import NewLeadContent from './components/NewLeadContent';

export default async function NewLeadPage() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Nuevo Lead"
        subtitle="Registra un nuevo lead o actualiza uno existente"
        className="mb-6"
        variant="gradient"
        backUrl="/leads"
      />

      <Suspense fallback={<NewLeadSkeleton />}>
        <NewLeadContent />
      </Suspense>
    </div>
  );
}
