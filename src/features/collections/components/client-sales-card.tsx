'use client';

import Link from 'next/link';
import { Calendar, CreditCard, User, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/shared/lib/utils';
import { StatusSale, type SaleItem } from '../types';

interface ClientSalesCardProps {
  sale: SaleItem;
  clientId: string;
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

export function ClientSalesCard({ sale, clientId }: ClientSalesCardProps) {
  const status = statusConfig[sale.status];

  const handleOpenPdf = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <Link href={`/cobranza/clientes/ventas/${clientId}/${sale.id}`}>
      <Card className="hover:bg-muted/50 flex h-full cursor-pointer flex-col transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {sale.lot.project} - {sale.lot.stage}
          </CardTitle>
          <Badge variant={status.variant}>{status.label}</Badge>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <div className="mt-2 grid flex-1 gap-2 text-sm">
            <div className="text-lg font-bold">
              Lote {sale.lot.block}-{sale.lot.name}
            </div>

            <div className="text-muted-foreground flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              {formatCurrency(Number(sale.totalAmount))} {sale.currency}
            </div>

            <div className="text-muted-foreground flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(sale.createdAt).toLocaleDateString()}
            </div>

            <div className="text-muted-foreground flex items-center">
              <User className="mr-2 h-4 w-4" />
              Vendedor: {sale.vendor.firstName} {sale.vendor.lastName}
            </div>

            {sale.financing && (
              <div className="text-muted-foreground mt-2 border-t pt-2 text-xs">
                <p>Financiamiento: {sale.financing.quantityCoutes} cuotas</p>
                <p>Inicial: {formatCurrency(Number(sale.financing.initialAmount))}</p>
              </div>
            )}
          </div>

          {(sale.radicationPdfUrl || sale.paymentAcordPdfUrl) && (
            <div className="mt-4 flex flex-wrap gap-2 border-t pt-2">
              {sale.radicationPdfUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={(e) => handleOpenPdf(e, sale.radicationPdfUrl!)}
                >
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                  Radicación
                </Button>
              )}
              {sale.paymentAcordPdfUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={(e) => handleOpenPdf(e, sale.paymentAcordPdfUrl!)}
                >
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                  Acuerdo de Pago
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
