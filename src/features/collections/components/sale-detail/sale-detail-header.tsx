'use client';

import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/shared/components/common/page-header';
import { StatusSale, type GetSaleDetailResponse } from '../../types';

interface SaleDetailHeaderProps {
  data: GetSaleDetailResponse;
}

const statusConfig: Record<
  StatusSale,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  [StatusSale.RESERVATION_PENDING]: { label: 'Reserva Pendiente', variant: 'outline' },
  [StatusSale.RESERVATION_PENDING_APPROVAL]: { label: 'Reserva por Aprobar', variant: 'secondary' },
  [StatusSale.RESERVED]: { label: 'Reservado', variant: 'default' },
  [StatusSale.PENDING]: { label: 'Pendiente', variant: 'outline' },
  [StatusSale.PENDING_APPROVAL]: { label: 'Por Aprobar', variant: 'secondary' },
  [StatusSale.APPROVED]: { label: 'Aprobado', variant: 'default' },
  [StatusSale.IN_PAYMENT_PROCESS]: { label: 'En Proceso de Pago', variant: 'default' },
  [StatusSale.COMPLETED]: { label: 'Completado', variant: 'default' },
  [StatusSale.REJECTED]: { label: 'Rechazado', variant: 'destructive' },
  [StatusSale.WITHDRAWN]: { label: 'Retirado', variant: 'destructive' },
};

export function SaleDetailHeader({ data }: SaleDetailHeaderProps) {
  const { client, sale } = data;
  const status = statusConfig[sale.status];

  const handleOpenPdf = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Venta - ${client.firstName} ${client.lastName}`}
        description={`Lote ${sale.lot.block}-${sale.lot.name} • ${sale.lot.project}`}
      >
        <div className="flex items-center gap-2">
          <Badge variant={status.variant} className="px-3 py-1 text-sm">
            {status.label}
          </Badge>
          {sale.radicationPdfUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenPdf(sale.radicationPdfUrl!)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Radicación
            </Button>
          )}
          {sale.paymentAcordPdfUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenPdf(sale.paymentAcordPdfUrl!)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Acuerdo de Pago
            </Button>
          )}
        </div>
      </PageHeader>
    </div>
  );
}
