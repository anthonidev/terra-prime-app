'use client';
import { Lead } from '@/types/leads.types';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { es } from 'date-fns/locale';
import TableTemplate from '@/components/common/table/TableTemplate';
import LeadActionsButton from './buttons/LeadActionsButton';
import { Badge } from '@/components/ui/badge';
import { Building, Clock, Mail, MapPin, Phone, User } from 'lucide-react';
type Props = {
  data: Lead[];
};

const LeadsTable = ({ data }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    age: true,
    documentType: false,
    phone2: false
  });
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const hasContactInfo = (lead: Lead) => {
    return lead.email || lead.phone || lead.phone2;
  };

  const getLatestVisit = (lead: Lead) => {
    if (!lead.visits || lead.visits.length === 0) return null;
    return lead.visits.sort(
      (a, b) => new Date(b.arrivalTime).getTime() - new Date(a.arrivalTime).getTime()
    )[0];
  };
  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div className="text-sm font-medium">#{row.getValue('id')}</div>,
        enableHiding: true
      },
      {
        id: 'information',
        header: 'Información',
        cell: ({ row }) => {
          const lead = row.original;
          return (
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
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'firstName',
        header: 'Nombre',
        cell: ({ row }) => <div className="text-sm">{row.getValue('firstName')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'lastName',
        header: 'Apellido',
        cell: ({ row }) => <div className="text-sm">{row.getValue('lastName')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'age',
        header: 'Edad',
        cell: ({ row }) => (
          <div className="text-sm">
            {row.getValue('age') ? `${row.getValue('age')} años` : 'No registrada'}
          </div>
        ),
        enableHiding: true
      },
      {
        id: 'document',
        header: 'Documento',
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{lead.document}</span>
              <span className="text-muted-foreground text-xs">{lead.documentType}</span>
            </div>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'documentType',
        header: 'Tipo de documento',
        cell: ({ row }) => <div className="text-sm">{row.getValue('documentType')}</div>,
        enableHiding: true
      },
      {
        id: 'contact',
        header: 'Contacto',
        cell: ({ row }) => {
          const lead = row.original;
          return hasContactInfo(lead) ? (
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
              {lead.phone2 && (
                <div className="flex items-center gap-1 text-xs">
                  <Phone className="text-muted-foreground h-3 w-3" />
                  <span>{lead.phone2}</span>
                </div>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">Sin datos de contacto</span>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <div className="max-w-[150px] truncate text-sm">
            {row.getValue('email') || 'No registrado'}
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue('phone') || 'No registrado'}</div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'phone2',
        header: 'Teléfono 2',
        cell: ({ row }) => (
          <div className="text-sm">{row.getValue('phone2') || 'No registrado'}</div>
        ),
        enableHiding: true
      },
      {
        id: 'source',
        header: 'Fuente',
        cell: ({ row }) => {
          const lead = row.original;
          return lead.source ? (
            <div className="flex items-center gap-1">
              <Building className="text-primary h-3.5 w-3.5" />
              <span className="text-sm">{lead.source.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">No especificada</span>
          );
        },
        enableHiding: true
      },
      {
        id: 'status',
        header: 'Estado',
        cell: ({ row }) => {
          const lead = row.original;
          const latestVisit = getLatestVisit(lead);

          return lead.isInOffice ? (
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
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'isInOffice',
        header: 'En oficina',
        cell: ({ row }) => (
          <span className={row.getValue('isInOffice') ? 'text-green-600' : 'text-red-600'}>
            {row.getValue('isInOffice') ? 'Sí' : 'No'}
          </span>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha',
        cell: ({ row }) => <div className="text-sm">{formatDate(row.getValue('createdAt'))}</div>,
        enableHiding: true
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => <LeadActionsButton lead={row.original} />,
        enableHiding: false
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility
    }
  });

  return (
    <TableTemplate<Lead>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
};

export default LeadsTable;
