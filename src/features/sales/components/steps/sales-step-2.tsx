'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSaleTypeForm } from '../../hooks/use-sale-type-form';
import { SaleTypeSelector } from './components/sale-type-selector';
import { ReservationConfig } from './components/reservation-config';
import { SaleTypeSummary } from './components/sale-type-summary';
import type { Step2Data } from '../../types';

interface SalesStep2Props {
  data?: Step2Data;
  onNext: (data: Step2Data) => void;
  onBack: () => void;
}

export function SalesStep2({ data, onNext, onBack }: SalesStep2Props) {
  const {
    form,
    saleType,
    isReservation,
    reservationAmount,
    maximumHoldPeriod,
    handleSaleTypeChange,
    handleReservationToggle,
    handleSubmit,
    errors,
  } = useSaleTypeForm({
    initialData: data,
    onSubmit: onNext,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sale Type Selector */}
      <SaleTypeSelector
        saleType={saleType}
        onSaleTypeChange={handleSaleTypeChange}
        error={errors.saleType?.message}
      />

      {/* Reservation Configuration */}
      <ReservationConfig
        form={form}
        isReservation={isReservation}
        onReservationToggle={handleReservationToggle}
      />

      {/* Summary */}
      <SaleTypeSummary
        saleType={saleType}
        isReservation={isReservation}
        reservationAmount={reservationAmount}
        maximumHoldPeriod={maximumHoldPeriod}
      />

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between pt-2"
      >
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          size="lg"
          className="min-w-32"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <Button type="submit" size="lg" className="min-w-32">
          Siguiente
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </form>
  );
}
