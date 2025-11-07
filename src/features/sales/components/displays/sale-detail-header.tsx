'use client';

import { FileDown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { StatusSale } from '../../types';

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
  WITHDRAWN: { label: 'Retirado', variant: 'destructive' },
};

interface SaleDetailHeaderProps {
  clientName: string;
  status: StatusSale;
  radicationPdfUrl?: string | null;
  paymentAcordPdfUrl?: string | null;
}

export function SaleDetailHeader({
  clientName,
  status,
  radicationPdfUrl,
  paymentAcordPdfUrl,
}: SaleDetailHeaderProps) {
  const config = statusConfig[status];

  const handleDownload = (url: string, filename: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/ventas/mis-ventas">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Mis Ventas
        </Link>
      </Button>

      {/* Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
          {radicationPdfUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(radicationPdfUrl, 'radicacion.pdf')}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Radicación
            </Button>
          )}
          {paymentAcordPdfUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(paymentAcordPdfUrl, 'acuerdo-pago.pdf')}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Acuerdo de Pago
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
