import { TableQueryPagination } from '@/components/common/table/TableQueryPagination';
import { getLeads } from '../action';
import CreateLeadButton from './buttons/CreateLeadButton';
import LeadCards from './LeadCards';
import LeadsTable from './LeadsTable';
import { LeadsTableFilters } from './LeadsTableFilters';

export default async function LeadsData({
  searchParams
}: {
  searchParams?: {
    search?: string;
    isInOffice?: string;
    startDate?: string;
    endDate?: string;
    order?: string;
    page?: string;
    limit?: string;
  };
}) {
  const search = searchParams?.search || '';

  const isInOffice =
    searchParams?.isInOffice === 'true'
      ? true
      : searchParams?.isInOffice === 'false'
        ? false
        : undefined;

  const startDate = searchParams?.startDate || undefined;
  const endDate = searchParams?.endDate || undefined;
  const order = (searchParams?.order === 'ASC' ? 'ASC' : 'DESC') as 'ASC' | 'DESC';
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;

  const { data, meta } = await getLeads({
    search,
    isInOffice,
    startDate,
    endDate,
    order,
    page,
    limit
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <LeadsTableFilters
          search={search}
          isInOffice={isInOffice}
          startDate={startDate}
          endDate={endDate}
          order={order}
        />
        <CreateLeadButton />
      </div>
      <div className="hidden md:block">
        <LeadsTable data={data} />
      </div>
      <div className="md:hidden">
        <LeadCards data={data} />
      </div>

      <TableQueryPagination meta={meta} />
    </div>
  );
}
