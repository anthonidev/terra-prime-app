'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CreateUpdateLeadDto, DocumentType, Lead } from '@/types/leads.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Calendar, Mail, Phone, Save, User, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: 'El nombre solo debe contener letras y espacios'
    }),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede tener más de 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
      message: 'El apellido solo debe contener letras y espacios'
    }),
  document: z
    .string()
    .min(1, 'El documento es requerido')
    .max(20, 'El documento no puede tener más de 20 caracteres'),
  documentType: z.nativeEnum(DocumentType, {
    required_error: 'El tipo de documento es requerido'
  }),
  email: z.string().email('El email debe tener un formato válido').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^\+?[0-9]{6,15}$/, {
      message: 'El teléfono debe ser un número válido'
    })
    .optional()
    .or(z.literal('')),
  phone2: z
    .string()
    .regex(/^\+?[0-9]{6,15}$/, {
      message: 'El teléfono alternativo debe ser un número válido'
    })
    .optional()
    .or(z.literal('')),
  age: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => !val || (val >= 18 && val <= 120), {
      message: 'La edad debe estar entre 18 y 120 años'
    })
    .optional()
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface LeadEditFormProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: CreateUpdateLeadDto, id: string) => Promise<boolean>;
  isUpdating: boolean;
  error: string | null;
}

export default function LeadEditForm({
  lead,
  isOpen,
  onClose,
  onUpdate,
  isUpdating,
  error
}: LeadEditFormProps) {
  const form = useForm<CreateUpdateLeadDto>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: lead.firstName,
      lastName: lead.lastName,
      document: lead.document,
      documentType: lead.documentType,
      email: lead?.email || '',
      phone: lead?.phone || '',
      phone2: lead?.phone2 || '',
      age: lead?.age || undefined,
      isNewLead: false
    },
    mode: 'onBlur'
  });

  useEffect(() => {
    if (lead && isOpen) {
      form.reset({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email || '',
        phone: lead.phone || '',
        phone2: lead.phone2 || '',
        age: lead.age || undefined,
        document: lead.document,
        documentType: lead.documentType,
        isNewLead: false
      });
    }
  }, [lead, form, isOpen]);

  const onSubmit = async (values: ContactFormValues) => {
    const contactData: CreateUpdateLeadDto = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email || undefined,
      phone: values.phone || undefined,
      phone2: values.phone2 || undefined,
      document: values.document,
      documentType: values.documentType,
      isNewLead: false,
      age: values.age || undefined
    };

    const success = await onUpdate(contactData, lead.id);
    if (success) {
      onClose();
    }
  };

  const handleClose = () => {
    if (!isUpdating) {
      form.reset();
      onClose();
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Editar información de contacto
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Actualiza los datos de contacto del lead
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Información personal
                  </h3>
                </div>
                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Nombre</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Nombre del lead"
                              {...field}
                              disabled
                              className="bg-gray-50 pl-9 dark:bg-gray-800/50"
                            />
                            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Apellido</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Apellido del lead"
                              {...field}
                              disabled
                              className="bg-gray-50 pl-9 dark:bg-gray-800/50"
                            />
                            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Edad</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Edad"
                              type="number"
                              min="18"
                              max="120"
                              {...field}
                              className="pl-9 transition-colors focus:border-blue-500 focus:ring-blue-500"
                            />
                            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Correo electrónico</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="correo@ejemplo.com"
                              type="email"
                              {...field}
                              className="pl-9 transition-colors focus:border-blue-500 focus:ring-blue-500"
                            />
                            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Teléfonos de contacto
                  </h3>
                </div>
                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Teléfono principal</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="999999999"
                              {...field}
                              className="pl-9 transition-colors focus:border-blue-500 focus:ring-blue-500"
                            />
                            <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Teléfono alternativo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="999999999"
                              {...field}
                              className="pl-9 transition-colors focus:border-blue-500 focus:ring-blue-500"
                            />
                            <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Document Information (Read-only) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Información de identificación
                  </h3>
                </div>
                <Separator />

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tipo de documento
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {lead.documentType}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Número de documento
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {lead.document}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    La información de identificación no puede ser modificada
                  </p>
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isUpdating || !form.formState.isDirty}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isUpdating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
