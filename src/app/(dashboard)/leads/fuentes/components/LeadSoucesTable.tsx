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
import { LeadSourcesTableFilters } from './LeadSourcesTableFilters';
import { LeadSourcesTablePagination } from './LeadSourcesTablePagination';
import { getLeadSources } from '../action';
import CreateLeadSourceButton from './CreateLeadSourceButton';
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
  // Asegúrate de acceder directamente a los valores de searchParams
  const search = searchParams?.search || '';

  // Procesar isActive correctamente
  const isActive =
    searchParams?.isActive === 'true'
      ? true
      : searchParams?.isActive === 'false'
        ? false
        : undefined;

  // Asegúrate de que order sea ASC o DESC
  const order = (searchParams?.order === 'ASC' ? 'ASC' : 'DESC') as 'ASC' | 'DESC';

  // Convertir page y limit a números
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 10;

  console.log('Actual searchParams:', searchParams);
  console.log('Processed params for API call:', { search, isActive, order, page, limit });

  // Fetch data from the server with parameters
  const { data, meta, success } = await getLeadSources({
    search,
    isActive,
    order,
    page,
    limit
  });

  // Resto del componente...

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

      {data && (
        <LeadSourcesTablePagination
          data={{ data, meta, success }}
          currentPage={page}
          itemsPerPage={limit}
        />
      )}
    </div>
  );
}
