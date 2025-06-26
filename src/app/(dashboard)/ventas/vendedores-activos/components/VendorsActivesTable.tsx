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
import { User, Mail, IdCard, Calendar, Badge as BadgeIcon } from 'lucide-react';

import TableTemplate from '@/components/common/table/TableTemplate';
import { VendorsActives } from '@domain/entities/sales/leadsvendors.entity';
import { Badge } from '@/components/ui/badge';

type Props = {
  data: VendorsActives[];
};

export default function VendorsActivesTable({ data }: Props) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    document: false
  });

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return `${first}${last}`;
  };

  const getAvatarColor = (email: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    const index = email.length % colors.length;
    return colors[index];
  };

  const columns = useMemo<ColumnDef<VendorsActives>[]>(
    () => [
      {
        id: 'index',
        header: () => (
          <div className="flex items-center gap-2">
            <BadgeIcon className="h-4 w-4 text-gray-400" />
            <span>Nº</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {row.index + 1}
          </div>
        ),
        enableSorting: false,
        size: 60
      },
      {
        id: 'vendorInfo',
        header: () => (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span>Vendedor</span>
          </div>
        ),
        cell: ({ row }) => {
          const vendor = row.original;
          const initials = getInitials(vendor.firstName, vendor.lastName);
          const avatarColor = getAvatarColor(vendor.email);

          return (
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white ${avatarColor}`}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-gray-900 dark:text-gray-100">
                  {vendor.firstName} {vendor.lastName}
                </div>
                <div className="truncate text-sm text-gray-500 dark:text-gray-400">
                  {vendor.email}
                </div>
              </div>
            </div>
          );
        },
        enableHiding: false,
        size: 250
      },
      {
        accessorKey: 'document',
        header: () => (
          <div className="flex items-center gap-2">
            <IdCard className="h-4 w-4 text-gray-400" />
            <span>Documento</span>
          </div>
        ),
        cell: ({ row }) => {
          const document = row.getValue('document') as string;
          return (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {document || 'Sin documento'}
              </Badge>
            </div>
          );
        },
        enableHiding: true
      },
      {
        accessorKey: 'email',
        header: () => (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>Correo</span>
          </div>
        ),
        cell: ({ row }) => {
          const email = row.getValue('email') as string;
          return (
            <div className="flex items-center gap-2">
              <div className="max-w-[200px] cursor-pointer truncate text-sm text-blue-600 hover:underline dark:text-blue-400">
                {email}
              </div>
            </div>
          );
        },
        enableHiding: true
      },
      {
        accessorKey: 'createdAt',
        header: () => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Fecha de Registro</span>
          </div>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue('createdAt'));
          const isRecent = Date.now() - date.getTime() < 30 * 24 * 60 * 60 * 1000; // 30 días

          return (
            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {format(date, 'dd/MM/yyyy', { locale: es })}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {format(date, 'HH:mm', { locale: es })}
              </div>
              {isRecent && (
                <Badge variant="secondary" className="w-fit text-xs">
                  Nuevo
                </Badge>
              )}
            </div>
          );
        },
        enableHiding: true,
        size: 140
      },
      {
        id: 'status',
        header: 'Estado',
        cell: () => (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
          >
            <div className="mr-1 h-2 w-2 rounded-full bg-green-500"></div>
            Activo
          </Badge>
        ),
        enableHiding: true,
        size: 100
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

  // Estado vacío mejorado
  if (!data.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <User className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          No hay vendedores activos
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Aún no se han registrado vendedores en el sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <User className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {data.length} Vendedores Activos
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Personal de ventas registrado
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          >
            ✓ Todos activos
          </Badge>
        </div>
      </div>

      <TableTemplate<VendorsActives>
        table={table}
        columns={columns}
        showColumnVisibility={true}
        columnVisibilityLabel="Mostrar columnas"
      />
    </div>
  );
}
