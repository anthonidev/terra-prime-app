import { TableQueryPagination } from '@/components/common/table/TableQueryPagination';
import { Card, CardContent } from '@/components/ui/card';
import VentasTableFilters from './VentasTableFilters';
import VentasTable from './VentasTable';
import VentasCards from './VentasCards';
import { getSaleList } from '@infrastructure/server-actions/sales.actions';

export default async function VentasData({
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

  const { items, meta } = await getSaleList({
    order,
    page,
    limit
  });

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <VentasTableFilters order={order} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="hidden md:block">
        <VentasTable data={items} />
      </div>

      <div className="md:hidden">
        <VentasCards data={items} />
      </div>

      <TableQueryPagination meta={meta} />
    </div>
  );
}
