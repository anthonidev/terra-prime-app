import { TableQueryPagination } from '@/components/common/table/TableQueryPagination';
import { getLeadSources } from '../action';
import CreateLeadSourceButton from './buttons/CreateLeadSourceButton';
import { LeadSourcesTableFilters } from './LeadSourcesTableFilters';
import LeadSourceTable from './LeadSourceTable';
import LeadSourceCards from './LeadSourceCards';
export default async function LeadSoucesData({
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

  const { data, meta } = await getLeadSources({
    search,
    isActive,
    order,
    page,
    limit
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <LeadSourcesTableFilters search={search} isActive={isActive} order={order} />
        <CreateLeadSourceButton />
      </div>
      <div className="hidden md:block">
        <LeadSourceTable data={data} />
      </div>
      <div className="md:hidden">
        <LeadSourceCards data={data} />
      </div>
      <TableQueryPagination meta={meta} />
    </div>
  );
}
