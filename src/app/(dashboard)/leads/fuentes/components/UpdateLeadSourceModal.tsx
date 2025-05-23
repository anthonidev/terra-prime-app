'use client';

// app/(dashboard)/leads/fuentes/components/UpdateLeadSourceModal.tsx
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
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, FileText, Calendar } from 'lucide-react';
import FormInputField from '@/components/common/form/FormInputField';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { LeadSource } from '@/types/leads.types';
import { updateLeadSource } from '../action';

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

  // Update form values when leadSource changes
  useEffect(() => {
    if (isOpen && leadSource) {
      form.reset({
        name: leadSource.name,
        isActive: leadSource.isActive
      });
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

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP', { locale: es });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[80vh] max-w-md flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <FileText className="h-5 w-5" />
            Editar Fuente de Lead
          </DialogTitle>
        </DialogHeader>
        <Separator className="my-4" />
        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
            <AlertCircle className="text-destructive h-4 w-4" />
            <AlertDescription className="text-destructive text-sm">{error}</AlertDescription>
          </Alert>
        )}
        <div className="bg-muted/20 rounded-md p-3 text-sm">
          <div className="text-muted-foreground flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              ID: {leadSource.id} | Creado: {formatDate(leadSource.createdAt)}
            </span>
          </div>
        </div>
        <ScrollArea className="mt-4 flex-1 overflow-y-auto pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormInputField<UpdateLeadSourceFormData>
                  name="name"
                  label="Nombre"
                  placeholder="Nombre de la fuente"
                  icon={<FileText className="h-4 w-4" />}
                  control={form.control}
                  errors={form.formState.errors}
                />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Estado</label>
                    <p className="text-muted-foreground text-sm">
                      {form.watch('isActive') ? 'Activo' : 'Inactivo'}
                    </p>
                  </div>
                  <Switch
                    checked={form.watch('isActive')}
                    onCheckedChange={(checked) => form.setValue('isActive', checked)}
                  />
                </div>
              </div>
              <Separator />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter className="gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            type="button"
            className="border-input hover:bg-accent"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
