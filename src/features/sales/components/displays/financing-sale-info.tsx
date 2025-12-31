import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, User, FileText, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/utils';
import { statusConfig } from '../shared/status-config';
import type { FinancingDetailSale, StatusSale } from '../../types';

interface FinancingSaleInfoProps {
  sale: FinancingDetailSale;
}

export function FinancingSaleInfo({ sale }: FinancingSaleInfoProps) {
  const statusInfo = statusConfig[sale.status as StatusSale];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información de la Venta
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
            <p className="font-medium">{sale.client.fullName}</p>
            <p className="text-muted-foreground text-sm">
              {sale.client.documentType}: {sale.client.document}
            </p>
          </div>

          {/* Lot Info */}
          <div className="space-y-1">
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <Building2 className="h-4 w-4" />
              Lote
            </div>
            <p className="font-medium">Lote {sale.lot.name}</p>
            <p className="text-muted-foreground text-sm">
              {sale.lot.project} - {sale.lot.stage} - Mz. {sale.lot.block}
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
            <p className="font-medium">{formatCurrency(sale.totalAmount)}</p>
            <p className="text-muted-foreground text-sm">
              Pagado: {formatCurrency(sale.totalAmountPaid)}
            </p>
          </div>

          {/* Reservation Amount */}
          {sale.reservationAmount > 0 && (
            <div className="space-y-1">
              <div className="text-muted-foreground text-sm">Monto de Reserva</div>
              <p className="font-medium">{formatCurrency(sale.reservationAmount)}</p>
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
