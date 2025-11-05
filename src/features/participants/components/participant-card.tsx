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
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold truncate">
                {participant.firstName} {participant.lastName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="outline" className="text-xs font-mono">
                  {DOCUMENT_TYPE_LABELS[participant.documentType]}
                </Badge>
                <span className="text-xs text-muted-foreground">{participant.document}</span>
              </div>
            </div>
            <Badge variant={participant.isActive ? 'default' : 'destructive'} className="text-xs shrink-0">
              {participant.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>

          {/* Contacto */}
          <div className="space-y-1">
            {participant.email && (
              <div className="text-xs text-muted-foreground truncate">
                {participant.email}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{participant.phone}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Tipo + Acción */}
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className="text-xs">
              {PARTICIPANT_TYPE_LABELS[participant.participantType]}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => onEdit(participant)}
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Editar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
