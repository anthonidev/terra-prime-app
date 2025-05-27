import { PageHeader } from '@/components/common/PageHeader';
import NewLeadSkeleton from './components/NewLeadSkeleton';

export default function Loading() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Nuevo Lead"
        subtitle="Registra un nuevo lead o actualiza uno existente"
        className="mb-6"
        variant="gradient"
        backUrl="/leads"
      />
      <NewLeadSkeleton />
    </div>
  );
}
