import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, User, FileText, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { statusConfig } from '../shared/status-config';
import type { SaleDetail, StatusSale } from '../../types';

interface SaleInfoCardProps {
  sale: SaleDetail;
}

export function SaleInfoCard({ sale }: SaleInfoCardProps) {
  const statusInfo = statusConfig[sale.status as StatusSale];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const clientName = `${sale.client.firstName} ${sale.client.lastName}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informaci&oacute;n de la Venta
          </CardTitle>
          <Badge variant={statusInfo?.variant || 'outline'}>
            {statusInfo?.label || sale.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Client Info */}
          <div className="space-y-1">
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <User className="h-4 w-4" />
              Cliente
            </div>
            <p className="font-medium">{clientName}</p>
            {sale.client.document && (
              <p className="text-muted-foreground text-sm">DNI: {sale.client.document}</p>
            )}
          </div>

          {/* Lot Info */}
          <div className="space-y-1">
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <Building2 className="h-4 w-4" />
              Lote
            </div>
            <p className="font-medium">Lote {sale.lot?.name}</p>
            <p className="text-muted-foreground text-sm">
              {sale.lot?.project} - {sale.lot?.stage} - Mz. {sale.lot?.block}
            </p>
          </div>

          {/* Contract Date */}
          <div className="space-y-1">
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              Fecha de Contrato
            </div>
            <p className="font-medium">{formatDate(sale.contractDate)}</p>
          </div>

          {/* Total Amount */}
          <div className="space-y-1">
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <DollarSign className="h-4 w-4" />
              Monto Total
            </div>
            <p className="font-medium">{formatCurrency(sale.totalAmount, sale.currency)}</p>
            {sale.totalAmountPaid !== undefined && (
              <p className="text-muted-foreground text-sm">
                Pagado: {formatCurrency(sale.totalAmountPaid, sale.currency)}
              </p>
            )}
          </div>

          {/* Reservation Amount */}
          {sale.reservationAmount != null && sale.reservationAmount > 0 && (
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">Monto de Reserva</div>
              <p className="font-medium">{formatCurrency(sale.reservationAmount, sale.currency)}</p>
              <div className="flex gap-2 text-xs">
                <span className="text-green-600">
                  Pagado: {formatCurrency(sale.reservationAmountPaid ?? 0, sale.currency)}
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-orange-600">
                  Pendiente: {formatCurrency(sale.reservationAmountPending ?? 0, sale.currency)}
                </span>
              </div>
            </div>
          )}

          {/* Sale Type */}
          <div className="space-y-1">
            <div className="text-muted-foreground text-sm">Tipo de Venta</div>
            <Badge variant="secondary">{sale.type === 'FINANCED' ? 'Financiado' : 'Contado'}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
