'use client';
import TableTemplate from '@/components/common/table/TableTemplate';
import { Liner } from '@/types/leads.types';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import UpdateLinerButton from './buttons/UpdateLinerButton';

type Props = {
  data: Liner[];
};

const LinnerTable = ({ data }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false
  });
  console.log('LinnerTable data', data);
  const columns = useMemo<ColumnDef<Liner>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div className="text-sm font-medium">#{row.getValue('id')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'firstName',
        header: 'Nombre completo',
        cell: ({ row }) => <div className="text-sm">{row.getValue('firstName')}</div>,
        enableHiding: false
      },
      {
        accessorKey: 'isActive',
        header: 'Estado',
        cell: ({ row }) => (
          <span className={row.getValue('isActive') ? 'text-green-600' : 'text-red-600'}>
            {row.getValue('isActive') ? 'Activo' : 'Inactivo'}
          </span>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de creación',
        cell: ({ row }) => (
          <div className="text-sm">{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'updatedAt',
        header: 'Fecha de actualización',
        cell: ({ row }) => (
          <div className="text-sm">{new Date(row.getValue('updatedAt')).toLocaleDateString()}</div>
        ),
        enableHiding: true
      },
      {
        accessorKey: 'document',
        header: 'Documento',
        cell: ({ row }) => <div className="text-sm">{row.getValue('document')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'documentType',
        header: 'Tipo de documento',
        cell: ({ row }) => <div className="text-sm">{row.getValue('documentType')}</div>,
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
