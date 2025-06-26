'use client';

import TableTemplate from '@/components/common/table/TableTemplate';
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
import { Calendar, Eye, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ClientByUser } from '@domain/entities/cobranza';
import { useRouter } from 'next/navigation';

export default function MisClientesTable({ data }: { data: ClientByUser[] }) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: true
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const router = useRouter();

  const columns = useMemo<ColumnDef<ClientByUser>[]>(
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
                <div className="font-medium text-gray-900 lowercase dark:text-gray-100">
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
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/cobranza/clientes-asignados/detalle/${row.original.id}`)}
              className="hover:bg-primary/10 hover:text-primary"
              title="Ver detalles"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Ver detalles</span>
            </Button>
          );
        }
      }
    ],
    [router]
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

  return (
    <TableTemplate<ClientByUser>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
      enableRowSelection={true}
    />
  );
}
