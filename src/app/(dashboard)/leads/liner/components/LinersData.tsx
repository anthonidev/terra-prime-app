import { TableQueryPagination } from '@/components/common/table/TableQueryPagination';
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
      <div className="flex items-center justify-between">
        <LinersTableFilters search={search} isActive={isActive} order={order} />
        <CreateLinerButton />
      </div>

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
