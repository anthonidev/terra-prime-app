'use client';

import { FilePlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/shared/components/common/page-header';
import { Stepper, type Step } from '@/shared/components/common/stepper';
import { useCreateSaleForm } from '../../hooks/use-create-sale-form';
import { SaleType, type SalesFormData } from '../../types';
import { SaleSuccessModal } from '../dialogs/sale-success-modal';
import { SalesStep1 } from '../steps/sales-step-1';
import { SalesStep2 } from '../steps/sales-step-2';
import { SalesStep3 } from '../steps/sales-step-3';
import { SalesStep4 } from '../steps/sales-step-4';
import { SalesStep5 } from '../steps/sales-step-5';

const STEPS: Step[] = [
  { id: 1, label: 'Lote', description: 'Seleccionar proyecto y lote' },
  { id: 2, label: 'Tipo de Venta', description: 'Tipo y separación' },
  { id: 3, label: 'Financiamiento', description: 'Amortización' },
  { id: 4, label: 'Cliente', description: 'Datos del cliente' },
  { id: 5, label: 'Confirmar', description: 'Revisar y confirmar' },
];

export function CreateSaleContainer() {
  const {
    currentStep,
    formData,
    showSuccessModal,
    createdSale,
    isSubmitting,
    setShowSuccessModal,
    handleStep1Next,
    handleStep2Next,
    handleStep3Next,
    handleStep4Next,
    handleBack,
    handleSubmit,
  } = useCreateSaleForm();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crear Nueva Venta"
        description="Registra una nueva venta en el sistema siguiendo los pasos a continuación."
        icon={FilePlus}
      />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Proceso de Registro</CardTitle>
          <CardDescription>
            Completa cada paso para registrar la venta correctamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Stepper steps={STEPS} currentStep={currentStep} className="mb-8" />

          <div className="mt-8">
            {currentStep === 1 && (
              <SalesStep1
                data={
                  formData.step1 || {
                    projectId: '',
                    projectName: '',
                    projectCurrency: '',
                    stageId: '',
                    stageName: '',
                    blockId: '',
                    blockName: '',
                    selectedLot: null,
                  }
                }
                onNext={handleStep1Next}
              />
            )}

            {currentStep === 2 && formData.step1 && (
              <SalesStep2
                data={
                  formData.step2 || {
                    saleType: SaleType.DIRECT_PAYMENT,
                    isReservation: false,
                  }
                }
                onNext={handleStep2Next}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && formData.step1 && formData.step2 && (
              <SalesStep3
                data={
                  formData.step3 || {
                    totalAmount: parseFloat(formData.step1.selectedLot?.lotPrice || '0'),
                    totalAmountUrbanDevelopment: parseFloat(
                      formData.step1.selectedLot?.urbanizationPrice || '0'
                    ),
                  }
                }
                saleType={formData.step2.saleType}
                selectedLot={formData.step1.selectedLot!}
                projectCurrency={
                  (formData.step1.selectedLot?.projectCurrency ||
                    formData.step1.projectCurrency ||
                    'PEN') as 'USD' | 'PEN'
                }
                reservationAmount={formData.step2.reservationAmount}
                onNext={handleStep3Next}
                onBack={handleBack}
              />
            )}

            {currentStep === 4 && (
              <SalesStep4
                data={
                  formData.step4 || {
                    leadId: '',
                    clientAddress: '',
                  }
                }
                onNext={handleStep4Next}
                onBack={handleBack}
              />
            )}

            {currentStep === 5 &&
              formData.step1 &&
              formData.step2 &&
              formData.step3 &&
              formData.step4 && (
                <SalesStep5
                  formData={formData as SalesFormData}
                  onSubmit={handleSubmit}
                  onBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              )}
          </div>
        </CardContent>
      </Card>

      <SaleSuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        sale={createdSale}
      />
    </div>
  );
}
