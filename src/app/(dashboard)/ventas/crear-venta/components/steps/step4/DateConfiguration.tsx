'use client';

import { Clock, CreditCard, FileText } from 'lucide-react';
import { Control, FieldErrors } from 'react-hook-form';

import FormInputField from '@/components/common/form/FormInputField';
import { Step4FormData } from '../../../validations/saleValidation';

interface DateConfigurationProps {
  control: Control<Step4FormData>;
  errors: FieldErrors<Step4FormData>;
}

export default function DateConfiguration({ control, errors }: DateConfigurationProps) {
  const formFields = [
    {
      name: 'saleDate',
      label: 'Fecha de Venta',
      placeholder: 'YYYY-MM-DD',
      icon: <Clock className="h-4 w-4" />,
      type: 'date'
    },
    {
      name: 'contractDate',
      label: 'Fecha de Contrato',
      placeholder: 'YYYY-MM-DD',
      icon: <FileText className="h-4 w-4" />,
      type: 'date'
    },
    {
      name: 'paymentDate',
      label: 'Fecha de Pago',
      placeholder: 'YYYY-MM-DD',
      icon: <CreditCard className="h-4 w-4" />,
      type: 'date'
    }
  ] as const;

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Fechas de la Venta</h3>
      <div className="space-y-4">
        {formFields.map((field, index) => (
          <FormInputField<Step4FormData>
            key={index}
            name={field.name}
            placeholder={field.placeholder}
            type={field.type}
            label={field.label}
            icon={field.icon}
            control={control}
            errors={errors}
          />
        ))}
      </div>
    </div>
  );
}
