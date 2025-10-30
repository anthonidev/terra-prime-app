'use client';

import { Edit } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';

import type { LeadSource } from '../types';
import type { PaginationMeta } from '@/shared/types/pagination';

interface LeadSourcesTableProps {
  leadSources: LeadSource[];
  meta: PaginationMeta;
  onEdit: (leadSource: LeadSource) => void;
  onPageChange: (page: number) => void;
}

export function LeadSourcesTable({
  leadSources,
  meta,
  onEdit,
  onPageChange,
}: LeadSourcesTableProps) {
  const columns: ColumnDef<LeadSource>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha de creación',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.original.createdAt), 'PPP', { locale: es })}
        </span>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Última actualización',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.original.updatedAt), 'PPP', { locale: es })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(row.original)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (leadSources.length === 0) {
    return (
      <div className="rounded-lg border bg-card shadow-sm p-8">
        <p className="text-center text-muted-foreground">
          No se encontraron fuentes de leads
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable columns={columns} data={leadSources} />
      </div>

      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
