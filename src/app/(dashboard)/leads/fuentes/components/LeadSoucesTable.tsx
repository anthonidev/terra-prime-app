import { TableQueryPagination } from '@/components/common/table/TableQueryPagination';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getLeadSources } from '../action';
import CreateLeadSourceButton from './CreateLeadSourceButton';
import { LeadSourcesTableFilters } from './LeadSourcesTableFilters';
import UpdateLeadSourceButton from './UpdateLeadSourceButton';
export default async function LeadSourcesTable({
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

      <div className="border-border rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead className="text-table-header-foreground">ID</TableHead>
              <TableHead className="text-table-header-foreground">Nombre</TableHead>
              <TableHead className="text-table-header-foreground">Estado</TableHead>
              <TableHead className="text-table-header-foreground">Fecha de creación</TableHead>
              <TableHead className="text-table-header-foreground text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((source) => (
                <TableRow key={source.id} className="bg-table-row hover:bg-table-row-hover">
                  <TableCell className="text-table-row-foreground">{source.id}</TableCell>
                  <TableCell className="text-table-row-foreground font-medium">
                    {source.name}
                  </TableCell>
                  <TableCell className="text-table-row-foreground">
                    <Badge variant={source.isActive ? 'default' : 'destructive'}>
                      {source.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-table-row-foreground">
                    {format(new Date(source.createdAt), 'PPP', { locale: es })}
                  </TableCell>
                  <TableCell className="text-table-row-foreground text-right">
                    <UpdateLeadSourceButton source={source} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="bg-table-empty-background text-table-empty-foreground h-24 text-center"
                >
                  No se encontraron fuentes de leads.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TableQueryPagination meta={meta} />
    </div>
  );
}
