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

export default function LeadsVendorTable({ data }: { data: LeadsVendor[] }) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false
  });

  const columns = useMemo<ColumnDef<LeadsVendor>[]>(
    () => [
      {
        id: 'index',
        header: () => 'Nº',
        cell: ({ row }) => row.index + 1
      },
      {
        accessorKey: 'firstName',
        header: 'Nombre',
        cell: ({ row }) => <div className="text-sm">{row.getValue('firstName')}</div>,
        enableHiding: false
      },
      {
        accessorKey: 'lastName',
        header: 'Apellido',
        cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('lastName')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'age',
        header: 'Edad',
        cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('age')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'document',
        header: 'Documento',
        cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('document')}</div>,
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
