import { TableQueryPagination } from '@/components/common/table/TableQueryPagination';
import { Card, CardContent } from '@/components/ui/card';
import { getLeadSources } from '../action';
import CreateLeadSourceButton from './buttons/CreateLeadSourceButton';
import LeadSourceCards from './LeadSourceCards';
import { LeadSourcesTableFilters } from './LeadSourcesTableFilters';
import LeadSourceTable from './LeadSourceTable';

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
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <LeadSourcesTableFilters search={search} isActive={isActive} order={order} />
            </div>
            <div className="flex justify-end lg:ml-4">
              <CreateLeadSourceButton />
            </div>
          </div>
        </CardContent>
      </Card>

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
