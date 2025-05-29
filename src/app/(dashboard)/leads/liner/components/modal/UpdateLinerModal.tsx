'use client';

import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  AlertCircle,
  UserCheck,
  User,
  FileText,
  CreditCard,
  Calendar,
  Save,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DocumentType, Liner } from '@/types/leads.types';
import { updateLiner } from '../../action';

const updateLinerSchema = z.object({
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
  isActive: z.boolean()
});

type UpdateLinerFormData = z.infer<typeof updateLinerSchema>;

interface UpdateLinerModalProps {
  isOpen: boolean;
  onClose: () => void;
  liner: Liner;
}

export default function UpdateLinerModal({ isOpen, onClose, liner }: UpdateLinerModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<UpdateLinerFormData>({
    resolver: zodResolver(updateLinerSchema),
    defaultValues: {
      firstName: liner.firstName,
      lastName: liner.lastName,
      document: liner.document,
      documentType: liner.documentType,
      isActive: liner.isActive
    }
  });

  useEffect(() => {
    if (isOpen && liner) {
      form.reset({
        firstName: liner.firstName,
        lastName: liner.lastName,
        document: liner.document,
        documentType: liner.documentType,
        isActive: liner.isActive
      });
      setError(null);
    }
  }, [isOpen, liner, form]);

  const onSubmit = async (data: UpdateLinerFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await updateLiner(liner.id, data);

      if (result.success) {
        toast.success('Liner actualizado correctamente');
        onClose();
        router.refresh();
      } else {
        setError(result.error || 'Error al actualizar el liner');
        toast.error(result.error || 'Error al actualizar el liner');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el liner';
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

  const hasChanges = form.formState.isDirty;

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
              <DialogTitle className="text-lg font-semibold">Editar Liner</DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Modificar la información del liner
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Información del liner */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ID: {liner.id.substring(0, 8)}...
                </span>
                <Badge
                  variant={liner.isActive ? 'default' : 'secondary'}
                  className={
                    liner.isActive
                      ? 'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }
                >
                  {liner.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>Creado: {format(new Date(liner.createdAt), 'PPP', { locale: es })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>Actualizado: {format(new Date(liner.updatedAt), 'PPP', { locale: es })}</span>
              </div>
            </div>
          </div>

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
                    onValueChange={(value) =>
                      form.setValue('documentType', value as DocumentType, { shouldDirty: true })
                    }
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
                <Label className="text-sm font-medium">Estado del liner</Label>
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
                    onCheckedChange={(checked) =>
                      form.setValue('isActive', checked, { shouldDirty: true })
                    }
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
                  disabled={isSubmitting || !hasChanges || !form.formState.isValid}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Guardar Cambios
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
