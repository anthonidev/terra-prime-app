'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { UserCard } from '../cards/user-card';

import type { User, PaginationMeta } from '../../types';

interface UsersTableProps {
  users: User[];
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onEditUser: (user: User) => void;
}

export function UsersTable({ users, meta, onPageChange, onEditUser }: UsersTableProps) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'photo',
      header: '',
      cell: ({ row }) => {
        const user = row.original;
        const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

        return (
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photo || undefined} alt={user.firstName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: 'firstName',
      header: 'Nombre',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div>
            <div className="truncate leading-tight font-medium">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-muted-foreground text-xs">
              <span className="block truncate" title={user.email}>
                {user.email}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">{user.document}</span>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }) => {
        return (
          <Badge variant="outline">{row.original.role.code}</Badge>
          // <Badge variant="secondary">{row.original.role.name}</Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge variant={isActive ? 'default' : 'destructive'}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de creación',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return format(date, 'dd MMM yyyy', { locale: es });
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;

        return (
          <Button variant="outline" size="sm" onClick={() => onEditUser(user)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Desktop: Tabla */}
      <div className="hidden md:block">
        <DataTable columns={columns} data={users} />
      </div>

      {/* Mobile: Cards */}
      <div className="grid gap-4 md:hidden">
        {users.length > 0 ? (
          users.map((user) => <UserCard key={user.id} user={user} onEdit={onEditUser} />)
        ) : (
          <div className="bg-card text-muted-foreground rounded-lg border p-8 text-center">
            No se encontraron resultados
          </div>
        )}
      </div>

      {/* Paginación (ambos) */}
      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
