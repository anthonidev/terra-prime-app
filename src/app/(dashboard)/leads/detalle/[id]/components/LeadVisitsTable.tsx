'use client';

import TableTemplate from '@/components/common/table/TableTemplate';
import { Badge } from '@/components/ui/badge';
import { LeadVisit } from '@/types/leads.types';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Timer, User, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

type Props = {
  visits: LeadVisit[];
};

const LeadVisitsTable = ({ visits }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false
  });

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd MMMM yyyy', { locale: es });
  };

  const formatTime = (dateStr: string) => {
    return format(new Date(dateStr), 'HH:mm', { locale: es });
  };

  const formatDateTime = (dateStr: string) => {
    return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const calculateDuration = (arrivalTime: string, departureTime: string | null) => {
    if (!departureTime) return 'En curso';
    const arrival = new Date(arrivalTime);
    const departure = new Date(departureTime);
    const durationMs = departure.getTime() - arrival.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getVisitStatusBadge = (visit: LeadVisit, index: number) => {
    if (!visit.departureTime && index === 0) {
      return (
        <Badge className="border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-300">
          <MapPin className="mr-1 h-3 w-3" />
          En oficina
        </Badge>
      );
    } else if (!visit.departureTime) {
      return (
        <Badge className="border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-900/40 dark:text-orange-300">
          <Clock className="mr-1 h-3 w-3" />
          Sin salida registrada
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="secondary"
          className="border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        >
          <Clock className="mr-1 h-3 w-3" />
          Completada
        </Badge>
      );
    }
  };

  const columns = useMemo<ColumnDef<LeadVisit>[]>(
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
        id: 'date',
        header: 'Fecha',
        cell: ({ row }) => {
          const visit = row.original;
          return (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(visit.arrivalTime)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDateTime(visit.arrivalTime)}
                </p>
              </div>
            </div>
          );
        },
        enableHiding: false
      },
      {
        id: 'arrivalTime',
        header: 'Hora de entrada',
        cell: ({ row }) => {
          const visit = row.original;
          return (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatTime(visit.arrivalTime)}
              </span>
            </div>
          );
        },
        enableHiding: false
      },
      {
        id: 'departureTime',
        header: 'Hora de salida',
        cell: ({ row }) => {
          const visit = row.original;
          return visit.departureTime ? (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-red-500" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatTime(visit.departureTime)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Pendiente</span>
            </div>
          );
        },
        enableHiding: false
      },
      {
        id: 'duration',
        header: 'Duración',
        cell: ({ row }) => {
          const visit = row.original;
          return (
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {calculateDuration(visit.arrivalTime, visit.departureTime ?? null)}
              </span>
            </div>
          );
        },
        enableHiding: true
      },
      {
        id: 'liner',
        header: 'Registrado por',
        cell: ({ row }) => {
          const visit = row.original;
          return visit.liner ? (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {visit.liner.firstName} {visit.liner.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {visit.liner.documentType}: {visit.liner.document}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <User className="h-4 w-4" />
              <span className="text-sm">No registrado</span>
            </div>
          );
        },
        enableHiding: true
      },
      {
        id: 'status',
        header: 'Estado',
        cell: ({ row }) => {
          const visit = row.original;
          const index = visits.findIndex((v) => v.id === visit.id);
          return getVisitStatusBadge(visit, index);
        },
        enableHiding: false
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de creación',
        cell: ({ row }) => (
          <div className="text-sm">
            {format(new Date(row.getValue('createdAt')), 'PPP', { locale: es })}
          </div>
        ),
        enableHiding: true
      }
    ],
    [visits]
  );

  const table = useReactTable({
    data: visits,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility
    }
  });

  return (
    <TableTemplate<LeadVisit>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
};

export default LeadVisitsTable;
