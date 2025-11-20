'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { type ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import { DOCUMENT_TYPE_LABELS, PARTICIPANT_TYPE_LABELS } from '../constants';
import type { PaginationMeta, Participant } from '../types';
import { ParticipantCard } from './participant-card';

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
            <div className="mt-0.5 flex items-center gap-1.5">
              <Badge variant="outline" className="font-mono text-xs">
                {DOCUMENT_TYPE_LABELS[participant.documentType]}
              </Badge>
              <span className="text-muted-foreground text-xs">{participant.document}</span>
            </div>
            {participant.email && (
              <div className="text-muted-foreground mt-0.5 truncate text-xs">
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
      cell: ({ row }) => <div className="text-xs">{row.getValue('phone')}</div>,
    },
    {
      accessorKey: 'participantType',
      header: 'Tipo / Estado',
      cell: ({ row }) => {
        const participant = row.original;
        const type = row.getValue('participantType') as Participant['participantType'];
        return (
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="w-fit text-xs">
              {PARTICIPANT_TYPE_LABELS[type]}
            </Badge>
            <Badge
              variant={participant.isActive ? 'default' : 'destructive'}
              className="w-fit text-xs"
            >
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
