'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Participant } from '@domain/entities/sales/participant.entity';
import { User, Mail, Phone, MapPin, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ParticipantModal from './ParticipantModal';
import ParticipantDeleteDialog from './ParticipantDeleteDialog';

type Props = {
  data: Participant[];
};

const ParticipantesCards = ({ data }: Props) => {
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [deletingParticipant, setDeletingParticipant] = useState<Participant | null>(null);

  if (!data.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <User className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            No se encontraron participantes
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Intenta ajustar los filtros para ver más resultados
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {data.map((participant) => (
          <Card key={participant.id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {participant.firstName} {participant.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {participant.documentType}: {participant.document}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={participant.participantType === 'LINER' ? 'default' : 'secondary'}
                  >
                    {participant.participantType}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingParticipant(participant)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingParticipant(participant)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{participant.email}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>{participant.phone}</span>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span className="line-clamp-2">{participant.address}</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Creado:
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(participant.createdAt).toLocaleDateString('es-PE')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingParticipant && (
        <ParticipantModal
          isOpen={!!editingParticipant}
          onClose={() => setEditingParticipant(null)}
          participant={editingParticipant}
        />
      )}

      {deletingParticipant && (
        <ParticipantDeleteDialog
          isOpen={!!deletingParticipant}
          onClose={() => setDeletingParticipant(null)}
          participant={deletingParticipant}
        />
      )}
    </>
  );
};

export default ParticipantesCards;
