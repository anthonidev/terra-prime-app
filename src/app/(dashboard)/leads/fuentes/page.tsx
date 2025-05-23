import React from 'react';
import LeadSourcesTable from './components/LeadSoucesTable';
import { PageHeader } from '@/components/common/PageHeader';
export default function LeadSourcesPage() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Fuentes de Bienvenidos"
        subtitle="Gestiona las fuentes de adquisición de leads"
        className="mb-6"
        variant="gradient"
        actions={null}
        badge={null}
      />
      <LeadSourcesTable />
    </div>
  );
}
