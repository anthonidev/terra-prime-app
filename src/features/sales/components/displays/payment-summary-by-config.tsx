'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Landmark, Receipt, Banknote } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import type { PaymentSummary, CurrencyType } from '../../types';

interface PaymentSummaryByConfigProps {
  payments: PaymentSummary[];
  currency: CurrencyType;
}

// Map payment config names to icons
const configIcons: Record<string, React.ElementType> = {
  'Pago de Venta': CreditCard,
  'Pago de Reserva': Receipt,
  'Pago de Inicial': Banknote,
  'Pago de Cuota': Landmark,
};

// Map payment config names to colors
const configColors: Record<string, string> = {
  'Pago de Venta': 'text-blue-600 bg-blue-500/10',
  'Pago de Reserva': 'text-purple-600 bg-purple-500/10',
  'Pago de Inicial': 'text-green-600 bg-green-500/10',
  'Pago de Cuota': 'text-orange-600 bg-orange-500/10',
};

export function PaymentSummaryByConfig({ payments, currency }: PaymentSummaryByConfigProps) {
  // Calculate totals by paymentConfig, excluding cancelled payments
  const configEntries = useMemo(() => {
    if (!payments || payments.length === 0) return [];

    const summary: Record<string, { total: number; count: number }> = {};

    payments.forEach((payment) => {
      // Exclude cancelled payments
      if (payment.status === 'CANCELLED') {
        return;
      }

      const config = payment.paymentConfig;
      if (!summary[config]) {
        summary[config] = { total: 0, count: 0 };
      }
      summary[config].total += payment.amount;
      summary[config].count += 1;
    });

    // Convert to array and sort by config name for consistent ordering
    return Object.entries(summary).sort(([a], [b]) => a.localeCompare(b));
  }, [payments]);

  if (configEntries.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {configEntries.map(([config, { total, count }]) => {
        const Icon = configIcons[config] || CreditCard;
        const colorClass = configColors[config] || 'text-primary bg-primary/10';
        const [iconColor, bgColor] = colorClass.split(' ');

        return (
          <Card key={config} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`rounded-lg p-2.5 ${bgColor}`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground truncate text-xs font-medium">{config}</p>
                  <p className="text-lg font-bold">{formatCurrency(total, currency)}</p>
                  <p className="text-muted-foreground text-xs">
                    {count} {count === 1 ? 'pago' : 'pagos'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
