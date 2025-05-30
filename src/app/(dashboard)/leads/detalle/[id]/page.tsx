import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import LeadDetailContent from './components/LeadDetailContent';
import LeadDetailSkeleton from './components/LeadDetailSkeleton';

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;

  return (
    <div className="container py-8">
      <PageHeader
        title="Detalle de Lead"
        subtitle="Gestiona la información y visitas del lead"
        className="mb-6"
        variant="gradient"
        backUrl="/leads"
      />

      <Suspense fallback={<LeadDetailSkeleton />}>
        <LeadDetailContent leadId={id} />
      </Suspense>
    </div>
  );
}
