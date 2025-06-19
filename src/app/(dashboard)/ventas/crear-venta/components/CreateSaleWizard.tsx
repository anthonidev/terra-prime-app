'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CreateSaleFormData } from '@sales/crear-venta/validations/saleValidation';
import { createSale } from '@sales/crear-venta/action';
import StepIndicator from '@sales/crear-venta/components/StepIndicator';
import SaleSuccessModal from '@sales/crear-venta/components/modals/SaleSuccessModal';
import Step1ProjectSelection from '@sales/crear-venta/components/steps/step1/Step1ProjectSelection';
import Step2FinancialConfig from '@sales/crear-venta/components/steps/step2/Step2FinancialConfig';
import Step3ClientGuarantor from '@sales/crear-venta/components/steps/step3/Step3ClientGuarantor';
import Step4Summary from '@sales/crear-venta/components/steps/step4/Step4Summary';
import { SaleList } from '@domain/entities/sales/salevendor.entity';

export default function CreateSaleWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [saleResult, setSaleResult] = useState<SaleList | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const [formData, setFormData] = useState<Partial<CreateSaleFormData>>({
    saleType: 'DIRECT_PAYMENT',
    totalAmountUrbanDevelopment: 0,
    initialAmountUrbanDevelopment: 0,
    quantityHuCuotes: 0,
    interestRate: 12
  });

  const [stepValidation, setStepValidation] = useState<{
    step1: boolean;
    step2: boolean;
    step3: boolean;
    step4: boolean;
  }>({
    step1: false,
    step2: false,
    step3: false,
    step4: false
  });

  const steps: {
    id: number;
    title: string;
    description: string;
  }[] = [
    { id: 1, title: 'Proyecto y Lote', description: 'Selecciona proyecto, etapa, manzana y lote' },
    { id: 2, title: 'Configuración', description: 'Define montos y forma de pago' },
    { id: 3, title: 'Cliente y Garante', description: 'Asigna cliente y registra garante' },
    { id: 4, title: 'Finalización', description: 'Revisa y confirma la venta' }
  ];

  const updateFormData = (data: Partial<CreateSaleFormData>) =>
    setFormData((prev) => ({ ...prev, ...data }));

  const updateStepValidation = (step: keyof typeof stepValidation, isValid: boolean) =>
    setStepValidation((prev) => ({ ...prev, [step]: isValid }));

  const handleNext = () => {
    const currentStepKey = `step${currentStep}` as keyof typeof stepValidation;
    if (!stepValidation[currentStepKey]) {
      toast.error('Complete todos los campos requeridos antes de continuar');
      return;
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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
        secondaryClientsIds: formData.secondaryClientIds!,
        guarantorId: formData.guarantorId!,
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
      } else toast.error(result.error || 'Error al crear la venta');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
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
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        stepValidation={stepValidation}
      />
      <Card>
        <CardContent className="p-6">{renderCurrentStep()}</CardContent>
      </Card>
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
