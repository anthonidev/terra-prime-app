'use client';

import { motion } from 'framer-motion';
import { Check, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSaleSummary } from '../../hooks/use-sale-summary';
import { LotSummaryCard } from './components/lot-summary-card';
import { SaleTypeSummaryCard } from './components/sale-type-summary-card';
import { PaymentSummaryCard } from './components/payment-summary-card';
import { ClientsSummaryCard } from './components/clients-summary-card';
import type { SalesFormData } from '../../types';

interface SalesStep5Props {
  formData: SalesFormData;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function SalesStep5({ formData, onSubmit, onBack, isSubmitting }: SalesStep5Props) {
  const summary = useSaleSummary({ formData });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/10">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              Resumen de la Venta
            </CardTitle>
            <CardDescription>Revise todos los detalles antes de confirmar la venta</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Lot Summary */}
      <LotSummaryCard
        selectedLot={summary.step1.selectedLot!}
        currencyType={summary.currencyType}
      />

      {/* Sale Type Summary */}
      <SaleTypeSummaryCard
        saleType={summary.step2.saleType}
        saleTypeLabel={summary.saleTypeLabel}
        isReservation={summary.hasReservation}
        reservationAmount={summary.step2.reservationAmount}
        maximumHoldPeriod={summary.step2.maximumHoldPeriod}
      />

      {/* Payment Summary */}
      <PaymentSummaryCard
        step3={summary.step3}
        isFinanced={summary.isFinanced}
        hasUrbanization={summary.hasUrbanization}
        currencyType={summary.currencyType}
      />

      {/* Clients Summary */}
      <ClientsSummaryCard
        step4={summary.step4}
        hasGuarantor={summary.hasGuarantor}
        hasSecondaryClients={summary.hasSecondaryClients}
      />

      {/* Confirmation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full">
                <Check className="text-primary h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold">Confirme los datos antes de continuar</p>
                <p className="text-muted-foreground text-sm">
                  Una vez confirmada, la venta será registrada en el sistema
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between pt-2"
      >
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          size="lg"
          className="min-w-32"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting} size="lg" className="min-w-48">
          {isSubmitting ? 'Registrando Venta...' : 'Confirmar y Registrar Venta'}
        </Button>
      </motion.div>
    </div>
  );
}
