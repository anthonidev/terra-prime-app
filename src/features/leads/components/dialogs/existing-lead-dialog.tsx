'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ExistingLeadDialogProps {
  open: boolean;
  leadName: string;
  onAccept: () => void;
  onCancel: () => void;
}

export function ExistingLeadDialog({
  open,
  leadName,
  onAccept,
  onCancel,
}: ExistingLeadDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Lead Existente</AlertDialogTitle>
          <AlertDialogDescription>
            El lead <strong>{leadName}</strong> ya existe en el sistema. ¿Desea cargar sus datos
            para crear un nuevo registro de visita?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onAccept}>Aceptar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
