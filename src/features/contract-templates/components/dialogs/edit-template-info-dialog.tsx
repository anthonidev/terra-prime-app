'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormDialog } from '@/shared/components/form-dialog';

const schema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  description: z.string().max(500, 'La descripción no puede exceder 500 caracteres'),
});

type FormValues = z.infer<typeof schema>;

interface EditTemplateInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  description: string;
  isPending: boolean;
  onSave: (data: { name: string; description: string }) => void;
}

export function EditTemplateInfoDialog({
  open,
  onOpenChange,
  name,
  description,
  isPending,
  onSave,
}: EditTemplateInfoDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name, description },
  });

  useEffect(() => {
    if (open) {
      form.reset({ name, description });
    }
  }, [open, name, description, form]);

  const handleSubmit = form.handleSubmit((data) => {
    onSave(data);
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Editar información"
      description="Modifica el nombre y la descripción de la plantilla"
      icon={Pencil}
      isEditing
      isPending={isPending}
      onSubmit={handleSubmit}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Nombre</Label>
          <Input id="template-name" {...form.register('name')} />
          {form.formState.errors.name && (
            <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="template-description">Descripción</Label>
          <Textarea id="template-description" rows={3} {...form.register('description')} />
          {form.formState.errors.description && (
            <p className="text-destructive text-sm">{form.formState.errors.description.message}</p>
          )}
        </div>
      </div>
    </FormDialog>
  );
}
