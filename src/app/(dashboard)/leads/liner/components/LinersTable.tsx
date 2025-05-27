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
import { getLiners } from '../action';
import { User } from 'lucide-react';
import { LinersTableFilters } from './LinersTableFilters';
import { LinersTablePagination } from './LinersTablePagination';
import CreateLinerButton from './CreateLinerButton';
import UpdateLinerButton from './UpdateLinerButton';

export default async function LinersTable({
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
  // Procesar parámetros de búsqueda
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

  // Obtener datos del servidor
  const { data, meta, success } = await getLiners({
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

      <div className="border-border rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead className="text-table-header-foreground">Nombre completo</TableHead>
              <TableHead className="text-table-header-foreground">Documento</TableHead>
              <TableHead className="text-table-header-foreground">Tipo</TableHead>
              <TableHead className="text-table-header-foreground">Estado</TableHead>
              <TableHead className="text-table-header-foreground">Fecha de creación</TableHead>
              <TableHead className="text-table-header-foreground text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((liner) => (
                <TableRow key={liner.id} className="bg-table-row hover:bg-table-row-hover">
                  <TableCell className="text-table-row-foreground font-medium">
                    <div className="flex items-center">
                      <User className="text-primary/70 mr-2 h-4 w-4" />
                      {liner.firstName} {liner.lastName}
                    </div>
                  </TableCell>
                  <TableCell className="text-table-row-foreground">{liner.document}</TableCell>
                  <TableCell className="text-table-row-foreground">
                    <Badge variant="outline" className="bg-secondary/30">
                      {liner.documentType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-table-row-foreground">
                    <Badge variant={liner.isActive ? 'default' : 'destructive'}>
                      {liner.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-table-row-foreground">
                    {format(new Date(liner.createdAt), 'PPP', { locale: es })}
                  </TableCell>
                  <TableCell className="text-table-row-foreground text-right">
                    <UpdateLinerButton liner={liner} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="bg-table-empty-background text-table-empty-foreground h-24 text-center"
                >
                  No se encontraron liners.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && (
        <LinersTablePagination
          data={{ data, meta, success }}
          currentPage={page}
          itemsPerPage={limit}
        />
      )}
    </div>
  );
}
