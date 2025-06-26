'use client';

import TableTemplate from '@/components/common/table/TableTemplate';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Participant } from '@domain/entities/sales/participant.entity';
import { StatusBadge } from '@/components/common/table/StatusBadge';
import ParticipantActionsButton from './ParticipantActionsButton';

type Props = {
  data: Participant[];
};

const ParticipantesTable = ({ data }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false
  });

  const columns = useMemo<ColumnDef<Participant>[]>(
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
        id: 'participantInfo',
        header: 'Participante',
        cell: ({ row }) => {
          const participant = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {participant.firstName} {participant.lastName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {participant.documentType}: {participant.document}
                </div>
              </div>
            </div>
          );
        },
        enableHiding: false
      },
      {
        id: 'contactInfo',
        header: 'Contacto',
        cell: ({ row }) => {
          const participant = row.original;
          return (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{participant.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{participant.phone}</span>
              </div>
            </div>
          );
        },
        enableHiding: false
      },
      {
        accessorKey: 'address',
        header: 'Dirección',
        cell: ({ row }) => (
          <div className="flex max-w-xs items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="truncate text-sm">{row.getValue('address')}</span>
          </div>
        )
      },
      {
        accessorKey: 'participantType',
        header: 'Tipo',
        cell: ({ row }) => <StatusBadge status={row.getValue('participantType')} />
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha Creación',
        cell: ({ row }) => {
          const date = new Date(row.getValue('createdAt'));
          return <div className="text-sm">{date.toLocaleDateString('es-PE')}</div>;
        }
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => <ParticipantActionsButton participant={row.original} />,
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
    <TableTemplate<Participant>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
};

export default ParticipantesTable;
