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
import { AlertCircle, Calendar, Mail, Phone, Save, User, X, CreditCard } from 'lucide-react';
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
      <DialogContent className="flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden">
        {/* Header - Fixed */}
        <DialogHeader className="flex-shrink-0 border-b border-gray-200 px-8 pt-8 pb-6 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Editar información de contacto
              </DialogTitle>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Actualiza los datos de contacto del lead
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-8 py-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Error Alert */}
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
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Información personal
                    </h3>
                  </div>

                  <Separator className="bg-gray-200 dark:bg-gray-700" />

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nombre
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Nombre del lead"
                                {...field}
                                disabled
                                className="h-11 border-gray-200 bg-gray-50 pl-11 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
                              />
                              <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Apellido
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Apellido del lead"
                                {...field}
                                disabled
                                className="h-11 border-gray-200 bg-gray-50 pl-11 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
                              />
                              <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Edad
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Edad"
                                type="number"
                                min="18"
                                max="120"
                                {...field}
                                className="h-11 border-gray-200 pl-11 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700"
                              />
                              <Calendar className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Correo electrónico
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="correo@ejemplo.com"
                                type="email"
                                {...field}
                                className="h-11 border-gray-200 pl-11 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700"
                              />
                              <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Teléfonos de contacto
                    </h3>
                  </div>

                  <Separator className="bg-gray-200 dark:bg-gray-700" />

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Teléfono principal
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="999999999"
                                {...field}
                                className="h-11 border-gray-200 pl-11 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700"
                              />
                              <Phone className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Teléfono alternativo
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="999999999"
                                {...field}
                                className="h-11 border-gray-200 pl-11 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700"
                              />
                              <Phone className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Document Information (Read-only) */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Información de identificación
                    </h3>
                  </div>

                  <Separator className="bg-gray-200 dark:bg-gray-700" />

                  <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6 dark:border-gray-700 dark:from-gray-800/50 dark:to-gray-900/50">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tipo de documento
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-800">
                            <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                            {lead.documentType}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Número de documento
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-800">
                            <span className="font-mono text-sm font-medium text-gray-600 dark:text-gray-400">
                              #
                            </span>
                          </div>
                          <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                            {lead.document}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        La información de identificación no puede ser modificada por seguridad
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </div>

        {/* Footer - Fixed */}
        <DialogFooter className="flex-shrink-0 gap-4 border-t border-gray-200 bg-white px-8 pt-6 pb-8 dark:border-gray-700 dark:bg-gray-900">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isUpdating}
            className="flex h-11 items-center gap-2 border-gray-300 px-6 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isUpdating || !form.formState.isDirty}
            className="flex h-11 items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 px-6 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
