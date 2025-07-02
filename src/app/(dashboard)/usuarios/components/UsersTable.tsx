'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Calendar, FileText, Mail, User } from 'lucide-react';
import { useMemo, useState } from 'react';

import TableTemplate from '@/components/common/table/TableTemplate';
import { Role, UserList } from '@domain/entities/user';
import UpdateUserButton from './buttons/UpdateUserButton';

type Props = {
  data: UserList[];
  roles: Role[];
};

export default function UsersTable({ data, roles }: Props) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    firstName: false, // Ocultar columnas de datos individuales
    lastName: false,
    email: false,
    createdAt: false // Ocultar fecha de creación por defecto
  });

  const columns = useMemo<ColumnDef<UserList>[]>(
    () => [
      {
        id: 'index',
        header: () => <div className="text-center font-medium">#</div>,
        cell: ({ row }) => (
          <div className="text-muted-foreground text-center font-mono text-sm">
            {String(row.index + 1).padStart(2, '0')}
          </div>
        ),
        size: 60
      },
      // Columnas ocultas para acceso a los datos
      {
        accessorKey: 'firstName',
        header: 'Nombre',
        cell: ({ row }) => <div className="text-sm">{row.getValue('firstName')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'lastName',
        header: 'Apellido',
        cell: ({ row }) => <div className="text-sm">{row.getValue('lastName')}</div>,
        enableHiding: true
      },
      {
        accessorKey: 'email',
        header: 'Correo',
        cell: ({ row }) => <div className="text-sm">{row.getValue('email')}</div>,
        enableHiding: true
      },
      {
        id: 'user',
        header: () => (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Usuario</span>
          </div>
        ),
        cell: ({ row }) => {
          const firstName = row.getValue('firstName') as string;
          const lastName = row.getValue('lastName') as string;
          const email = row.getValue('email') as string;
          const fullName = `${firstName} ${lastName}`;
          const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="text-sm leading-none font-medium">{fullName}</div>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Mail className="h-3 w-3" />
                  {email}
                </div>
              </div>
            </div>
          );
        },
        enableHiding: false,
        size: 280
      },
      {
        accessorKey: 'document',
        header: () => (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Documento</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="bg-muted/50 rounded px-2 py-1 text-center font-mono text-sm">
            {row.getValue('document')}
          </div>
        ),
        enableHiding: true,
        size: 120
      },
      {
        accessorKey: 'role',
        header: 'Rol',
        cell: ({ row }) => {
          const role = row.getValue('role') as { id: string; name: string };
          return (
            <Badge variant="outline" className="font-medium">
              {role.name}
            </Badge>
          );
        },
        enableHiding: true,
        size: 120
      },
      {
        accessorKey: 'isActive',
        header: 'Estado',
        cell: ({ row }) => {
          const isActive = row.getValue('isActive') as boolean;
          return (
            <div className="flex justify-center">
              <Badge
                variant={isActive ? 'default' : 'destructive'}
                className="min-w-[70px] justify-center"
              >
                <div
                  className={`mr-2 h-2 w-2 rounded-full ${
                    isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                {isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          );
        },
        enableHiding: true,
        size: 100
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Creado</span>
          </div>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue('createdAt'));
          return (
            <div className="space-y-1 text-sm">
              <div className="font-medium">{format(date, 'dd/MM/yyyy', { locale: es })}</div>
              <div className="text-muted-foreground text-xs">
                {format(date, 'HH:mm', { locale: es })}
              </div>
            </div>
          );
        },
        enableHiding: true,
        size: 100
      },
      {
        id: 'actions',
        header: () => <div className="text-center">Acciones</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <UpdateUserButton user={row.original} roles={roles} />
          </div>
        ),
        enableHiding: false,
        size: 100
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
    <div className="space-y-4">
      <TableTemplate<UserList>
        table={table}
        columns={columns}
        showColumnVisibility={true}
        columnVisibilityLabel="Configurar columnas"
      />
    </div>
  );
}
