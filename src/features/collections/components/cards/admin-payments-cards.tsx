'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/shared/lib/utils';
import { AdminPayment } from '../../types';
import { getShortConceptName } from '../sale-detail/payment-concept-config';
import { Calendar, User, MapPin, FileText, DollarSign, UserCheck } from 'lucide-react';
import { statusConfig } from '@/features/payments/components/shared/status-config';

interface AdminPaymentsCardsProps {
  data: AdminPayment[];
}

export function AdminPaymentsCards({ data }: AdminPaymentsCardsProps) {
  return (
    <div className="space-y-4">
      {data.map((payment) => {
        const config = statusConfig[payment.status];
        const currency = payment.currency;
        const symbol = currency === 'USD' ? '$' : 'S/';
        const shortName = getShortConceptName(payment.paymentConfig.code);

        return (
          <Card key={payment.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">{shortName}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(payment.createdAt).toLocaleDateString('es-PE')}
                  </span>
                </div>
                <Badge variant={config.variant}>{config.label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Cliente */}
              <div className="flex items-start gap-2">
                <User className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {payment.client.lead.firstName} {payment.client.lead.lastName}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {payment.client.lead.document}
                  </span>
                </div>
              </div>

              {/* Lote */}
              <div className="flex items-start gap-2">
                <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {payment.lot.project} - {payment.lot.stage}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Mz. {payment.lot.block} Lt. {payment.lot.name}
                  </span>
                </div>
              </div>

              {/* Registrado por */}
              <div className="flex items-start gap-2">
                <UserCheck className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {payment.user.firstName} {payment.user.lastName}
                  </span>
                  <span className="text-muted-foreground text-xs">{payment.user.email}</span>
                </div>
              </div>

              {/* Monto */}
              <div className="flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">Monto</span>
                </div>
                <span className="text-lg font-bold">
                  {symbol} {formatCurrency(payment.amount)}
                </span>
              </div>

              {/* N° Boleta */}
              {payment.numberTicket && (
                <div className="flex items-center gap-2">
                  <FileText className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                  <span className="text-muted-foreground text-xs">N° Boleta:</span>
                  <span className="text-xs">{payment.numberTicket}</span>
                </div>
              )}

              {/* Fecha de revisión */}
              {payment.reviewedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                  <span className="text-muted-foreground text-xs">Revisado:</span>
                  <span className="text-xs">
                    {new Date(payment.reviewedAt).toLocaleDateString('es-PE')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
