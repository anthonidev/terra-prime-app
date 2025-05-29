'use client';
import TableTemplate from '@/components/common/table/TableTemplate';
import { Badge } from '@/components/ui/badge';
import { LeadSource } from '@/types/leads.types';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMemo, useState } from 'react';
import UpdateLeadSourceButton from './buttons/UpdateLeadSourceButton';

type Props = {
  data: LeadSource[];
};

const LeadSourceTable = ({ data }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false
  });

  const columns = useMemo<ColumnDef<LeadSource>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div className="text-sm font-medium">#{row.getValue('id')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => <div className="text-sm">{row.getValue('name')}</div>,
        enableHiding: false
      },
      {
        accessorKey: 'isActive',
        header: 'Estado',
        cell: ({ row }) => (
          <Badge variant={row.getValue('isActive') ? 'default' : 'destructive'}>
            {row.getValue('isActive') ? 'Activo' : 'Inactivo'}
          </Badge>
        ),
        enableHiding: true
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
      },
      {
        accessorKey: 'updatedAt',
        header: 'Fecha de actualización',
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
        cell: ({ row }) => <UpdateLeadSourceButton source={row.original} />,
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
    <TableTemplate<LeadSource>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
};

export default LeadSourceTable;
