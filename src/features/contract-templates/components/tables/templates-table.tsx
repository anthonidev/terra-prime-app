'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/shared/components/data-table/data-table';
import type { ContractTemplateListItem } from '../../types';
import { TemplateStatus } from '../../types';

const STATUS_BADGE: Record<
  TemplateStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  [TemplateStatus.DRAFT]: { label: 'Borrador', variant: 'secondary' },
  [TemplateStatus.ACTIVE]: { label: 'Activo', variant: 'default' },
  [TemplateStatus.INACTIVE]: { label: 'Inactivo', variant: 'outline' },
};

interface TemplatesTableProps {
  data: ContractTemplateListItem[];
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TemplatesTable({ data, onPublish, onUnpublish, onDelete }: TemplatesTableProps) {
  const router = useRouter();

  const columns = useMemo<ColumnDef<ContractTemplateListItem>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        cell: ({ row }) => (
          <span className="text-muted-foreground max-w-[300px] truncate text-sm">
            {row.original.description || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'project.name',
        header: 'Proyecto',
        cell: ({ row }) => row.original.project?.name || '-',
      },
      {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => {
          const badge = STATUS_BADGE[row.original.status];
          return <Badge variant={badge.variant}>{badge.label}</Badge>;
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const template = row.original;
          const isDraft = template.status === TemplateStatus.DRAFT;
          const isActive = template.status === TemplateStatus.ACTIVE;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/contratos/plantillas/${template.id}`)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalle
                </DropdownMenuItem>
                {isDraft && (
                  <DropdownMenuItem
                    onClick={() => router.push(`/contratos/plantillas/editar/${template.id}`)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                )}
                {isDraft && (
                  <DropdownMenuItem onClick={() => onPublish(template.id)}>
                    <ToggleRight className="mr-2 h-4 w-4" />
                    Publicar
                  </DropdownMenuItem>
                )}
                {isActive && (
                  <DropdownMenuItem onClick={() => onUnpublish(template.id)}>
                    <ToggleLeft className="mr-2 h-4 w-4" />
                    Despublicar
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onDelete(template.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [router, onPublish, onUnpublish, onDelete]
  );

  return <DataTable columns={columns} data={data} />;
}
