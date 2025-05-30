'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CreditCard, MapPin } from 'lucide-react';
import { Control, FieldErrors } from 'react-hook-form';
import { Step3FormData } from '../../../validations/saleValidation';

interface ClientConfigurationProps {
  control: Control<Step3FormData>;
  errors: FieldErrors<Step3FormData>;
  isLoadingClient: boolean;
  existingClient: { id: number; address: string } | null;
  clientAddress: string;
  onAddressChange: (address: string) => void;
}

export default function ClientConfiguration({
  control,
  isLoadingClient,
  existingClient,
  clientAddress,
  onAddressChange
}: ClientConfigurationProps) {
  if (isLoadingClient) {
    return (
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
          Información del Cliente
        </h3>
        <div className="flex items-center justify-center py-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="ml-2 text-sm">Verificando cliente...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
        Información del Cliente
      </h3>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="text-sm font-medium">Estado del Cliente:</span>
          <Badge variant={existingClient ? 'default' : 'secondary'}>
            {existingClient ? 'Cliente Existente' : 'Cliente Nuevo'}
          </Badge>
        </div>

        {existingClient && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20">
            <p className="text-sm text-green-800 dark:text-green-200">
              Cliente encontrado en el sistema. Puedes editar la dirección si es necesario.
            </p>
          </div>
        )}

        {/* Dirección del Cliente */}
        <FormField
          control={control}
          name="clientAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Dirección del Cliente
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese la dirección completa"
                  value={clientAddress}
                  onChange={(e) => {
                    onAddressChange(e.target.value);
                    field.onChange(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
