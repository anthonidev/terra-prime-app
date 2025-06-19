import { Card, CardContent } from '@/components/ui/card';
import { getLeadsVendor } from '@infrastructure/server-actions/sales.actions';
import { LeadsVendorTableFilters } from './LeadsVendorTableFilters';
import LeadsVendorTable from './LeadsVendorTable';
import LeadsVendorCard from './LeadsVendorCard';

export default async function LeadsVendorData({
  searchParams
}: {
  searchParams?: {
    search?: string;
  };
}) {
  const search = searchParams?.search || '';

  const items = await getLeadsVendor();

  const filteredItems = items.filter((item) => {
    const searchTerm = search?.toLowerCase();
    return (
      item.firstName?.toLowerCase().includes(searchTerm) ||
      item.document?.toLowerCase().includes(searchTerm) ||
      false
    );
  });

  return (
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
  );
}
