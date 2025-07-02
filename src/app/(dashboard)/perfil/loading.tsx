'use client';
import { PageHeader } from '@/components/common/PageHeader';
import LeadsTableSkeleton from '../leads/components/LeadsTableSkeleton';

export default function Loading() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Leads"
        subtitle="Gestiona los leads y sus visitas a la inmobiliaria"
        className="mb-6"
        variant="gradient"
      />
      <LeadsTableSkeleton />
    </div>
  );
}
