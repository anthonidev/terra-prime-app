'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calculator, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePaymentConfigForm } from '../../hooks/use-payment-config-form';
import { LotPaymentInfo } from './components/lot-payment-info';
import { FinancedPaymentFields } from './components/financed-payment-fields';
import { UrbanizationConfig } from './components/urbanization-config';
import { AmortizationTable } from './components/amortization-table';
import { SaleType, type ProjectLotResponse, type Step3Data } from '../../types';

interface SalesStep3Props {
  data?: Step3Data;
  saleType: SaleType;
  selectedLot: ProjectLotResponse;
  reservationAmount?: number;
  onNext: (data: Step3Data) => void;
  onBack: () => void;
}

export function SalesStep3({
  data,
  saleType,
  selectedLot,
  reservationAmount,
  onNext,
  onBack,
}: SalesStep3Props) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Lot Payment Info */}
      <LotPaymentInfo
        selectedLot={selectedLot}
        lotPrice={lotPrice}
        urbanizationPrice={urbanizationPrice}
        hasUrbanization={hasUrbanization}
        isEditEnabled={isEditEnabled}
        onEditEnabledChange={setIsEditEnabled}
        onLotPriceChange={setEditableLotPrice}
        onUrbanizationPriceChange={setEditableUrbanizationPrice}
      />

      {/* Financed Payment Fields */}
      {!isDirectPayment && (
        <FinancedPaymentFields
          form={financedForm}
          lotPrice={lotPrice}
          currency={selectedLot.projectCurrency}
          isLocked={isLocked}
        />
      )}

      {/* Urbanization Configuration */}
      {hasUrbanization && (
        <UrbanizationConfig
          form={isDirectPayment ? (directForm as any) : (financedForm as any)}
          urbanizationPrice={urbanizationPrice}
          currency={selectedLot.projectCurrency}
        />
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
        <AmortizationTable
          amortization={amortization}
          isCalculating={isCalculating}
          hasUrbanization={hasUrbanization}
          currency={selectedLot.projectCurrency}
        />
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
          disabled={!isDirectPayment && (isCalculating || !amortization)}
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
