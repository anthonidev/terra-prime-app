'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import StepIndicator from './StepIndicator';

import SaleSuccessModal from './modals/SaleSuccessModal';

import { CreateSaleFormData } from '../validations/saleValidation';
import { createSale } from '../action';
import { SaleResponse } from '@/types/sales';
import Step1ProjectSelection from './steps/step1/Step1ProjectSelection';
import Step2FinancialConfig from './steps/step2/Step2FinancialConfig';
import Step3ClientGuarantor from './steps/step3/Step3ClientGuarantor';
import Step4Summary from './steps/step4/Step4Summary';

export default function CreateSaleWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saleResult, setSaleResult] = useState<SaleResponse | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Estado del formulario completo
  const [formData, setFormData] = useState<Partial<CreateSaleFormData>>({
    saleType: 'DIRECT_PAYMENT',
    totalAmountUrbanDevelopment: 0,
    initialAmountUrbanDevelopment: 0,
    quantityHuCuotes: 0,
    interestRate: 12
  });

  // Estado de validación de cada paso
  const [stepValidation, setStepValidation] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false
  });

  const steps = [
    { id: 1, title: 'Proyecto y Lote', description: 'Selecciona proyecto, etapa, manzana y lote' },
    { id: 2, title: 'Configuración', description: 'Define montos y forma de pago' },
    { id: 3, title: 'Cliente y Garante', description: 'Asigna cliente y registra garante' },
    { id: 4, title: 'Finalización', description: 'Revisa y confirma la venta' }
  ];

  const updateFormData = (data: Partial<CreateSaleFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const updateStepValidation = (step: keyof typeof stepValidation, isValid: boolean) => {
    setStepValidation((prev) => ({ ...prev, [step]: isValid }));
  };

  const handleNext = () => {
    const currentStepKey = `step${currentStep}` as keyof typeof stepValidation;
    if (!stepValidation[currentStepKey]) {
      toast.error('Complete todos los campos requeridos antes de continuar');
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Solo permitir navegar a pasos anteriores o al siguiente si el actual está válido
    if (
      step < currentStep ||
      (step === currentStep + 1 &&
        stepValidation[`step${currentStep}` as keyof typeof stepValidation])
    ) {
      setCurrentStep(step);
    }
  };

  const handleFinishSale = async () => {
    if (!stepValidation.step4) {
      toast.error('Complete todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    try {
      const salePayload = {
        lotId: formData.lotId!,
        saleType: formData.saleType!,
        clientId: formData.clientId!,
        guarantorId: formData.guarantorId!,
        paymentDate: formData.paymentDate!,
        saleDate: formData.saleDate!,
        contractDate: formData.contractDate!,
        totalAmount: formData.totalAmount!,
        totalAmountUrbanDevelopment: formData.totalAmountUrbanDevelopment!,
        ...(formData.firstPaymentDateHu && { firstPaymentDateHu: formData.firstPaymentDateHu }),
        ...(formData.initialAmountUrbanDevelopment && {
          initialAmountUrbanDevelopment: formData.initialAmountUrbanDevelopment
        }),
        ...(formData.quantityHuCuotes && { quantityHuCuotes: formData.quantityHuCuotes }),
        ...(formData.saleType === 'FINANCED' && {
          initialAmount: formData.initialAmount!,
          interestRate: formData.interestRate!,
          quantitySaleCoutes: formData.quantitySaleCoutes!,
          financingInstallments: formData.financingInstallments!
        })
      };

      const result = await createSale(salePayload);

      if (result.success) {
        setSaleResult(result.data ?? null);
        setShowSuccessModal(true);
        toast.success('Venta creada exitosamente');
      } else {
        toast.error(result.error || 'Error al crear la venta');
      }
    } catch (error) {
      console.error('Error creating sale:', error);
      toast.error('Error inesperado al crear la venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    router.push('/ventas');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1ProjectSelection
            formData={formData}
            updateFormData={updateFormData}
            updateStepValidation={updateStepValidation}
          />
        );
      case 2:
        return (
          <Step2FinancialConfig
            formData={formData}
            updateFormData={updateFormData}
            updateStepValidation={updateStepValidation}
          />
        );
      case 3:
        return (
          <Step3ClientGuarantor
            formData={formData}
            updateFormData={updateFormData}
            updateStepValidation={updateStepValidation}
          />
        );
      case 4:
        return (
          <Step4Summary
            formData={formData}
            updateFormData={updateFormData}
            updateStepValidation={updateStepValidation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        stepValidation={stepValidation}
      />

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">{renderCurrentStep()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div className="flex gap-3">
          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!stepValidation[`step${currentStep}` as keyof typeof stepValidation]}
              className="flex items-center gap-2"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFinishSale}
              disabled={!stepValidation.step4 || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creando venta...
                </>
              ) : (
                'Crear Venta'
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {saleResult && (
        <SaleSuccessModal
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
          saleData={saleResult}
        />
      )}
    </div>
  );
}
