'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Lead } from '@/types/leads.types';
import { Eye, LogOut, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { registerDeparture } from '../../action';

interface LeadActionsButtonProps {
  lead: Lead;
}

export default function LeadActionsButton({ lead }: LeadActionsButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleViewDetails = () => {
    router.push(`/leads/detalle/${lead.id}`);
  };

  const handleRegisterDeparture = async () => {
    if (!lead.isInOffice) {
      toast.error('El lead no se encuentra en la oficina');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerDeparture(lead.id);

      if (result.success) {
        toast.success('Salida registrada correctamente');
        router.refresh();
      } else {
        toast.error(result.error || 'Error al registrar la salida');
      }
    } catch {
      toast.error('Error al registrar la salida');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalles
        </DropdownMenuItem>

        {lead.isInOffice && (
          <DropdownMenuItem onClick={handleRegisterDeparture} disabled={isLoading}>
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? 'Registrando...' : 'Registrar salida'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
