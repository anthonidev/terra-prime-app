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
import { getLeads } from '../action';
import { User, Phone, Mail, Building, MapPin, Clock } from 'lucide-react';
import { LeadsTableFilters } from './LeadsTableFilters';
import { LeadsTablePagination } from './LeadsTablePagination';
import CreateLeadButton from './CreateLeadButton';
import LeadActionsButton from './LeadActionsButton';

export default async function LeadsTable({
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
  // Procesar parámetros de búsqueda
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

  // Obtener datos del servidor
  const { data, meta, success } = await getLeads({
    search,
    isInOffice,
    startDate,
    endDate,
    order,
    page,
    limit
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const hasContactInfo = (lead: any) => {
    return lead.email || lead.phone || lead.phone2;
  };

  const getLatestVisit = (lead: any) => {
    if (!lead.visits || lead.visits.length === 0) return null;
    return lead.visits.sort(
      (a: any, b: any) => new Date(b.arrivalTime).getTime() - new Date(a.arrivalTime).getTime()
    )[0];
  };

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

      <div className="border-border rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead className="text-table-header-foreground">Información</TableHead>
              <TableHead className="text-table-header-foreground">Documento</TableHead>
              <TableHead className="text-table-header-foreground">Contacto</TableHead>
              <TableHead className="text-table-header-foreground">Fuente</TableHead>
              <TableHead className="text-table-header-foreground">Estado</TableHead>
              <TableHead className="text-table-header-foreground">Fecha</TableHead>
              <TableHead className="text-table-header-foreground text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((lead) => {
                const latestVisit = getLatestVisit(lead);

                return (
                  <TableRow
                    key={lead.id}
                    className={`bg-table-row hover:bg-table-row-hover ${
                      lead.isInOffice ? 'bg-green-50/50 dark:bg-green-950/20' : ''
                    }`}
                  >
                    <TableCell className="text-table-row-foreground font-medium">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                          <User className="text-primary h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {lead.age ? `${lead.age} años` : 'Edad no registrada'}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-table-row-foreground">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{lead.document}</span>
                        <span className="text-muted-foreground text-xs">{lead.documentType}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-table-row-foreground">
                      {hasContactInfo(lead) ? (
                        <div className="flex flex-col gap-1">
                          {lead.phone && (
                            <div className="flex items-center gap-1 text-xs">
                              <Phone className="text-muted-foreground h-3 w-3" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                          {lead.email && (
                            <div className="flex items-center gap-1 text-xs">
                              <Mail className="text-muted-foreground h-3 w-3" />
                              <span className="max-w-[130px] truncate">{lead.email}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">Sin datos de contacto</span>
                      )}
                    </TableCell>

                    <TableCell className="text-table-row-foreground">
                      {lead.source ? (
                        <div className="flex items-center gap-1">
                          <Building className="text-primary h-3.5 w-3.5" />
                          <span className="text-sm">{lead.source.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">No especificada</span>
                      )}
                    </TableCell>

                    <TableCell className="text-table-row-foreground">
                      {lead.isInOffice ? (
                        <div>
                          <Badge className="border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/40 dark:text-green-300">
                            <MapPin className="mr-1 h-3 w-3" />
                            En oficina
                          </Badge>
                          {latestVisit && (
                            <div className="text-muted-foreground mt-1 flex items-center text-xs">
                              <Clock className="mr-1 h-3 w-3" />
                              {format(new Date(latestVisit.arrivalTime), 'HH:mm', { locale: es })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="mr-1 h-3 w-3" />
                          No en oficina
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-table-row-foreground">
                      <div className="text-sm">{formatDate(lead.createdAt)}</div>
                    </TableCell>

                    <TableCell className="text-table-row-foreground text-right">
                      <LeadActionsButton lead={lead} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="bg-table-empty-background text-table-empty-foreground h-24 text-center"
                >
                  No se encontraron leads.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && (
        <LeadsTablePagination
          data={{ data, meta, success }}
          currentPage={page}
          itemsPerPage={limit}
        />
      )}
    </div>
  );
}
