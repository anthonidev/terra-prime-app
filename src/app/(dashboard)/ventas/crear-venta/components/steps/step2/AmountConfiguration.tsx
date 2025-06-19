'use client';

import { Control, FieldErrors } from 'react-hook-form';
import { DollarSign, Calendar as CalendarDays } from 'lucide-react';

import FormInputField from '@/components/common/form/FormInputField';
import { Step2FormData } from '../../../validations/saleValidation';
import { Button } from '@/components/ui/button';

interface Props {
  control: Control<Step2FormData>;
  errors: FieldErrors<Step2FormData>;
  hasUrbanization: boolean;
}

export default function AmountConfiguration({ control, errors, hasUrbanization }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium text-blue-500">Montos de Venta</h3>
      <div className="inline-flex items-end gap-4">
        <FormInputField<Step2FormData>
          name="totalAmount"
          label="Monto Total del Lote"
          placeholder="0.00"
          type="number"
          icon={<DollarSign className="h-4 w-4" />}
          control={control}
          errors={errors}
          disabled={true}
        />
        <Button onClick={() => {}} className="bottom-0" variant="default">
          Editar precio
        </Button>
      </div>

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
