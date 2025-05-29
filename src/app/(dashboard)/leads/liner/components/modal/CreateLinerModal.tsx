'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { AlertCircle, UserCheck, User, FileText, CreditCard, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DocumentType } from '@/types/leads.types';
import { createLiner } from '../../action';

const createLinerSchema = z.object({
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
    errorMap: () => ({ message: 'El tipo de documento es requerido' })
  }),
  isActive: z.boolean().default(true)
});

type CreateLinerFormData = z.infer<typeof createLinerSchema>;

interface CreateLinerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateLinerModal({ isOpen, onClose }: CreateLinerModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<CreateLinerFormData>({
    resolver: zodResolver(createLinerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      document: '',
      documentType: DocumentType.DNI,
      isActive: true
    }
  });

  const onSubmit = async (data: CreateLinerFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createLiner(data);

      if (result.success) {
        toast.success('Liner creado correctamente');
        form.reset();
        onClose();
        router.refresh();
      } else {
        setError(result.error || 'Error al crear el liner');
        toast.error(result.error || 'Error al crear el liner');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el liner';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setError(null);
      onClose();
    }
  };

  const documentTypeOptions = [
    { value: DocumentType.DNI, label: 'DNI' },
    { value: DocumentType.CE, label: 'CE' },
    { value: DocumentType.RUC, label: 'RUC' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Nuevo Liner</DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Registrar un nuevo liner para la captación de leads
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="firstName"
                      placeholder="Nombre del liner"
                      className="pl-9"
                      {...form.register('firstName')}
                      disabled={isSubmitting}
                    />
                  </div>
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="lastName"
                      placeholder="Apellido del liner"
                      className="pl-9"
                      {...form.register('lastName')}
                      disabled={isSubmitting}
                    />
                  </div>
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="documentType">Tipo de Documento</Label>
                  <Select
                    value={form.watch('documentType')}
                    onValueChange={(value) => form.setValue('documentType', value as DocumentType)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4 text-gray-400" />
                        <SelectValue placeholder="Seleccionar tipo" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.documentType && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {form.formState.errors.documentType.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document">Número de Documento</Label>
                  <div className="relative">
                    <FileText className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="document"
                      placeholder="Número de documento"
                      className="pl-9"
                      {...form.register('document')}
                      disabled={isSubmitting}
                    />
                  </div>
                  {form.formState.errors.document && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {form.formState.errors.document.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Estado inicial</Label>
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${form.watch('isActive') ? 'bg-green-500' : 'bg-gray-400'}`}
                      />
                      <span className="text-sm font-medium">
                        {form.watch('isActive') ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {form.watch('isActive')
                        ? 'El liner estará disponible para asignar a leads'
                        : 'El liner no aparecerá en las opciones disponibles'}
                    </p>
                  </div>
                  <Switch
                    checked={form.watch('isActive')}
                    onCheckedChange={(checked) => form.setValue('isActive', checked)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !form.formState.isValid}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Crear Liner
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
