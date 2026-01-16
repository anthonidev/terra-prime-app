'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  DollarSign,
  ExternalLink,
  FileText,
  Hash,
  Image as ImageIcon,
  Landmark,
  Pencil,
} from 'lucide-react';
import { useState } from 'react';
import { EditVoucherModal } from '../dialogs/edit-voucher-modal';
import type { PaymentDetail, PaymentVoucher } from '../../types';

interface VouchersSectionProps {
  payment: PaymentDetail;
}

export function VouchersSection({ payment }: VouchersSectionProps) {
  const vouchers = payment.vouchers || [];
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<PaymentVoucher | null>(null);

  const handleEdit = (voucher: PaymentVoucher) => {
    setSelectedVoucher(voucher);
    setEditModalOpen(true);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <ImageIcon className="text-primary h-5 w-5" />
          Comprobantes de Pago
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vouchers.length === 0 ? (
          <div className="border-muted bg-muted/10 rounded-lg border-2 border-dashed py-12 text-center">
            <FileText className="text-muted-foreground/40 mx-auto mb-3 h-12 w-12" />
            <p className="text-muted-foreground font-medium">No hay comprobantes registrados</p>
            <p className="text-muted-foreground/70 mt-1 text-xs">
              Los comprobantes adjuntos aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="group bg-card text-card-foreground relative overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md"
              >
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 rounded-md p-1.5">
                          <FileText className="text-primary h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-semibold">Comprobante #{voucher.id}</h4>
                      </div>
                      <p className="text-muted-foreground pl-8 text-xs">
                        Ref: <span className="font-mono">{voucher.transactionReference}</span>
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8" asChild>
                      <a href={voucher.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-3.5 w-3.5" />
                        Ver
                      </a>
                    </Button>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <DollarSign className="h-3.5 w-3.5" />
                        Monto
                      </p>
                      <p className="font-semibold">
                        {payment.currency === 'USD' ? '$' : 'S/'}{' '}
                        {voucher.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3.5 w-3.5" />
                        Fecha
                      </p>
                      <p className="font-medium">
                        {format(new Date(voucher.transactionDate), 'dd MMM yyyy', { locale: es })}
                      </p>
                    </div>

                    <div className="col-span-2 space-y-1">
                      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Landmark className="h-3.5 w-3.5" />
                        Banco
                      </p>
                      <p className="truncate font-medium" title={voucher.bankName}>
                        {voucher.bankName}
                      </p>
                    </div>

                    <div className="col-span-2 space-y-1">
                      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <Hash className="h-3.5 w-3.5" />
                        Código de Operación
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium">
                          {voucher.codeOperation || (
                            <span className="text-muted-foreground italic">Sin código</span>
                          )}
                        </p>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-muted-foreground hover:text-primary h-6 w-6"
                          onClick={() => handleEdit(voucher)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative gradient at bottom */}
                <div className="from-primary/40 to-primary/10 absolute right-0 bottom-0 left-0 h-1 bg-linear-to-r opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Voucher Modal */}
      <EditVoucherModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        voucher={selectedVoucher}
        paymentId={payment.id.toString()}
        paymentStatus={payment.status}
      />
    </Card>
  );
}
