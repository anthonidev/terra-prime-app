'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import { DataTablePagination } from '@/shared/components/data-table/data-table-pagination';
import { StatusBadge } from '@/shared/components/status-badge';
import { UserInfo } from '@/shared/components/user-info';
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
          <UserInfo
            name={`${participant.firstName} ${participant.lastName}`}
            email={participant.email || undefined}
            document={participant.document}
            documentType={DOCUMENT_TYPE_LABELS[participant.documentType]}
          />
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
      header: 'Tipo',
      cell: ({ row }) => {
        const type = row.getValue('participantType') as Participant['participantType'];
        return (
          <Badge variant="outline" className="w-fit text-xs">
            {PARTICIPANT_TYPE_LABELS[type]}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const participant = row.original;
        return <StatusBadge isActive={participant.isActive} />;
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
            className="h-8 w-8 p-0"
            title="Editar participante"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="sr-only">Editar</span>
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
