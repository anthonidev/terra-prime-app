import { TableQueryPagination } from '@/components/common/table/TableQueryPagination';
import { Card, CardContent } from '@/components/ui/card';
import { getRoles, getUsers } from '../action';
// import LeadSourceCards from './LeadSourceCards';
import { UsersTableFilters } from './UsersTableFilters';
import UsersTable from './UsersTable';
import CreateUserButton from './buttons/CreateUserButton';
import UsersCards from './UsersCards';

export default async function UsersData({
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

  const [roles, { items, meta }] = await Promise.all([
    getRoles(),
    getUsers({ search, isActive, order, page, limit })
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <UsersTableFilters search={search} isActive={isActive} order={order} />
            </div>
            <div className="flex justify-end lg:ml-4">
              <CreateUserButton roles={roles} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="hidden md:block">
        <UsersTable data={items} roles={roles} />
      </div>
      <div className="md:hidden">
        <UsersCards users={items} roles={roles} />
      </div>

      <TableQueryPagination meta={meta} />
    </div>
  );
}
