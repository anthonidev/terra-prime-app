'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import { LeadSource } from '@/types/leads.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertCircle, Building2, Calendar, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { updateLeadSource } from '../../action';

const updateLeadSourceSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  isActive: z.boolean()
});

type UpdateLeadSourceFormData = z.infer<typeof updateLeadSourceSchema>;

interface UpdateLeadSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadSource: LeadSource;
}

export default function UpdateLeadSourceModal({
  isOpen,
  onClose,
  leadSource
}: UpdateLeadSourceModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<UpdateLeadSourceFormData>({
    resolver: zodResolver(updateLeadSourceSchema),
    defaultValues: {
      name: leadSource.name,
      isActive: leadSource.isActive
    }
  });

  useEffect(() => {
    if (isOpen && leadSource) {
      form.reset({
        name: leadSource.name,
        isActive: leadSource.isActive
      });
      setError(null);
    }
  }, [isOpen, leadSource, form]);

  const onSubmit = async (data: UpdateLeadSourceFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await updateLeadSource(leadSource.id, data);

      if (result.success) {
        toast.success('Fuente de lead actualizada correctamente');
        onClose();
        router.refresh();
      } else {
        setError(result.error || 'Error al actualizar la fuente de lead');
        toast.error(result.error || 'Error al actualizar la fuente de lead');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar la fuente de lead';
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Editar Fuente de Lead</DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Modificar la información de la fuente
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Información de la fuente */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ID: #{leadSource.id}
                </span>
                <Badge
                  variant={leadSource.isActive ? 'default' : 'secondary'}
                  className={
                    leadSource.isActive
                      ? 'border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }
                >
                  {leadSource.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>Creado: {format(new Date(leadSource.createdAt), 'PPP', { locale: es })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>
                  Actualizado: {format(new Date(leadSource.updatedAt), 'PPP', { locale: es })}
                </span>
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

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la fuente</Label>
                  <div className="relative">
                    <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="Ej: Facebook, Google Ads, Referidos..."
                      className="pl-9"
                      {...form.register('name')}
                      disabled={isSubmitting}
                    />
                  </div>
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Estado de la fuente</Label>
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${form.watch('isActive') ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                        <span className="text-sm font-medium">
                          {form.watch('isActive') ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {form.watch('isActive')
                          ? 'La fuente estará disponible para asignar a leads'
                          : 'La fuente no aparecerá en las opciones disponibles'}
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
