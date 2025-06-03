'use server';

import { TableSkeleton } from '@components/common/table/TableSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import { getLeadsVendor } from './action';
import { Card, CardContent } from '@/components/ui/card';
import { LeadsVendorTableFilters } from './components/LeadsVendorTableFilters';
import LeadsVendorTable from './components/LeadsVendorTable';
import LeadsVendorCard from './components/LeadsVendorCard';

export default async function LeadsVendorPage({
  searchParams
}: {
  searchParams?: {
    search?: string;
  };
}) {
  const search = searchParams?.search || '';
  const items = await getLeadsVendor();

  const filteredItems = items.filter((item) => {
    const searchTerm = search.toLowerCase();
    return (
      item.firstName?.toLowerCase().includes(searchTerm) ||
      item.document?.toLowerCase().includes(searchTerm) ||
      false
    );
  });
  return (
    <div className="container pt-8">
      <PageHeader
        title="Bienvenidos asignados"
        subtitle="Lista de bienvenidos asignados"
        variant="default"
      />
      <Suspense fallback={<TableSkeleton />}>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <LeadsVendorTableFilters search={search} />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="hidden md:block">
            <LeadsVendorTable data={filteredItems} />
          </div>
          <div className="md:hidden">
            <LeadsVendorCard data={filteredItems} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
