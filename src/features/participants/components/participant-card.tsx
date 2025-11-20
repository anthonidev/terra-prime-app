'use client';

import { Pencil, Phone } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { PARTICIPANT_TYPE_LABELS, DOCUMENT_TYPE_LABELS } from '../constants';
import type { Participant } from '../types';

interface ParticipantCardProps {
  participant: Participant;
  onEdit: (participant: Participant) => void;
}

export function ParticipantCard({ participant, onEdit }: ParticipantCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header: Nombre + Badges */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold">
                {participant.firstName} {participant.lastName}
              </h3>
              <div className="mt-1 flex items-center gap-1.5">
                <Badge variant="outline" className="font-mono text-xs">
                  {DOCUMENT_TYPE_LABELS[participant.documentType]}
                </Badge>
                <span className="text-muted-foreground text-xs">{participant.document}</span>
              </div>
            </div>
            <Badge
              variant={participant.isActive ? 'default' : 'destructive'}
              className="shrink-0 text-xs"
            >
              {participant.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>

          {/* Contacto */}
          <div className="space-y-1">
            {participant.email && (
              <div className="text-muted-foreground truncate text-xs">{participant.email}</div>
            )}
            <div className="flex items-center gap-1.5 text-xs">
              <Phone className="text-muted-foreground h-3 w-3" />
              <span>{participant.phone}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="bg-border h-px" />

          {/* Tipo + Acción */}
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className="text-xs">
              {PARTICIPANT_TYPE_LABELS[participant.participantType]}
            </Badge>
            <Button variant="outline" size="sm" className="h-8" onClick={() => onEdit(participant)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Editar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
