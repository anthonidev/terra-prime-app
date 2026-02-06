'use client';

import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, addMonths } from 'date-fns';
import { toast } from 'sonner';
import {
  step3DirectPaymentSchema,
  step3FinancedSchema,
  type Step3DirectPaymentFormData,
  type Step3FinancedFormData,
} from '../lib/validation';
import {
  SaleType,
  type ProjectLotResponse,
  type AmortizationResponse,
  type Step3Data,
} from '../types';
import {
  DEFAULT_INTEREST_RATE,
  DEFAULT_HU_INSTALLMENTS,
  DEFAULT_SALE_INSTALLMENTS,
} from '../constants';
import { useCalculateAmortization } from './use-calculate-amortization';
import { useEditableAmortization } from './use-editable-amortization';

interface UsePaymentConfigFormProps {
  initialData?: Step3Data;
  saleType: SaleType;
  selectedLot: ProjectLotResponse;
  reservationAmount?: number;
  onSubmit: (data: Step3Data) => void;
}

export function usePaymentConfigForm({
  initialData,
  saleType,
  selectedLot,
  reservationAmount,
  onSubmit,
}: UsePaymentConfigFormProps) {
  const [amortization, setAmortization] = useState<AmortizationResponse | undefined>(
    initialData?.combinedInstallments
      ? { installments: initialData.combinedInstallments, meta: initialData.amortizationMeta! }
      : undefined
  );
  const [isLocked, setIsLocked] = useState<boolean>(
    initialData?.combinedInstallments ? true : false
  );
  const [isEditEnabled, setIsEditEnabled] = useState<boolean>(false);
  const [editableLotPrice, setEditableLotPrice] = useState<number>(
    initialData?.totalAmount ?? parseFloat(selectedLot.lotPrice)
  );
  const [editableUrbanizationPrice, setEditableUrbanizationPrice] = useState<number>(
    initialData?.totalAmountUrbanDevelopment ?? parseFloat(selectedLot.urbanizationPrice)
  );

  const { mutate: calculateAmortization, isPending: isCalculating } = useCalculateAmortization();

  const lotPrice = editableLotPrice;
  const urbanizationPrice = editableUrbanizationPrice;
  const hasUrbanization = parseFloat(selectedLot.urbanizationPrice) > 0;
  const isDirectPayment = saleType === SaleType.DIRECT_PAYMENT;

  // Direct payment form
  const directForm = useForm<Step3DirectPaymentFormData>({
    resolver: zodResolver(step3DirectPaymentSchema),
    defaultValues: {
      totalAmount: initialData?.totalAmount ?? lotPrice,
      totalAmountUrbanDevelopment: initialData?.totalAmountUrbanDevelopment ?? urbanizationPrice,
      initialAmountUrbanDevelopment: initialData?.initialAmountUrbanDevelopment ?? 0,
      quantityHuCuotes: initialData?.quantityHuCuotes ?? DEFAULT_HU_INSTALLMENTS,
      firstPaymentDateHu:
        initialData?.firstPaymentDateHu ?? format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
    },
  });

  // Financed form
  const financedForm = useForm<Step3FinancedFormData>({
    resolver: zodResolver(step3FinancedSchema),
    defaultValues: {
      totalAmount: initialData?.totalAmount ?? lotPrice,
      initialAmount: initialData?.initialAmount ?? 0,
      interestRate: initialData?.interestRate ?? DEFAULT_INTEREST_RATE,
      quantitySaleCoutes: initialData?.quantitySaleCoutes ?? DEFAULT_SALE_INSTALLMENTS,
      firstPaymentDate:
        initialData?.firstPaymentDate ?? format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
      totalAmountUrbanDevelopment: initialData?.totalAmountUrbanDevelopment ?? urbanizationPrice,
      initialAmountUrbanDevelopment: initialData?.initialAmountUrbanDevelopment ?? 0,
      quantityHuCuotes: initialData?.quantityHuCuotes ?? DEFAULT_HU_INSTALLMENTS,
      firstPaymentDateHu:
        initialData?.firstPaymentDateHu ?? format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
    },
  });

  const form = isDirectPayment ? directForm : financedForm;

  // Update form values when editable prices change
  useEffect(() => {
    if (isDirectPayment) {
      directForm.setValue('totalAmount', lotPrice);
      directForm.setValue('totalAmountUrbanDevelopment', urbanizationPrice);
    } else {
      financedForm.setValue('totalAmount', lotPrice);
      financedForm.setValue('totalAmountUrbanDevelopment', urbanizationPrice);
    }
  }, [lotPrice, urbanizationPrice, isDirectPayment, directForm, financedForm]);

  // Watch form values
  const totalAmount = isDirectPayment
    ? directForm.watch('totalAmount')
    : financedForm.watch('totalAmount');
  const initialAmount = isDirectPayment ? 0 : financedForm.watch('initialAmount');
  const interestRate = isDirectPayment ? 0 : financedForm.watch('interestRate');
  const quantitySaleCoutes = isDirectPayment ? 0 : financedForm.watch('quantitySaleCoutes');
  const firstPaymentDate = isDirectPayment ? undefined : financedForm.watch('firstPaymentDate');
  const quantityHuCuotes = isDirectPayment
    ? directForm.watch('quantityHuCuotes')
    : financedForm.watch('quantityHuCuotes');
  const totalAmountUrbanDevelopment = isDirectPayment
    ? directForm.watch('totalAmountUrbanDevelopment')
    : financedForm.watch('totalAmountUrbanDevelopment');
  const initialAmountUrbanDevelopment = isDirectPayment
    ? directForm.watch('initialAmountUrbanDevelopment')
    : financedForm.watch('initialAmountUrbanDevelopment');
  const firstPaymentDateHu = isDirectPayment
    ? directForm.watch('firstPaymentDateHu')
    : financedForm.watch('firstPaymentDateHu');

  // Editable amortization hook
  const editableAmortization = useEditableAmortization({
    interestRate: interestRate ?? 0,
  });

  // Initialize editable amortization from initial data if available
  useEffect(() => {
    if (initialData?.combinedInstallments && !editableAmortization.initialized) {
      editableAmortization.initializeFromAmortization({
        installments: initialData.combinedInstallments,
        meta: initialData.amortizationMeta!,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate amortization
  const handleGenerateAmortization = () => {
    if (
      !totalAmount ||
      initialAmount === undefined ||
      interestRate === undefined ||
      interestRate === null ||
      !quantitySaleCoutes ||
      !firstPaymentDate
    ) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }

    const financedAmount = totalAmount - initialAmount;

    if (financedAmount <= 0) {
      toast.error('El monto a financiar debe ser mayor a 0');
      return;
    }

    calculateAmortization(
      {
        totalAmount,
        initialAmount,
        reservationAmount: reservationAmount ?? 0,
        interestRate,
        numberOfPayments: quantitySaleCoutes,
        firstPaymentDate,
        includeDecimals: false,
        totalAmountHu: totalAmountUrbanDevelopment > 0 ? totalAmountUrbanDevelopment : undefined,
        numberOfPaymentsHu:
          totalAmountUrbanDevelopment > 0
            ? (quantityHuCuotes ?? DEFAULT_HU_INSTALLMENTS)
            : undefined,
        firstPaymentDateHu: totalAmountUrbanDevelopment > 0 ? firstPaymentDateHu : undefined,
      },
      {
        onSuccess: (data) => {
          setAmortization(data);
          setIsLocked(true);
          editableAmortization.initializeFromAmortization(data);
          toast.success('Tabla de amortización generada correctamente');
        },
      }
    );
  };

  // Clear amortization and unlock fields
  const handleClearAmortization = () => {
    setAmortization(undefined);
    setIsLocked(false);
    editableAmortization.reset();
    toast.info('Puede editar los campos de configuración');
  };

  const handleSubmit = (formData: Step3DirectPaymentFormData | Step3FinancedFormData) => {
    // Validar que la tabla de amortización esté generada para tipo FINANCED
    if (!isDirectPayment && !amortization && !editableAmortization.initialized) {
      toast.error('Debe generar la tabla de amortización antes de continuar');
      return;
    }

    // Validate editable amortization balance
    if (!isDirectPayment && editableAmortization.initialized && !editableAmortization.isValid) {
      toast.error('El balance de la tabla de amortización no es válido. Verifique los montos.');
      return;
    }

    // Use editable data if available
    const amortizationData = editableAmortization.initialized
      ? editableAmortization.toAmortizationResponse()
      : amortization;

    const stepData: Step3Data = {
      ...formData,
      combinedInstallments: amortizationData?.installments,
      amortizationMeta: amortizationData?.meta,
      // Override counts with actual values from edited table
      ...(editableAmortization.initialized && {
        quantitySaleCoutes: editableAmortization.meta.lotInstallmentsCount,
        quantityHuCuotes: editableAmortization.meta.huInstallmentsCount || undefined,
      }),
    };
    onSubmit(stepData);
  };

  return {
    // Forms
    form: form as UseFormReturn<Step3DirectPaymentFormData> | UseFormReturn<Step3FinancedFormData>,
    directForm,
    financedForm,

    // State
    amortization,
    isCalculating,
    isDirectPayment,
    hasUrbanization,
    lotPrice,
    urbanizationPrice,
    isLocked,
    isEditEnabled,

    // Watched values
    totalAmount,
    initialAmount,
    interestRate,
    quantitySaleCoutes,
    firstPaymentDate,
    quantityHuCuotes,
    totalAmountUrbanDevelopment,
    initialAmountUrbanDevelopment,
    firstPaymentDateHu,

    // Editable amortization
    editableAmortization,

    // Handlers
    handleGenerateAmortization,
    handleClearAmortization,
    handleSubmit: form.handleSubmit(handleSubmit),
    setIsEditEnabled,
    setEditableLotPrice,
    setEditableUrbanizationPrice,

    // Form state
    errors: form.formState.errors,
  };
}
