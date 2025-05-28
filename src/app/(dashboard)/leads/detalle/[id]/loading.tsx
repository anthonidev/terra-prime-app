'use client';
import { PageHeader } from '@/components/common/PageHeader';
import { User } from 'lucide-react';
import LeadDetailSkeleton from './components/LeadDetailSkeleton';

export default function Loading() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Detalle de Lead"
        subtitle="Gestiona la información y visitas del lead"
        className="mb-6"
        variant="gradient"
        backUrl="/leads"
        icon={User}
      />
      <LeadDetailSkeleton />
    </div>
  );
}
