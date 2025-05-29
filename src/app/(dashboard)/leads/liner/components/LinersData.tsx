import { TableQueryPagination } from '@/components/common/table/TableQueryPagination';
import { Card, CardContent } from '@/components/ui/card';
import { getLiners } from '../action';
import { LinersTableFilters } from './LinersTableFilters';
import LinnerCards from './LinnerCards';
import LinnerTable from './LinnerTable';
import CreateLinerButton from './buttons/CreateLinerButton';

export default async function LinersData({
  searchParams
}: {
  searchParams?: {
    search?: string;
    isActive?: string;
    order?: string;
    page?: string;
    limit?: string;
  };
}) {
  const search = searchParams?.search || '';

  const isActive =
    searchParams?.isActive === 'true'
      ? true
      : searchParams?.isActive === 'false'
        ? false
        : undefined;

  const order = (searchParams?.order === 'ASC' ? 'ASC' : 'DESC') as 'ASC' | 'DESC';
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;

  const { data, meta } = await getLiners({
    search,
    isActive,
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
              <LinersTableFilters search={search} isActive={isActive} order={order} />
            </div>
            <div className="flex justify-end lg:ml-4">
              <CreateLinerButton />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="hidden md:block">
        <LinnerTable data={data} />
      </div>
      <div className="md:hidden">
        <LinnerCards data={data} />
      </div>

      <TableQueryPagination meta={meta} />
    </div>
  );
}
