'use client';

import { motion } from 'framer-motion';
import { Calculator, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/shared/utils/currency-formatter';
import { formatDateOnly } from '@/shared/utils/date-formatter';
import type { Step3Data } from '../../../types';

interface PaymentSummaryCardProps {
  step3: Step3Data;
  isFinanced: boolean;
  hasUrbanization: boolean;
  currencyType: 'USD' | 'PEN';
}

export function PaymentSummaryCard({
  step3,
  isFinanced,
  hasUrbanization,
  currencyType,
}: PaymentSummaryCardProps) {
  const paymentDetails = [
    {
      label: 'Monto Total Lote',
      value: formatCurrency(step3.totalAmount, currencyType),
      show: true,
    },
    {
      label: 'Cuota Inicial',
      value: formatCurrency(step3.initialAmount || 0, currencyType),
      show: isFinanced,
    },
    {
      label: 'Tasa de Interés',
      value:
        step3.interestRateSections?.length === 1
          ? `${step3.interestRateSections[0].interestRate}% mensual`
          : `${step3.interestRateSections?.length ?? 0} tramos`,
      show: isFinanced,
    },
    {
      label: 'Cantidad de Cuotas',
      value: `${step3.quantitySaleCoutes} cuotas`,
      show: isFinanced,
    },
    {
      label: 'Primera Cuota',
      value: step3.firstPaymentDate ? formatDateOnly(step3.firstPaymentDate, 'dd/MM/yyyy') : 'N/A',
      show: isFinanced,
    },
    {
      label: 'Cuotas HU',
      value: `${step3.quantityHuCuotes} cuotas`,
      show: hasUrbanization,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Calculator className="text-primary h-5 w-5" />
            </div>
            Detalles de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Payment Details Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {paymentDetails
                .filter((detail) => detail.show)
                .map((detail, index) => (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    className="space-y-1"
                  >
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      {detail.label}
                    </p>
                    <p className="font-semibold">{detail.value}</p>
                  </motion.div>
                ))}
            </div>

            {/* Amortization Summary */}
            {isFinanced && step3.amortizationMeta && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-muted/30 rounded-lg p-4"
              >
                <div className="mb-4 flex items-center gap-2 border-b pb-2">
                  <TrendingUp className="text-primary h-4 w-4" />
                  <h4 className="font-semibold">Resumen de Amortización</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {/* Lot Total */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 }}
                    className="bg-background rounded-lg border p-3 shadow-sm"
                  >
                    <p className="text-muted-foreground mb-1 text-xs">Total Lote</p>
                    <p className="font-semibold">
                      {formatCurrency(step3.amortizationMeta.lotTotalAmount, currencyType)}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {step3.amortizationMeta.lotInstallmentsCount} cuotas
                    </p>
                  </motion.div>

                  {/* HU Total */}
                  {hasUrbanization && step3.amortizationMeta.huInstallmentsCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-background rounded-lg border p-3 shadow-sm"
                    >
                      <p className="text-muted-foreground mb-1 text-xs">Total HU</p>
                      <p className="font-semibold">
                        {formatCurrency(step3.amortizationMeta.huTotalAmount, currencyType)}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {step3.amortizationMeta.huInstallmentsCount} cuotas
                      </p>
                    </motion.div>
                  )}

                  {/* General Total */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.55 }}
                    className="bg-primary/5 border-primary/20 rounded-lg border p-3"
                  >
                    <p className="text-muted-foreground mb-1 text-xs">Total General</p>
                    <p className="text-primary text-base font-semibold">
                      {formatCurrency(step3.amortizationMeta.totalAmount, currencyType)}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {step3.amortizationMeta.totalInstallmentsCount} cuotas totales
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
