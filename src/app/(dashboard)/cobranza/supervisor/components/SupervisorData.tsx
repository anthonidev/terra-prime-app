import { TableQueryPagination } from '@components/common/table/TableQueryPagination';
import { Card, CardContent } from '@components/ui/card';
import TableFilters from './TableFilters';
import { getPaymentsWithSupervisor } from '@infrastructure/server-actions/cobranza.actions';
import SupervisorTable from './SupervisorTable';
import SupervisorCards from './SupervisorCards';

interface Props {
  searchParams?: {
    order?: string;
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    collectorId?: string;
  };
}

export default async function SupervisorData({ searchParams }: Props) {
  const order = (searchParams?.order === 'ASC' ? 'ASC' : 'DESC') as 'ASC' | 'DESC';
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit, 10) : 10;
  const startDate = searchParams?.startDate;
  const endDate = searchParams?.endDate;
  const collectorId = searchParams?.collectorId;

  const validPage = isNaN(page) || page < 1 ? 1 : page;
  const validLimit = isNaN(limit) || limit < 1 || limit > 100 ? 10 : limit;

  const { items, meta } = await getPaymentsWithSupervisor({
    order,
    page: validPage,
    limit: validLimit,
    startDate,
    endDate,
    collectorId
  });

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <TableFilters
                order={order}
                startDate={startDate}
                endDate={endDate}
                collectorId={collectorId}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="hidden md:block">
        <SupervisorTable data={items} />
      </div>
      <div className="md:hidden">
        <SupervisorCards data={items} />
      </div>

      <TableQueryPagination meta={meta} />
    </div>
  );
}
