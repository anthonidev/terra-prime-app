'use client';

// app/(dashboard)/leads/fuentes/components/CreateLeadSourceModal.tsx
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
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, FileText } from 'lucide-react';
import FormInputField from '@/components/common/form/FormInputField';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createLeadSource } from '../action';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[80vh] max-w-md flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <FileText className="h-5 w-5" />
            Nueva Fuente de Lead
          </DialogTitle>
        </DialogHeader>
        <Separator className="my-4" />
        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
            <AlertCircle className="text-destructive h-4 w-4" />
            <AlertDescription className="text-destructive text-sm">{error}</AlertDescription>
          </Alert>
        )}
        <ScrollArea className="flex-1 overflow-y-auto pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormInputField<CreateLeadSourceFormData>
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
            {isSubmitting ? 'Creando...' : 'Crear Fuente'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
