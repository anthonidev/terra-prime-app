'use client';

import { Control, FieldErrors } from 'react-hook-form';
import { Clock, FileText, CreditCard } from 'lucide-react';

import { Form } from '@/components/ui/form';
import FormInputField from '@/components/common/form/FormInputField';
import { Step4FormData } from '../../../validations/saleValidation';

interface DateConfigurationProps {
  control: Control<Step4FormData>;
  errors: FieldErrors<Step4FormData>;
}

export default function DateConfiguration({ control, errors }: DateConfigurationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Fechas de la Venta</h3>

      <div className="space-y-4">
        {/* Fecha de Venta */}
        <FormInputField<Step4FormData>
          name="saleDate"
          label="Fecha de Venta"
          placeholder="YYYY-MM-DD"
          type="date"
          icon={<Clock className="h-4 w-4" />}
          control={control}
          errors={errors}
        />

        {/* Fecha de Contrato */}
        <FormInputField<Step4FormData>
          name="contractDate"
          label="Fecha de Contrato"
          placeholder="YYYY-MM-DD"
          type="date"
          icon={<FileText className="h-4 w-4" />}
          control={control}
          errors={errors}
        />

        {/* Fecha de Pago */}
        <FormInputField<Step4FormData>
          name="paymentDate"
          label="Fecha de Pago"
          placeholder="YYYY-MM-DD"
          type="date"
          icon={<CreditCard className="h-4 w-4" />}
          control={control}
          errors={errors}
        />
      </div>
    </div>
  );
}
