import { getPaymentsByCollector } from '@infrastructure/server-actions/cobranza.actions';
import { TableQueryPagination } from '@components/common/table/TableQueryPagination';
import { Card, CardContent } from '@/components/ui/card';
import PagosTable from './PagosTable';
import PagosCard from './PagosCard';
import PagosFilters from './PagosFilters';

interface PagosDataProps {
  searchParams?: {
    order?: string;
    page?: string;
    limit?: string;
    search?: string;
  };
}

export default async function PagosData({ searchParams }: PagosDataProps) {
  const params = {
    order: (searchParams?.order === 'ASC' ? 'ASC' : 'DESC') as 'ASC' | 'DESC',
    page: searchParams?.page ? parseInt(searchParams.page) : 1,
    limit: searchParams?.limit ? parseInt(searchParams.limit) : 10,
    search: searchParams?.search
  };

  const { items, meta } = await getPaymentsByCollector(params);

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <PagosFilters order={params.order} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="hidden md:block">
        <PagosTable data={items} />
      </div>
      <div className="md:hidden">
        <PagosCard data={items} />
      </div>

      <TableQueryPagination meta={meta} />
    </div>
  );
}
