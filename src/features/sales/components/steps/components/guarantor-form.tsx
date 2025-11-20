'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Plus, Trash2, User, FileText, Mail, Phone, MapPin, IdCard } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/lib/utils';
import { DOCUMENT_TYPE_OPTIONS } from '../../../constants';
import type { DocumentType } from '../../../types';
import type { Step4FormData } from '../../../lib/validation';

interface GuarantorFormProps {
  form: UseFormReturn<Step4FormData>;
  showGuarantor: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

export function GuarantorForm({ form, showGuarantor, onAdd, onRemove }: GuarantorFormProps) {
  const guarantorFields = [
    {
      id: 'guarantor.firstName',
      label: 'Nombres',
      icon: User,
      placeholder: 'Nombres del garante',
      type: 'text',
      required: true,
    },
    {
      id: 'guarantor.lastName',
      label: 'Apellidos',
      icon: User,
      placeholder: 'Apellidos del garante',
      type: 'text',
      required: true,
    },
    {
      id: 'guarantor.document',
      label: 'Documento',
      icon: FileText,
      placeholder: 'Número de documento',
      type: 'text',
      required: true,
    },
    {
      id: 'guarantor.email',
      label: 'Email',
      icon: Mail,
      placeholder: 'Email del garante',
      type: 'email',
      required: true,
    },
    {
      id: 'guarantor.phone',
      label: 'Teléfono',
      icon: Phone,
      placeholder: 'Teléfono del garante',
      type: 'tel',
      required: true,
    },
    {
      id: 'guarantor.address',
      label: 'Dirección',
      icon: MapPin,
      placeholder: 'Dirección del garante',
      type: 'text',
      required: true,
      fullWidth: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <UserPlus className="text-primary h-5 w-5" />
              </div>
              <div>
                <CardTitle>Garante (Opcional)</CardTitle>
                <CardDescription>Agregue un garante si el cliente lo requiere</CardDescription>
              </div>
            </div>
            {!showGuarantor && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAdd}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar Garante
              </Button>
            )}
          </div>
        </CardHeader>
        <AnimatePresence>
          {showGuarantor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover Garante
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Document Type Select */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="guarantor.documentType"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <IdCard className="text-primary h-4 w-4" />
                      Tipo de Documento
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue('guarantor.documentType', value as DocumentType)
                      }
                      defaultValue={form.getValues('guarantor.documentType')}
                    >
                      <SelectTrigger id="guarantor.documentType">
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {DOCUMENT_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Other Fields */}
                  {guarantorFields.map((field, index) => {
                    const Icon = field.icon;
                    const error =
                      form.formState.errors.guarantor?.[
                        field.id.split('.')[1] as keyof typeof form.formState.errors.guarantor
                      ];

                    return (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className={cn('space-y-2', field.fullWidth && 'md:col-span-2')}
                      >
                        <Label
                          htmlFor={field.id}
                          className="flex items-center gap-2 text-sm font-medium"
                        >
                          <Icon className="text-primary h-4 w-4" />
                          {field.label}
                          {field.required && <span className="text-destructive">*</span>}
                        </Label>
                        <div className="relative">
                          <Input
                            id={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            {...form.register(field.id as keyof Step4FormData)}
                            className={cn('pl-9 transition-all', error && 'border-destructive')}
                          />
                          <Icon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        </div>
                        {error && typeof error === 'object' && 'message' in error && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-destructive text-xs"
                          >
                            {error.message}
                          </motion.p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
