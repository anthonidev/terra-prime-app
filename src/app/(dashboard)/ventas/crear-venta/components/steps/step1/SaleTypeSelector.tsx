'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CreditCard } from 'lucide-react';
import { Control, FieldErrors } from 'react-hook-form';
import { Step1FormData } from '../../../validations/saleValidation';

interface SaleTypeSelectorProps {
  control: Control<Step1FormData>;
  errors: FieldErrors<Step1FormData>;
}

export default function SaleTypeSelector({ control }: SaleTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
        Configuración de Venta
      </h3>

      <FormField
        control={control}
        name="saleType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Tipo de Venta
            </FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de venta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIRECT_PAYMENT">
                    <div className="flex flex-col">
                      <span>Pago Directo</span>
                      <span className="text-xs text-gray-500">Pago completo al contado</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="FINANCED">
                    <div className="flex flex-col">
                      <span>Financiado</span>
                      <span className="text-xs text-gray-500">Pago en cuotas con intereses</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
