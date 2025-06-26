'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Participant } from '@domain/entities/sales/participant.entity';
import { deleteParticipant } from '@infrastructure/server-actions/participant.actions';
import { Button } from '@/components/ui/button';

interface ParticipantDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  participant: Participant;
}

export default function ParticipantDeleteDialog({
  isOpen,
  onClose,
  participant
}: ParticipantDeleteDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteParticipant(participant.id);
      toast.success('Participante eliminado exitosamente');
      router.refresh();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar el participante');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar participante?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el participante{' '}
            <strong>
              {participant.firstName} {participant.lastName}
            </strong>{' '}
            y todos sus datos asociados.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose disabled={isDeleting}>Cancelar</DialogClose>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
