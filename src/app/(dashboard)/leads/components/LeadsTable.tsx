'use client';

import TableTemplate from '@/components/common/table/TableTemplate';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/leads.types';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import {
  Building2,
  Calendar,
  Clock,
  CreditCard,
  File,
  FileText,
  Mail,
  MapPin,
  Phone,
  User
} from 'lucide-react';
import { useMemo, useState } from 'react';
import LeadActionsButton from './buttons/LeadActionsButton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type Props = {
  data: Lead[];
};

const LeadsTable = ({ data }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    age: false,
    documentType: false,
    phone2: false,
    email: false,
    phone: false,
    source: false
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: es });
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
        cell: ({ row }) => (
          <div className="text-sm font-medium">
            # {(row.getValue('id') as string).substring(0, 8)}...
          </div>
        ),
        enableHiding: true
      },
      {
        id: 'leadInfo',
        header: 'Información del Lead',
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{lead.firstName}</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{lead.lastName}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {lead.age ? `${lead.age} años` : 'Edad no registrada'}
                </div>
              </div>
            </div>
          );
        },
        enableHiding: false
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
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{lead.document}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {lead.documentType}
                </span>
              </div>
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
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-1 text-xs">
                  <Mail className="h-3 w-3 text-gray-400" />
                  <span className="max-w-[130px] truncate">{lead.email}</span>
                </div>
              )}
              {lead.phone2 && (
                <div className="flex items-center gap-1 text-xs">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span>{lead.phone2}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Phone className="h-3 w-3" />
              <span>Sin datos de contacto</span>
            </div>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <div className="max-w-[150px] truncate text-sm">
            {row.getValue('email') || <span className="text-gray-400">No registrado</span>}
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'phone',
        header: 'Teléfono',
        cell: ({ row }) => (
          <div className="text-sm">
            {row.getValue('phone') || <span className="text-gray-400">No registrado</span>}
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'phone2',
        header: 'Teléfono 2',
        cell: ({ row }) => (
          <div className="text-sm">
            {row.getValue('phone2') || <span className="text-gray-400">No registrado</span>}
          </div>
        ),
        enableHiding: true
      },
      {
        id: 'source',
        header: 'Fuente',
        cell: ({ row }) => {
          const lead = row.original;
          return lead.source ? (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{lead.source.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Building2 className="h-3 w-3" />
              <span>No especificada</span>
            </div>
          );
        },
        enableHiding: true
      },
      {
        id: 'status',
        header: 'Estado de Visita',
        cell: ({ row }) => {
          const lead = row.original;
          const latestVisit = getLatestVisit(lead);

          return (
            <div className="space-y-1">
              {lead.isInOffice ? (
                <Badge className="border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <MapPin className="mr-1 h-3 w-3" />
                  En oficina
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  No en oficina
                </Badge>
              )}
              {lead.isInOffice && latestVisit && (
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>Desde: {formatTime(latestVisit.arrivalTime)}</span>
                </div>
              )}
            </div>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'isInOffice',
        header: 'En oficina',
        cell: ({ row }) => (
          <Badge
            variant={row.getValue('isInOffice') ? 'default' : 'secondary'}
            className={
              row.getValue('isInOffice')
                ? 'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }
          >
            {row.getValue('isInOffice') ? 'Sí' : 'No'}
          </Badge>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'reportPdfUrl',
        header: 'Reporte',
        cell: ({ row }) => {
          const pdfUrl = row.getValue('reportPdfUrl') as string;

          return pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
            >
              <FileText className="h-4 w-4" />
              Ver PDF
            </a>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <File className="h-4 w-4" />
              <span className="text-sm">No disponible</span>
            </div>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de Registro',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{formatDate(row.getValue('createdAt'))}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatTime(row.getValue('createdAt'))}
              </span>
            </div>
          </div>
        ),
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
