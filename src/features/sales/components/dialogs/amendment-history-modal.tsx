'use client';

import { Download } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { formatDateOnly } from '@/shared/utils/date-formatter';
import type { AmendmentHistoryItem, CurrencyType } from '../../types';

interface AmendmentHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amendments: AmendmentHistoryItem[];
  currency: CurrencyType;
}

export function AmendmentHistoryModal({
  open,
  onOpenChange,
  amendments,
  currency,
}: AmendmentHistoryModalProps) {
  const sorted = [...amendments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Historial de Adendas</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
          {sorted.map((amendment, index) => (
            <div key={amendment.id} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Adenda #{sorted.length - index}</Badge>
                  <span className="text-muted-foreground text-sm">
                    {formatDateOnly(amendment.createdAt, 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
                {amendment.fileUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(amendment.fileUrl, '_blank')}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    Excel
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="text-muted-foreground">Total cuotas:</div>
                <div className="text-right font-medium">
                  {formatCurrency(amendment.totalCouteAmount, currency)}
                </div>

                <div className="text-muted-foreground">Total pagado:</div>
                <div className="text-right font-medium text-green-600">
                  {formatCurrency(amendment.totalPaid, currency)}
                </div>

                <div className="text-muted-foreground">Total pendiente:</div>
                <div className="text-right font-medium text-orange-600">
                  {formatCurrency(amendment.totalPending, currency)}
                </div>

                {amendment.totalLateFee > 0 && (
                  <>
                    <div className="text-muted-foreground">Mora acumulada:</div>
                    <div className="text-right font-medium text-red-600">
                      {formatCurrency(amendment.totalLateFee, currency)}
                    </div>
                  </>
                )}

                {amendment.additionalAmount !== 0 && (
                  <>
                    <div className="text-muted-foreground">
                      {amendment.additionalAmount > 0 ? 'Monto adicional:' : 'Descuento:'}
                    </div>
                    <div
                      className={`text-right font-medium ${amendment.additionalAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}
                    >
                      {amendment.additionalAmount > 0 ? '+' : ''}
                      {formatCurrency(amendment.additionalAmount, currency)}
                    </div>
                  </>
                )}

                <div className="text-muted-foreground">Cuotas anteriores:</div>
                <div className="text-right font-medium">{amendment.previousInstallmentsCount}</div>

                <div className="text-muted-foreground">Cuotas nuevas:</div>
                <div className="text-right font-medium">{amendment.newInstallmentsCount}</div>
              </div>

              {amendment.observation && (
                <div className="bg-muted/50 mt-3 rounded-md p-2 text-sm">
                  <span className="text-muted-foreground font-medium">Observación: </span>
                  {amendment.observation}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
