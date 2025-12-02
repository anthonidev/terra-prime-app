'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { StatusBadge } from '@/shared/components/status-badge';
import { UserCard } from '../cards/user-card';

import { UserInfo } from '@/shared/components/user-info';
import type { PaginationMeta, User } from '../../types';

interface UsersTableProps {
  users: User[];
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onEditUser: (user: User) => void;
}

export function UsersTable({ users, meta, onPageChange, onEditUser }: UsersTableProps) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'user',
      header: 'Usuario',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <UserInfo
            name={`${user.firstName} ${user.lastName}`}
            email={user.email}
            photo={user.photo}
          />
        );
      },
    },
    {
      accessorKey: 'document',
      header: 'Documento',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-muted-foreground font-mono text-[11px] font-normal"
          >
            {row.original.document}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Rol',
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <Badge variant="secondary" className="font-medium">
            {role.name}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return <StatusBadge isActive={isActive} />;
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Registrado',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return (
          <span className="text-muted-foreground text-xs">
            {format(date, "d 'de' MMMM, yyyy", { locale: es })}
          </span>
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Actualizado',
      cell: ({ row }) => {
        const date = new Date(row.getValue('updatedAt'));
        return (
          <span className="text-muted-foreground text-xs">
            {format(date, "d 'de' MMMM, yyyy", { locale: es })}
          </span>
        );
      },
    },
    {
      accessorKey: 'lastLoginAt',
      header: 'Último acceso',
      cell: ({ row }) => {
        const val = row.getValue('lastLoginAt');
        if (!val) return <span className="text-muted-foreground text-xs">-</span>;
        const date = new Date(val as string);
        return (
          <span className="text-muted-foreground text-xs">
            {format(date, "d 'de' MMMM, yyyy HH:mm", { locale: es })}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={() => onEditUser(user)}
            >
              <Pencil className="h-3.5 w-3.5" />

              <span className="sr-only">Editar</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Desktop: Tabla */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={users}
          enableColumnVisibility={true}
          initialColumnVisibility={{
            lastLoginAt: false,
            updatedAt: false,
          }}
          storageKey="users-table-columns"
        />
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
