'use client';

import TableTemplate from '@/components/common/table/TableTemplate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  RowSelectionState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, User, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import AssignCollectorButton from './AssignCollectorButton';
import AssignVendorModal from './AssignCollectorModal';
import { CollectionsClient } from '@domain/entities/cobranza';

type Props = {
  data: CollectionsClient[];
};

export default function CobradoresTable({ data }: Props) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: true
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const hasCollectorAssigned = (lead: CollectionsClient): boolean => {
    const vendor = lead.collector;
    return vendor !== null && typeof vendor === 'object' && !Array.isArray(vendor);
  };

  const columns = useMemo<ColumnDef<CollectionsClient>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('id')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'address',
        header: 'Dirección',
        cell: ({ row }) => <div className="text-sm">{row.getValue('address')}</div>,
        enableHiding: true
      },
      {
        id: 'leadInfo',
        header: 'Información del Lead',
        cell: ({ row }) => {
          const lead = row.original.lead;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {lead.firstName} {lead.lastName}
                </div>
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
        id: 'collector',
        header: 'Cobrador',
        cell: ({ row }) => {
          const collector = row.original.collector;
          if (typeof collector === 'string') return <Badge variant="outline">{collector}</Badge>;
          if (collector && typeof collector === 'object') {
            return (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {collector.firstName} {collector.lastName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {collector.email}
                  </span>
                </div>
              </div>
            );
          }
          return (
            <Badge
              variant="secondary"
              className="border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
            >
              Sin asignar
            </Badge>
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
              <span className="text-sm font-medium">
                {format(new Date(row.getValue('createdAt')), 'dd/MM/yyyy', { locale: es })}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(row.getValue('createdAt')), 'HH:mm', { locale: es })}
              </span>
            </div>
          </div>
        ),
        enableHiding: true
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          const client = row.original;
          const hasCollector = hasCollectorAssigned(client);

          return (
            <div className="flex items-center gap-2">
              {hasCollector && (
                <Badge variant="default" className="border-green-200 bg-green-100 text-green-700">
                  Asignado
                </Badge>
              )}
              <AssignCollectorButton clientId={client.id} hasCollector={hasCollector} />
            </div>
          );
        },
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
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => String(row.id),
    state: {
      columnVisibility,
      rowSelection
    }
  });

  const selectedRowIds = Object.keys(rowSelection).filter((key) => rowSelection[key]);

  const secondaryClientsIds: number[] = selectedRowIds
    .map((id) => parseInt(id))
    .filter((id) => !isNaN(id));

  const bulkActions =
    secondaryClientsIds.length > 0 ? (
      <Button onClick={() => setIsAssignModalOpen(true)} size="sm" className="ml-2">
        <UserPlus className="mr-2 h-4 w-4" />
        Asignar cobrador ({secondaryClientsIds.length})
      </Button>
    ) : null;

  const selectionMessage = (count: number) =>
    `${count} lead(s) seleccionado(s) para asignar/reasignar`;

  const handleModalClose = () => {
    setIsAssignModalOpen(false);
    setRowSelection({});
  };

  return (
    <>
      <TableTemplate<CollectionsClient>
        table={table}
        columns={columns}
        showColumnVisibility={true}
        columnVisibilityLabel="Mostrar columnas"
        enableRowSelection={true}
        bulkActions={bulkActions}
        selectionMessage={selectionMessage}
      />

      <AssignVendorModal
        clientsId={secondaryClientsIds}
        isOpen={isAssignModalOpen}
        onClose={handleModalClose}
      />
    </>
  );
}
