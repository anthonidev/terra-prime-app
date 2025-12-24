'use client';

import { FileDown, ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { StatusSale } from '../../types';
import { useExportSaleExcel } from '../../hooks/use-export-sale-excel';

// Status badge configurations
const statusConfig: Record<
  StatusSale,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  RESERVATION_PENDING: { label: 'Reserva Pendiente', variant: 'outline' },
  RESERVATION_PENDING_APPROVAL: { label: 'Reserva Por Aprobar', variant: 'secondary' },
  RESERVED: { label: 'Reservado', variant: 'default' },
  PENDING: { label: 'Pendiente', variant: 'outline' },
  PENDING_APPROVAL: { label: 'Por Aprobar', variant: 'secondary' },
  APPROVED: { label: 'Aprobado', variant: 'default' },
  IN_PAYMENT_PROCESS: { label: 'En Proceso de Pago', variant: 'secondary' },
  COMPLETED: { label: 'Completado', variant: 'default' },
  REJECTED: { label: 'Rechazado', variant: 'destructive' },
  RESERVATION_IN_PAYMENT: { label: 'Reserva en Pago', variant: 'secondary' },
  IN_PAYMENT: { label: 'En Pago', variant: 'secondary' },
  WITHDRAWN: { label: 'Retirado', variant: 'destructive' },
};

interface SaleDetailHeaderProps {
  clientName: string;
  status: StatusSale;
  saleId: string;
  isADM: boolean;
  radicationPdfUrl?: string | null;
  paymentAcordPdfUrl?: string | null;
}

export function SaleDetailHeader({
  clientName,
  status,
  saleId,
  isADM,
  radicationPdfUrl,
  paymentAcordPdfUrl,
}: SaleDetailHeaderProps) {
  const router = useRouter();
  const config = statusConfig[status];
  const exportExcel = useExportSaleExcel();

  const handleDownload = (url: string, filename?: string) => {
    if (!url) return;
    // If a filename is provided, try to trigger a download. Otherwise open in new tab.
    if (filename) {
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch {
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
  };

  const handleExportExcel = () => {
    exportExcel.mutate(saleId);
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      {/* Header info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{clientName}</h1>
          <div className="mt-2">
            <Badge variant={config.variant} className="text-sm">
              {config.label}
            </Badge>
          </div>
        </div>

        {/* Download buttons */}
        <div className="flex flex-wrap gap-2">
          {isADM && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              disabled={exportExcel.isPending}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              {exportExcel.isPending ? 'Descargando...' : 'Descargar Venta'}
            </Button>
          )}
          {radicationPdfUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(radicationPdfUrl, 'radicacion.pdf')}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Radicacion
            </Button>
          )}
          {paymentAcordPdfUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(paymentAcordPdfUrl, 'acuerdo-pago.pdf')}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Acuerdo de Pago
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
