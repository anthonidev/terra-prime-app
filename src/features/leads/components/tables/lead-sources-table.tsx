'use client';

import { CheckCircle2, Edit, Target, XCircle } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { useMediaQuery } from '@/shared/hooks/use-media-query';

import { LeadSourceCard } from '../cards/lead-source-card';
import type { LeadSource } from '../../types';
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
  const isMobile = useMediaQuery('(max-width: 768px)');

  const columns: ColumnDef<LeadSource>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive ? 'default' : 'secondary'}
          className="text-xs"
        >
          {row.original.isActive ? (
            <>
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Activo
            </>
          ) : (
            <>
              <XCircle className="mr-1 h-3 w-3" />
              Inactivo
            </>
          )}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Creado',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(row.original.createdAt), 'dd/MM/yyyy', { locale: es })}
        </span>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Actualizado',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {format(new Date(row.original.updatedAt), 'dd/MM/yyyy', { locale: es })}
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
          className="h-8 w-8 p-0"
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  if (leadSources.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <Target className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">No se encontraron fuentes</p>
              <p className="text-xs text-muted-foreground">
                No hay fuentes de leads que coincidan con los filtros aplicados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {isMobile ? (
        <div className="space-y-3">
          {leadSources.map((leadSource) => (
            <LeadSourceCard
              key={leadSource.id}
              leadSource={leadSource}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : (
        <Card>
          <DataTable columns={columns} data={leadSources} />
        </Card>
      )}

      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
