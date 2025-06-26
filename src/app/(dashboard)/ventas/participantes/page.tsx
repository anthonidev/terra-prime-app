import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import ParticipantesData from './components/ParticipantesData';
import ParticipantesTableSkeleton from './components/ParticipantesTableSkeleton';

export default async function ParticipantesPage({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = await searchParams;

  return (
    <div className="container py-8">
      <PageHeader
        title="Participantes"
        subtitle="Gestiona los participantes del sistema"
        className="mb-6"
        variant="gradient"
      />

      <Suspense fallback={<ParticipantesTableSkeleton />}>
        <ParticipantesData searchParams={filters} />
      </Suspense>
    </div>
  );
}
