'use client';

import { PageHeader } from '@/components/common/PageHeader';
import LeadsVendorTable from '../components/LeadsVendorTable';
import { useLeadsVendor } from '../hooks/useLeadsVendor';
import { User } from 'lucide-react';

export default function LeadsVendorPage() {
  const { data, isLoading, error, refresh } = useLeadsVendor();
  return (
    <div className="container pt-8">
      <PageHeader
        icon={User}
        title="Bienvenidos asignados"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        variant="default"
      />
      <LeadsVendorTable data={data} isLoading={isLoading} error={error} onRefresh={refresh} />
    </div>
  );
}
