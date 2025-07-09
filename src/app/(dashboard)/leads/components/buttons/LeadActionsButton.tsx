'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Lead } from '@/types/leads.types';
import { Eye, FileArchive, LogOut, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { generateReport, regenerateReport, registerDeparture } from '../../action';

interface LeadActionsButtonProps {
  lead: Lead;
}

export default function LeadActionsButton({ lead }: LeadActionsButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

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

  const handleGenerateReport = async () => {
    setIsPdfLoading(true);
    try {
      const result = await generateReport(lead.id);
      if (result?.success) {
        toast.success('Reporte generado correctamente');
        router.refresh();
      } else {
        toast.error('Error al generar el reporte');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al generar el reporte');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleRegenerateReport = async () => {
    setIsPdfLoading(true);
    try {
      const result = await regenerateReport(lead.id);
      if (result?.success) {
        toast.success('Reporte regenerado correctamente');
        router.refresh();
      } else {
        toast.error('Error al regenerar el reporte');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al regenerar el reporte');
    } finally {
      setIsPdfLoading(false);
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

        {!lead.reportPdfUrl ? (
          <DropdownMenuItem onClick={handleGenerateReport} disabled={isPdfLoading}>
            <FileArchive className="mr-2 h-4 w-4" />
            {isPdfLoading ? 'Generando...' : 'Generar bienvenido'}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleRegenerateReport} disabled={isPdfLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {isPdfLoading ? 'Regenerando...' : 'Regenerar bienvenido'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
