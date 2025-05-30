'use client';

import { Control, FieldErrors } from 'react-hook-form';
import { DollarSign, Calendar as CalendarDays } from 'lucide-react';

import FormInputField from '@/components/common/form/FormInputField';
import { Step2FormData } from '../../../validations/saleValidation';

interface AmountConfigurationProps {
  control: Control<Step2FormData>;
  errors: FieldErrors<Step2FormData>;
  hasUrbanization: boolean;
}

export default function AmountConfiguration({
  control,
  errors,
  hasUrbanization
}: AmountConfigurationProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Montos de Venta</h3>

      {/* Monto Total del Lote */}
      <FormInputField<Step2FormData>
        name="totalAmount"
        label="Monto Total del Lote"
        placeholder="0.00"
        type="number"
        icon={<DollarSign className="h-4 w-4" />}
        control={control}
        errors={errors}
      />

      {/* Campos de Habilitación Urbana - Solo si el monto es mayor a 0 */}
      {hasUrbanization && (
        <>
          <FormInputField<Step2FormData>
            name="totalAmountUrbanDevelopment"
            label="Monto Total Habilitación Urbana"
            placeholder="0.00"
            type="number"
            icon={<DollarSign className="h-4 w-4" />}
            control={control}
            errors={errors}
          />

          <FormInputField<Step2FormData>
            name="initialAmountUrbanDevelopment"
            label="Monto Inicial HU"
            placeholder="0.00"
            type="number"
            icon={<DollarSign className="h-4 w-4" />}
            control={control}
            errors={errors}
          />

          <FormInputField<Step2FormData>
            name="quantityHuCuotes"
            label="Cantidad de Cuotas HU"
            placeholder="0"
            type="number"
            icon={<CalendarDays className="h-4 w-4" />}
            control={control}
            errors={errors}
          />

          <FormInputField<Step2FormData>
            name="firstPaymentDateHu"
            label="Fecha Primer Pago HU"
            placeholder="YYYY-MM-DD"
            type="date"
            icon={<CalendarDays className="h-4 w-4" />}
            control={control}
            errors={errors}
          />
        </>
      )}
    </div>
  );
}
