import { PageHeader } from '@/components/common/PageHeader';
import LeadSourcesTableSkeleton from './components/LeadSourcesTableSkeleton';

export default function Loading() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Fuentes de Bienvenidos"
        subtitle="Gestiona las fuentes de adquisición de leads"
        className="mb-6"
        variant="gradient"
      />
      <LeadSourcesTableSkeleton />
    </div>
  );
}
