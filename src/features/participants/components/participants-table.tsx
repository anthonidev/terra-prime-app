'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { ParticipantCard } from './participant-card';

import { PARTICIPANT_TYPE_LABELS, DOCUMENT_TYPE_LABELS } from '../constants';
import type { Participant, PaginationMeta } from '../types';

interface ParticipantsTableProps {
  participants: Participant[];
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onEditParticipant: (participant: Participant) => void;
}

export function ParticipantsTable({
  participants,
  meta,
  onPageChange,
  onEditParticipant,
}: ParticipantsTableProps) {
  const columns: ColumnDef<Participant>[] = [
    {
      accessorKey: 'firstName',
      header: 'Nombre',
      cell: ({ row }) => {
        const participant = row.original;
        return (
          <div>
            <div className="font-medium leading-tight truncate">
              {participant.firstName} {participant.lastName}
            </div>
            {participant.email && (
              <div className="text-xs text-muted-foreground">
                <span className="block truncate" title={participant.email}>
                  {participant.email}
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'document',
      header: 'Documento',
      cell: ({ row }) => {
        const participant = row.original;
        return (
          <div>
            <div className="text-sm">
              {DOCUMENT_TYPE_LABELS[participant.documentType]}
            </div>
            <div className="text-xs text-muted-foreground">
              {participant.document}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Teléfono',
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue('phone')}</div>
      ),
    },
    {
      accessorKey: 'participantType',
      header: 'Tipo',
      cell: ({ row }) => {
        const type = row.getValue('participantType') as Participant['participantType'];
        return (
          <Badge variant="outline" className="text-xs">
            {PARTICIPANT_TYPE_LABELS[type]}
          </Badge>
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
        const participant = row.original;

        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditParticipant(participant)}
          >
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
        <DataTable columns={columns} data={participants} />
      </div>

      {/* Mobile: Cards */}
      <div className="grid gap-4 md:hidden">
        {participants.length > 0 ? (
          participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              onEdit={onEditParticipant}
            />
          ))
        ) : (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No se encontraron resultados
          </div>
        )}
      </div>

      {/* Paginación (ambos) */}
      <DataTablePagination meta={meta} onPageChange={onPageChange} />
    </div>
  );
}
