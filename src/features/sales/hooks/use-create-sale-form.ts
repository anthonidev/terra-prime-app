'use client';

import { useState } from 'react';
import { useCreateSale } from './use-create-sale';
import { useCreateGuarantorClient } from './use-create-guarantor-client';
import {
  SaleType,
  type Step1Data,
  type Step2Data,
  type Step3Data,
  type Step4Data,
  type SalesFormData,
  type CreateSaleInput,
  type CreatedSaleResponse,
  type CreateGuarantorClientInput,
} from '../types';

export function useCreateSaleForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdSale, setCreatedSale] = useState<CreatedSaleResponse | null>(null);
  const [formData, setFormData] = useState<Partial<SalesFormData>>({});

  const createSaleMutation = useCreateSale();
  const createGuarantorClientMutation = useCreateGuarantorClient();

  const handleStep1Next = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, step1: data }));
    setCurrentStep(2);
  };

  const handleStep2Next = (data: Step2Data) => {
    // If sale type changes, reset step 3 data
    if (formData.step2?.saleType !== data.saleType) {
      setFormData((prev) => ({ ...prev, step2: data, step3: undefined }));
    } else {
      setFormData((prev) => ({ ...prev, step2: data }));
    }
    setCurrentStep(3);
  };

  const handleStep3Next = (data: Step3Data) => {
    setFormData((prev) => ({ ...prev, step3: data }));
    setCurrentStep(4);
  };

  const handleStep4Next = (data: Step4Data) => {
    setFormData((prev) => ({ ...prev, step4: data }));
    setCurrentStep(5);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!formData.step1 || !formData.step2 || !formData.step3 || !formData.step4) {
      return;
    }

    try {
      // Step 1: Create/Update client and guarantor
      const guarantorClientInput: CreateGuarantorClientInput = {
        createClient: {
          leadId: formData.step4.leadId,
          address: formData.step4.clientAddress,
        },
        ...(formData.step4.guarantor && { createGuarantor: formData.step4.guarantor }),
        ...(formData.step4.secondaryClients &&
          formData.step4.secondaryClients.length > 0 && {
            createSecondaryClient: formData.step4.secondaryClients,
          }),
      };

      const guarantorClientResult =
        await createGuarantorClientMutation.mutateAsync(guarantorClientInput);

      // Step 2: Create sale
      const saleInput: CreateSaleInput = {
        lotId: formData.step1.selectedLot!.id,
        saleType: formData.step2.saleType,
        clientId: guarantorClientResult.clientId,
        totalAmount: formData.step3.totalAmount,
        totalAmountUrbanDevelopment: formData.step3.totalAmountUrbanDevelopment,
        initialAmountUrbanDevelopment: 0, // Siempre 0 según especificación de la API
        ...(guarantorClientResult.guarantorId && {
          guarantorId: guarantorClientResult.guarantorId,
        }),
        ...(guarantorClientResult.secondaryClientIds &&
          guarantorClientResult.secondaryClientIds.length > 0 && {
            secondaryClientsIds: guarantorClientResult.secondaryClientIds,
          }),
        ...(formData.step2.isReservation && {
          isReservation: true,
          reservationAmount: formData.step2.reservationAmount,
          maximumHoldPeriod: formData.step2.maximumHoldPeriod,
        }),
        // Campos de financiamiento (solo para ventas FINANCED)
        ...(formData.step2.saleType === SaleType.FINANCED &&
          formData.step3.initialAmount !== undefined && {
            initialAmount: formData.step3.initialAmount,
          }),
        ...(formData.step2.saleType === SaleType.FINANCED &&
          formData.step3.interestRate !== undefined && {
            interestRate: formData.step3.interestRate,
          }),
        ...(formData.step2.saleType === SaleType.FINANCED &&
          formData.step3.quantitySaleCoutes !== undefined && {
            quantitySaleCoutes: formData.step3.quantitySaleCoutes,
          }),
        ...(formData.step2.saleType === SaleType.FINANCED &&
          formData.step3.combinedInstallments && {
            combinedInstallments: formData.step3.combinedInstallments,
          }),
        // Campos de HU (para ambos tipos de venta si tienen urbanización)
        ...(formData.step3.quantityHuCuotes !== undefined && {
          quantityHuCuotes: formData.step3.quantityHuCuotes,
        }),
        ...(formData.step3.firstPaymentDateHu && {
          firstPaymentDateHu: formData.step3.firstPaymentDateHu,
        }),
      };

      const saleResult = await createSaleMutation.mutateAsync(saleInput);

      setCreatedSale(saleResult);
      setShowSuccessModal(true);

      // Reset form
      setFormData({});
      setCurrentStep(1);
    } catch (error) {
      console.error('Error creating sale:', error);
    }
  };

  const isSubmitting = createSaleMutation.isPending || createGuarantorClientMutation.isPending;

  return {
    // State
    currentStep,
    formData,
    showSuccessModal,
    createdSale,
    isSubmitting,

    // Actions
    setShowSuccessModal,
    handleStep1Next,
    handleStep2Next,
    handleStep3Next,
    handleStep4Next,
    handleBack,
    handleSubmit,
  };
}
