'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LeadsOfDay } from '@domain/entities/sales/leadsvendors.entity';
import { Eye, FileArchive, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { generateLeadReport, regenerateLeadReport } from '@infrastructure/server-actions/sales.actions';

interface LeadActionsButtonProps {
  lead: LeadsOfDay;
}

export default function LeadActionsButton({ lead }: LeadActionsButtonProps) {
  const router = useRouter();
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const handleViewDetails = () => {
    // Assuming there will be a details page for leads of day
    router.push(`/leads/detalle/${lead.id}`);
  };

  const handleGenerateReport = async () => {
    setIsPdfLoading(true);
    try {
      const result = await generateLeadReport(lead.id);
      if (result?.success) {
        toast.success('Reporte de bienvenida generado correctamente');
        router.refresh();
      } else {
        toast.error('Error al generar el reporte de bienvenida');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al generar el reporte de bienvenida');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleRegenerateReport = async () => {
    setIsPdfLoading(true);
    try {
      const result = await regenerateLeadReport(lead.id);
      if (result?.success) {
        toast.success('Reporte de bienvenida regenerado correctamente');
        router.refresh();
      } else {
        toast.error('Error al regenerar el reporte de bienvenida');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al regenerar el reporte de bienvenida');
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

        {!lead.reportPdfUrl ? (
          <DropdownMenuItem onClick={handleGenerateReport} disabled={isPdfLoading}>
            <FileArchive className="mr-2 h-4 w-4" />
            {isPdfLoading ? 'Generando...' : 'Generar bienvenida'}
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem 
              onClick={() => lead.reportPdfUrl && window.open(lead.reportPdfUrl, '_blank')}
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver bienvenida
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRegenerateReport} disabled={isPdfLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {isPdfLoading ? 'Regenerando...' : 'Regenerar bienvenida'}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}