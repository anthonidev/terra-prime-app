'use client';

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { User } from 'lucide-react';
import { Control, FieldErrors } from 'react-hook-form';

import { LeadsVendor } from '@domain/entities/sales/leadsvendors.entity';
import { Step3FormData } from '../../../validations/saleValidation';

interface ClientLeadSelectorProps {
  control: Control<Step3FormData>;
  errors?: FieldErrors<Step3FormData>;
  leads: LeadsVendor[];
  loading: boolean;
  onLeadChange: (leadId: string) => void;
}

export default function ClientLeadSelector({
  control,
  leads,
  loading,
  onLeadChange
}: ClientLeadSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium text-blue-500">Selección de Lead</h3>

      <FormField
        control={control}
        name="leadId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Lead Asignado
            </FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={onLeadChange} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder={loading ? 'cargando leads...' : 'Selecciona un lead'} />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      <div className="flex flex-col">
                        <span className="text-left text-xs font-medium">
                          {lead.firstName} {lead.lastName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {lead.documentType}: {lead.document} • {lead.age} años
                        </span>
                      </div>
                    </SelectItem>
                  ))}
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
