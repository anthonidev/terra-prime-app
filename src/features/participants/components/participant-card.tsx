'use client';

import { Pencil, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
    <Card className="overflow-hidden transition-colors hover:bg-muted/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Info Principal */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Nombre */}
            <div>
              <h3 className="font-semibold truncate">
                {participant.firstName} {participant.lastName}
              </h3>
              {participant.email && (
                <p className="text-sm text-muted-foreground truncate">
                  {participant.email}
                </p>
              )}
            </div>

            {/* Documento y Teléfono */}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3 shrink-0" />
                <span>
                  {DOCUMENT_TYPE_LABELS[participant.documentType]}: {participant.document}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3 shrink-0" />
                <span>{participant.phone}</span>
              </div>
            </div>

            {/* Dirección */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{participant.address}</span>
            </div>

            {/* Tipo y Estado */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {PARTICIPANT_TYPE_LABELS[participant.participantType]}
              </Badge>
              <Badge
                variant={participant.isActive ? 'default' : 'destructive'}
                className="text-xs"
              >
                {participant.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>

            {/* Fecha */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {format(new Date(participant.createdAt), 'dd MMM yyyy', {
                  locale: es,
                })}
              </span>
            </div>
          </div>

          {/* Acción directa: Editar */}
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => onEdit(participant)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
