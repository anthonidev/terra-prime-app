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
      header: 'Participante',
      cell: ({ row }) => {
        const participant = row.original;
        return (
          <div>
            <div className="text-xs font-bold">
              {participant.firstName} {participant.lastName}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="outline" className="text-xs font-mono">
                {DOCUMENT_TYPE_LABELS[participant.documentType]}
              </Badge>
              <span className="text-xs text-muted-foreground">{participant.document}</span>
            </div>
            {participant.email && (
              <div className="text-xs text-muted-foreground mt-0.5 truncate">
                {participant.email}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Teléfono',
      cell: ({ row }) => (
        <div className="text-xs">{row.getValue('phone')}</div>
      ),
    },
    {
      accessorKey: 'participantType',
      header: 'Tipo / Estado',
      cell: ({ row }) => {
        const participant = row.original;
        const type = row.getValue('participantType') as Participant['participantType'];
        return (
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="text-xs w-fit">
              {PARTICIPANT_TYPE_LABELS[type]}
            </Badge>
            <Badge variant={participant.isActive ? 'default' : 'destructive'} className="text-xs w-fit">
              {participant.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const participant = row.original;

        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditParticipant(participant)}
            className="h-8 w-8 p-0"
            title="Editar participante"
          >
            <Pencil className="h-3.5 w-3.5" />
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
