'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, ExternalLink, Landmark, CreditCard, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { PaymentDetail } from '../../types';

interface VouchersSectionProps {
  payment: PaymentDetail;
}

export function VouchersSection({ payment }: VouchersSectionProps) {
  const vouchers = payment.vouchers || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Comprobantes de Pago
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vouchers.length === 0 ? (
          <div className="py-8 text-center">
            <FileText className="text-muted-foreground/50 mx-auto mb-3 h-12 w-12" />
            <p className="text-muted-foreground text-sm">No hay comprobantes de pago registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vouchers.map((voucher, index) => (
              <div key={voucher.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="space-y-3">
                  {/* Voucher Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold">Comprobante #{voucher.id}</h4>
                      <p className="text-muted-foreground text-sm">
                        Ref: {voucher.transactionReference}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={voucher.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver
                      </a>
                    </Button>
                  </div>

                  {/* Voucher Details Grid */}
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <DollarSign className="text-muted-foreground mt-0.5 h-4 w-4" />
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">Monto</p>
                        <p className="text-base font-semibold">
                          {payment.currency === 'USD' ? '$' : 'S/'}{' '}
                          {voucher.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Landmark className="text-muted-foreground mt-0.5 h-4 w-4" />
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">Banco</p>
                        <p className="text-base">{voucher.bankName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <CreditCard className="text-muted-foreground mt-0.5 h-4 w-4" />
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">
                          Referencia de Transacción
                        </p>
                        <p className="font-mono text-base text-sm">
                          {voucher.transactionReference}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="text-muted-foreground mt-0.5 h-4 w-4" />
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">
                          Fecha de Transacción
                        </p>
                        <p className="text-base">
                          {format(new Date(voucher.transactionDate), "dd 'de' MMMM, yyyy", {
                            locale: es,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
