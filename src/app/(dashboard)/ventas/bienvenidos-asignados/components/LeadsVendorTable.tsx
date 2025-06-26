'use client';

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

import TableTemplate from '@/components/common/table/TableTemplate';
import { LeadsVendor } from '@domain/entities/sales/leadsvendors.entity';
import { Calendar, Clock, FileText, Hash, User, UserCheck } from 'lucide-react';

export default function LeadsVendorTable({ data }: { data: LeadsVendor[] }) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false
  });

  const columns = useMemo<ColumnDef<LeadsVendor>[]>(
    () => [
      {
        id: 'index',
        header: () => 'Nº',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Hash className="text-muted-foreground h-4 w-4" />
            {row.index + 1}
          </div>
        )
      },
      {
        accessorKey: 'firstName',
        header: 'Nombre',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm">
            <User className="text-muted-foreground h-4 w-4" />
            {row.getValue('firstName')}
          </div>
        ),
        enableHiding: false
      },
      {
        accessorKey: 'lastName',
        header: 'Apellido',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm font-medium">
            <UserCheck className="text-muted-foreground h-4 w-4" />
            {row.getValue('lastName')}
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'age',
        header: 'Edad',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="text-muted-foreground h-4 w-4" />
            {row.getValue('age')}
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'document',
        header: 'Documento',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText className="text-muted-foreground h-4 w-4" />
            {row.getValue('document')}
          </div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de creación',
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="text-muted-foreground h-4 w-4" />
            {format(new Date(row.getValue('createdAt')), 'PPP', { locale: es })}
          </div>
        ),
        enableHiding: true
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
    <TableTemplate<LeadsVendor>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
}
