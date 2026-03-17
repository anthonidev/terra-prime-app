'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormDialog } from '@/shared/components/form-dialog';
import { Braces } from 'lucide-react';
import { customVariableSchema, type CustomVariableFormValues } from '../../lib/validation';
import { VariableType } from '../../types';

interface CustomVariableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (variable: CustomVariableFormValues) => void;
}

const VARIABLE_TYPE_OPTIONS = [
  { value: VariableType.TEXT, label: 'Texto' },
  { value: VariableType.NUMBER, label: 'Número' },
  { value: VariableType.DATE, label: 'Fecha' },
  { value: VariableType.CURRENCY, label: 'Moneda' },
  { value: VariableType.BOOLEAN, label: 'Booleano' },
  { value: VariableType.SELECT, label: 'Selección' },
];

export function CustomVariableDialog({ open, onOpenChange, onSave }: CustomVariableDialogProps) {
  const form = useForm<CustomVariableFormValues>({
    resolver: zodResolver(customVariableSchema),
    defaultValues: {
      key: '',
      label: '',
      type: VariableType.TEXT,
      defaultValue: '',
      options: [],
    },
  });

  const selectedType = form.watch('type');

  const handleSubmit = form.handleSubmit((data) => {
    onSave(data);
    form.reset();
    onOpenChange(false);
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Nueva variable personalizada"
      description="Crea una variable para usar en la plantilla"
      onSubmit={handleSubmit}
      form={form}
      icon={Braces}
      submitLabel="Agregar variable"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="var-key">Clave</Label>
          <Input id="var-key" placeholder="nombre_variable" {...form.register('key')} />
          {form.formState.errors.key && (
            <p className="text-destructive mt-1 text-sm">{form.formState.errors.key.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="var-label">Etiqueta</Label>
          <Input id="var-label" placeholder="Nombre para mostrar" {...form.register('label')} />
          {form.formState.errors.label && (
            <p className="text-destructive mt-1 text-sm">{form.formState.errors.label.message}</p>
          )}
        </div>

        <div>
          <Label>Tipo</Label>
          <Select
            value={selectedType}
            onValueChange={(value) => form.setValue('type', value as VariableType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VARIABLE_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="var-default">Valor por defecto (opcional)</Label>
          <Input
            id="var-default"
            placeholder="Valor por defecto"
            {...form.register('defaultValue')}
          />
        </div>

        {selectedType === VariableType.SELECT && (
          <div>
            <Label htmlFor="var-options">Opciones (separadas por coma)</Label>
            <Input
              id="var-options"
              placeholder="opcion1, opcion2, opcion3"
              onChange={(e) => {
                const options = e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean);
                form.setValue('options', options);
              }}
            />
            {form.formState.errors.options && (
              <p className="text-destructive mt-1 text-sm">
                {form.formState.errors.options.message}
              </p>
            )}
          </div>
        )}
      </div>
    </FormDialog>
  );
}
