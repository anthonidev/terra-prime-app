'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

interface LeadInOfficeDialogProps {
  open: boolean;
  leadName: string;
  onClose: () => void;
}

export function LeadInOfficeDialog({ open, leadName, onClose }: LeadInOfficeDialogProps) {
  const router = useRouter();

  const handleGoToLeads = () => {
    onClose();
    router.push('/leads');
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Lead en Oficina</AlertDialogTitle>
          <AlertDialogDescription>
            El lead <strong>{leadName}</strong> ya se encuentra en la oficina y no puede ser
            registrado nuevamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleGoToLeads}>Ir a Leads</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
