'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema, type Step2FormData } from '../lib/validation';
import { SaleType, type Step2Data } from '../types';

interface UseSaleTypeFormProps {
  initialData?: Step2Data;
  onSubmit: (data: Step2Data) => void;
}

export function useSaleTypeForm({ initialData, onSubmit }: UseSaleTypeFormProps) {
  const form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      saleType: initialData?.saleType || SaleType.DIRECT_PAYMENT,
      isReservation: initialData?.isReservation || false,
      reservationAmount: initialData?.reservationAmount || undefined,
      maximumHoldPeriod: initialData?.maximumHoldPeriod || undefined,
    },
  });

  // Watch form values
  const saleType = form.watch('saleType');
  const isReservation = form.watch('isReservation');
  const reservationAmount = form.watch('reservationAmount');
  const maximumHoldPeriod = form.watch('maximumHoldPeriod');

  // Handlers
  const handleSaleTypeChange = (type: SaleType) => {
    form.setValue('saleType', type);
  };

  const handleReservationToggle = (checked: boolean) => {
    form.setValue('isReservation', checked);
    if (checked) {
      // Set default values when checked
      if (!form.getValues('reservationAmount')) {
        form.setValue('reservationAmount', 100);
      }
      if (!form.getValues('maximumHoldPeriod')) {
        form.setValue('maximumHoldPeriod', 15);
      }
    } else {
      // Clear reservation fields when unchecked
      form.setValue('reservationAmount', undefined);
      form.setValue('maximumHoldPeriod', undefined);
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return {
    // Form instance
    form,

    // Watched values
    saleType,
    isReservation,
    reservationAmount,
    maximumHoldPeriod,

    // Handlers
    handleSaleTypeChange,
    handleReservationToggle,
    handleSubmit,

    // Form state
    errors: form.formState.errors,
    isValid: form.formState.isValid,
  };
}
