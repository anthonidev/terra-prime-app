'use client';

import { useEffect, useRef } from 'react';
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

  // Refs for auto-scrolling
  const topRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    // Small delay to ensure layout is ready
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }, []);

  // Auto-scroll to summary when sale type is selected
  useEffect(() => {
    if (saleType && summaryRef.current) {
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [saleType]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div ref={topRef} className="scroll-mt-20" />

      {/* Sale Type Selector */}
      <section>
        <SaleTypeSelector
          saleType={saleType}
          onSaleTypeChange={handleSaleTypeChange}
          error={errors.saleType?.message}
        />
      </section>

      {/* Reservation Configuration */}
      <section>
        <ReservationConfig
          form={form}
          isReservation={isReservation}
          onReservationToggle={handleReservationToggle}
        />
      </section>

      {/* Summary */}
      <section ref={summaryRef} className="scroll-mt-6">
        <SaleTypeSummary
          saleType={saleType}
          isReservation={isReservation}
          reservationAmount={reservationAmount}
          maximumHoldPeriod={maximumHoldPeriod}
        />
      </section>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between pt-4"
      >
        <Button type="button" variant="outline" onClick={onBack} size="lg" className="min-w-32">
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
