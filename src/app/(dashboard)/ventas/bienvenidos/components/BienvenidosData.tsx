import { TableQueryPagination } from '@/components/common/table/TableQueryPagination';
import { Card, CardContent } from '@/components/ui/card';
import { getLeadsOfDay } from '@infrastructure/server-actions/sales.actions';
import BienvenidosTable from './BienvenidosTable';
import BienvenidosTableFilters from './BienvenidosTableFilters';
import BienvenidosCards from './BienvenidosCards';

export default async function BienvenidosData({
  searchParams
}: {
  searchParams?: {
    order?: string;
    page?: string;
    limit?: string;
  };
}) {
  const order = (searchParams?.order === 'ASC' ? 'ASC' : 'DESC') as 'ASC' | 'DESC';
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;

  const { items, meta } = await getLeadsOfDay({
    order,
    page,
    limit
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <BienvenidosTableFilters order={order} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="hidden md:block">
        <BienvenidosTable data={items} />
      </div>
      <div className="md:hidden">
        <BienvenidosCards data={items} />
      </div>

      <TableQueryPagination meta={meta} />
    </div>
  );
}
