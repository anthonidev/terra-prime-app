import { PageHeader } from '@/components/common/PageHeader';
import ParticipantesTableSkeleton from './components/ParticipantesTableSkeleton';

export default function Loading() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Participantes"
        subtitle="Gestiona los participantes del sistema"
        className="mb-6"
        variant="gradient"
      />
      <ParticipantesTableSkeleton />
    </div>
  );
}
