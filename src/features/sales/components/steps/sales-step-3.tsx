'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calculator, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePaymentConfigForm } from '../../hooks/use-payment-config-form';
import { LotPaymentInfo } from './components/lot-payment-info';
import { FinancedPaymentFields } from './components/financed-payment-fields';
import { InterestRateSectionsConfig } from './components/interest-rate-sections-config';
import { UrbanizationConfig } from './components/urbanization-config';
import { AmortizationTable } from './components/amortization-table';
import { SaleType, type ProjectLotResponse, type Step3Data } from '../../types';

interface SalesStep3Props {
  data?: Step3Data;
  saleType: SaleType;
  selectedLot: ProjectLotResponse;
  projectCurrency: 'USD' | 'PEN';
  reservationAmount?: number;
  onNext: (data: Step3Data) => void;
  onBack: () => void;
}

export function SalesStep3({
  data,
  saleType,
  selectedLot,
  projectCurrency,
  reservationAmount,
  onNext,
  onBack,
}: SalesStep3Props) {
  // Use projectCurrency as reliable source, fallback to lot's currency
  const currency: 'USD' | 'PEN' = selectedLot.projectCurrency || projectCurrency;
  const {
    directForm,
    financedForm,
    amortization,
    isCalculating,
    isDirectPayment,
    hasUrbanization,
    lotPrice,
    urbanizationPrice,
    isLocked,
    isEditEnabled,
    quantitySaleCoutes,
    interestRateSections,
    setInterestRateSections,
    editableAmortization,
    handleGenerateAmortization,
    handleClearAmortization,
    handleSubmit,
    setIsEditEnabled,
    setEditableLotPrice,
    setEditableUrbanizationPrice,
  } = usePaymentConfigForm({
    initialData: data,
    saleType,
    selectedLot,
    reservationAmount,
    onSubmit: onNext,
  });

  // Refs for auto-scroll
  const topRef = useRef<HTMLDivElement>(null);
  const financedFieldsRef = useRef<HTMLDivElement>(null);
  const urbanizationRef = useRef<HTMLDivElement>(null);
  const amortizationRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }, []);

  // Auto-scroll when financed fields appear
  useEffect(() => {
    if (!isDirectPayment && financedFieldsRef.current) {
      setTimeout(() => {
        financedFieldsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [isDirectPayment]);

  // Auto-scroll when amortization table appears
  useEffect(() => {
    if ((amortization || editableAmortization.initialized) && amortizationRef.current) {
      setTimeout(() => {
        amortizationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [amortization, editableAmortization.initialized]);

  const hasAmortization = amortization || editableAmortization.initialized;
  const isAmortizationValid = editableAmortization.initialized
    ? editableAmortization.isValid
    : !!amortization;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div ref={topRef} />
      {/* Lot Payment Info */}
      <LotPaymentInfo
        selectedLot={selectedLot}
        lotPrice={lotPrice}
        urbanizationPrice={urbanizationPrice}
        hasUrbanization={hasUrbanization}
        currency={currency}
        isEditEnabled={isEditEnabled}
        onEditEnabledChange={setIsEditEnabled}
        onLotPriceChange={setEditableLotPrice}
        onUrbanizationPriceChange={setEditableUrbanizationPrice}
      />

      {/* Financed Payment Fields */}
      {!isDirectPayment && (
        <div ref={financedFieldsRef}>
          <FinancedPaymentFields
            form={financedForm}
            lotPrice={lotPrice}
            currency={currency}
            isLocked={isLocked}
          />
        </div>
      )}

      {/* Interest Rate Sections */}
      {!isDirectPayment && quantitySaleCoutes > 0 && (
        <InterestRateSectionsConfig
          sections={interestRateSections}
          totalInstallments={quantitySaleCoutes}
          isLocked={isLocked}
          onSectionsChange={setInterestRateSections}
        />
      )}

      {/* Urbanization Configuration */}
      {hasUrbanization && urbanizationPrice > 0 && (
        <div ref={urbanizationRef}>
          <UrbanizationConfig
            form={isDirectPayment ? (directForm as any) : (financedForm as any)}
            urbanizationPrice={urbanizationPrice}
            currency={currency}
          />
        </div>
      )}

      {/* Generate/Edit Amortization Button */}
      {!isDirectPayment && (
        <AnimatePresence mode="wait">
          {!isLocked ? (
            <motion.div
              key="generate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center"
            >
              <Button
                type="button"
                onClick={handleGenerateAmortization}
                disabled={isCalculating}
                size="lg"
                className="w-full min-w-64 md:w-auto"
              >
                <Calculator className="mr-2 h-4 w-4" />
                {isCalculating ? 'Generando...' : 'Generar Tabla de Amortización'}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center"
            >
              <Button
                type="button"
                onClick={handleClearAmortization}
                variant="outline"
                size="lg"
                className="border-primary/50 hover:bg-primary/10 w-full min-w-64 border-2 md:w-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Editar Configuración
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Amortization Table */}
      {!isDirectPayment && (
        <div ref={amortizationRef}>
          {editableAmortization.initialized ? (
            <AmortizationTable
              amortization={amortization}
              isCalculating={isCalculating}
              hasUrbanization={hasUrbanization && urbanizationPrice > 0}
              currency={currency}
              editable
              editableInstallments={editableAmortization.installments}
              canAddDelete={editableAmortization.canAddDelete}
              meta={editableAmortization.meta}
              isLotBalanceValid={editableAmortization.isLotBalanceValid}
              isHuBalanceValid={editableAmortization.isHuBalanceValid}
              lotBalanceDifference={editableAmortization.lotBalanceDifference}
              huBalanceDifference={editableAmortization.huBalanceDifference}
              expectedLotTotal={editableAmortization.expectedLotTotal}
              expectedHuTotal={editableAmortization.expectedHuTotal}
              onUpdateInstallment={editableAmortization.updateInstallment}
              onDeleteInstallments={editableAmortization.deleteInstallments}
              onAddInstallments={editableAmortization.addInstallments}
              onBulkUpdateLotAmount={editableAmortization.bulkUpdateLotAmount}
              onBulkUpdateHuAmount={editableAmortization.bulkUpdateHuAmount}
              onBulkUpdateDates={editableAmortization.bulkUpdateDates}
              onAdjustLastInstallment={editableAmortization.adjustLastInstallment}
            />
          ) : (
            <AmortizationTable
              amortization={amortization}
              isCalculating={isCalculating}
              hasUrbanization={hasUrbanization && urbanizationPrice > 0}
              currency={currency}
            />
          )}
        </div>
      )}

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between pt-2"
      >
        <Button type="button" variant="outline" onClick={onBack} size="lg" className="min-w-32">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <Button
          type="submit"
          disabled={!isDirectPayment && (isCalculating || !hasAmortization || !isAmortizationValid)}
          size="lg"
          className="min-w-32"
        >
          Siguiente
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </form>
  );
}
