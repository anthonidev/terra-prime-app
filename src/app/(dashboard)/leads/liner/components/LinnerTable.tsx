'use client';
import TableTemplate from '@/components/common/table/TableTemplate';
import { Badge } from '@/components/ui/badge';
import { Liner } from '@/types/leads.types';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CreditCard, UserCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import UpdateLinerButton from './buttons/UpdateLinerButton';

type Props = {
  data: Liner[];
};

const LinnerTable = ({ data }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    updatedAt: false
  });

  const columns = useMemo<ColumnDef<Liner>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <div className="text-sm font-medium">
            # {(row.getValue('id') as string).toString().substring(0, 8)} ...
          </div>
        ),
        enableHiding: true
      },
      {
        id: 'fullName',
        header: 'Nombre Completo',
        cell: ({ row }) => {
          const liner = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <UserCheck className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {liner.firstName} {liner.lastName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{liner.fullName}</div>
              </div>
            </div>
          );
        },
        enableHiding: false
      },

      {
        id: 'document',
        header: 'Documento',
        cell: ({ row }) => {
          const liner = row.original;
          return (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{liner.document}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {liner.documentType}
                </span>
              </div>
            </div>
          );
        },
        enableHiding: false
      },

      {
        accessorKey: 'isActive',
        header: 'Estado',
        cell: ({ row }) => (
          <Badge
            variant={row.getValue('isActive') ? 'default' : 'secondary'}
            className={
              row.getValue('isActive')
                ? 'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
            }
          >
            {row.getValue('isActive') ? 'Activo' : 'Inactivo'}
          </Badge>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de Creación',
        cell: ({ row }) => (
          <div className="text-sm">
            {format(new Date(row.getValue('createdAt')), 'PPP', { locale: es })}
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'updatedAt',
        header: 'Fecha de Actualización',
        cell: ({ row }) => (
          <div className="text-sm">
            {format(new Date(row.getValue('updatedAt')), 'PPP', { locale: es })}
          </div>
        ),
        enableHiding: true
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => <UpdateLinerButton liner={row.original} />,
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
    <TableTemplate<Liner>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
};

export default LinnerTable;
