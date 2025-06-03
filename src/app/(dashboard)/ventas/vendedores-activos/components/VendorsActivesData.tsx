import { Card, CardContent } from '@/components/ui/card';
import { getVendorsActives } from '../action';
import { VendorsActivesTableFilters } from './VendorsActivesTableFilters';
import VendorsActivesTable from './VendorsActivesTable';
import VendorsActivesCards from './VendorsActivesCard';

export default async function VendorsActivesData({
  searchParams
}: {
  searchParams?: {
    search?: string;
  };
}) {
  const search = searchParams?.search || '';

  const items = await getVendorsActives();

  const filteredItems = items.filter((item) => {
    const searchTerm = search.toLowerCase();
    return (
      item.firstName?.toLowerCase().includes(searchTerm) ||
      item.email?.toLowerCase().includes(searchTerm) ||
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
              <VendorsActivesTableFilters search={search} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="hidden md:block">
        <VendorsActivesTable data={filteredItems} />
      </div>
      <div className="md:hidden">
        <VendorsActivesCards data={filteredItems} />
      </div>
    </div>
  );
}
