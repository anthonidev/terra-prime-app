'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Trash2, User, FileText, Mail, Phone, MapPin, IdCard } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { DOCUMENT_TYPE_OPTIONS } from '../../../constants';
import type { DocumentType } from '../../../types';
import type { Step4FormData } from '../../../lib/validation';

interface SecondaryClientsFormProps {
  form: UseFormReturn<Step4FormData>;
  showSecondaryClients: boolean;
  secondaryClientsCount: number;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function SecondaryClientsForm({
  form,
  showSecondaryClients,
  secondaryClientsCount,
  onAdd,
  onRemove,
}: SecondaryClientsFormProps) {
  const clientFields = [
    {
      id: 'firstName',
      label: 'Nombres',
      icon: User,
      placeholder: 'Nombres',
      type: 'text',
      required: true,
    },
    {
      id: 'lastName',
      label: 'Apellidos',
      icon: User,
      placeholder: 'Apellidos',
      type: 'text',
      required: true,
    },
    {
      id: 'document',
      label: 'Documento',
      icon: FileText,
      placeholder: 'Número de documento',
      type: 'text',
      required: true,
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      placeholder: 'Email',
      type: 'email',
      required: true,
    },
    {
      id: 'phone',
      label: 'Teléfono',
      icon: Phone,
      placeholder: 'Teléfono',
      type: 'tel',
      required: true,
    },
    {
      id: 'address',
      label: 'Dirección',
      icon: MapPin,
      placeholder: 'Dirección',
      type: 'text',
      required: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <Users className="text-primary h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>Clientes Secundarios (Opcional)</CardTitle>
                  {showSecondaryClients && secondaryClientsCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {secondaryClientsCount}
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  Agregue clientes adicionales que participarán en la compra
                </CardDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAdd}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Cliente
            </Button>
          </div>
        </CardHeader>
        <AnimatePresence>
          {showSecondaryClients && secondaryClientsCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-4 pt-0">
                {Array.from({ length: secondaryClientsCount }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="bg-muted/30 space-y-4 rounded-lg p-4"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                          <User className="text-primary h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-semibold">Cliente Secundario #{index + 1}</h4>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Document Type Select */}
                      <div className="space-y-2">
                        <Label
                          htmlFor={`secondaryClients.${index}.documentType`}
                          className="flex items-center gap-2 text-sm font-medium"
                        >
                          <IdCard className="text-primary h-4 w-4" />
                          Tipo de Documento
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            form.setValue(
                              `secondaryClients.${index}.documentType`,
                              value as DocumentType
                            )
                          }
                          defaultValue={form.getValues(`secondaryClients.${index}.documentType`)}
                        >
                          <SelectTrigger id={`secondaryClients.${index}.documentType`}>
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
                      </div>

                      {/* Other Fields */}
                      {clientFields.map((field) => {
                        const Icon = field.icon;
                        const fieldName =
                          `secondaryClients.${index}.${field.id}` as keyof Step4FormData;

                        return (
                          <div key={field.id} className="space-y-2">
                            <Label
                              htmlFor={fieldName}
                              className="flex items-center gap-2 text-sm font-medium"
                            >
                              <Icon className="text-primary h-4 w-4" />
                              {field.label}
                              {field.required && <span className="text-destructive">*</span>}
                            </Label>
                            <div className="relative">
                              <Input
                                id={fieldName}
                                type={field.type}
                                placeholder={field.placeholder}
                                {...form.register(fieldName)}
                                className="pl-9"
                              />
                              <Icon className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
