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
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Building2, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { createLeadSource } from '../../action';

const createLeadSourceSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  isActive: z.boolean().default(true)
});

type CreateLeadSourceFormData = z.infer<typeof createLeadSourceSchema>;

interface CreateLeadSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateLeadSourceModal({ isOpen, onClose }: CreateLeadSourceModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<CreateLeadSourceFormData>({
    resolver: zodResolver(createLeadSourceSchema),
    defaultValues: {
      name: '',
      isActive: true
    }
  });

  const onSubmit = async (data: CreateLeadSourceFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createLeadSource(data);

      if (result.success) {
        toast.success('Fuente de lead creada correctamente');
        form.reset();
        onClose();
        router.refresh();
      } else {
        setError(result.error || 'Error al crear la fuente de lead');
        toast.error(result.error || 'Error al crear la fuente de lead');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la fuente de lead';
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Nueva Fuente de Lead</DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Crear una nueva fuente para categorizar los leads
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
                  <Label className="text-sm font-medium">Estado inicial</Label>
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
                      onCheckedChange={(checked) => form.setValue('isActive', checked)}
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
                      Crear Fuente
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
