'use client';

import { PageHeader } from '@/components/common/PageHeader';
import VendorsActivesTable from '../components/VendorsActivesTable';
import { useVendors } from '../hooks/useVendors';
import { User } from 'lucide-react';
export default function VendorsActivesPage() {
  const { data, isLoading, error, refresh } = useVendors();
  return (
    <div className="container pt-8">
      <PageHeader
        icon={User}
        title="Vendedores activos"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        variant="default"
      />
      <VendorsActivesTable data={data} isLoading={isLoading} error={error} onRefresh={refresh} />
    </div>
  );
}
