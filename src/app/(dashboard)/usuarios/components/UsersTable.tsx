'use client';

import { Badge } from '@/components/ui/badge';
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

import { Role, UserList } from '@domain/entities/user';
import TableTemplate from '@/components/common/table/TableTemplate';
import UpdateUserButton from './buttons/UpdateUserButton';

type Props = {
  data: UserList[];
  roles: Role[];
};

export default function UsersTable({ data, roles }: Props) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false
  });

  const columns = useMemo<ColumnDef<UserList>[]>(
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
        accessorKey: 'document',
        header: 'Documento',
        cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('document')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'email',
        header: 'Correo',
        cell: ({ row }) => <div className="text-sm font-medium">{row.getValue('email')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'role',
        header: 'Rol',
        cell: ({ row }) => {
          const role = row.getValue('role') as { id: string; name: string };
          return <div className="text-sm font-medium">{role.name}</div>;
        },
        enableHiding: true
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
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => <UpdateUserButton user={row.original} roles={roles} />,
        enableHiding: false
      }
    ],
    [roles]
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
    <TableTemplate<UserList>
      table={table}
      columns={columns}
      showColumnVisibility={true}
      columnVisibilityLabel="Mostrar columnas"
    />
  );
}
