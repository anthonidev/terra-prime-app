'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollText } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormDialog } from '@/shared/components/form-dialog';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { useCreateTemplate } from '../../hooks/use-create-template';
import { createTemplateSchema, type CreateTemplateFormValues } from '../../lib/validation';

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTemplateDialog({ open, onOpenChange }: CreateTemplateDialogProps) {
  const { data: projectsData } = useProjects();
  const projects = projectsData?.projects || [];
  const createMutation = useCreateTemplate();

  const form = useForm<CreateTemplateFormValues>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: '',
      description: '',
      projectId: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    createMutation.mutate(
      {
        name: data.name,
        description: data.description || '',
        projectId: data.projectId,
        content: { type: 'doc', content: [{ type: 'paragraph' }] },
        customVariables: [],
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Nueva Plantilla"
      description="Crea una plantilla de contrato para un proyecto"
      onSubmit={handleSubmit}
      form={form}
      icon={ScrollText}
      isPending={createMutation.isPending}
      submitLabel="Crear plantilla"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="create-name">Nombre</Label>
          <Input id="create-name" placeholder="Nombre de la plantilla" {...form.register('name')} />
          {form.formState.errors.name && (
            <p className="text-destructive mt-1 text-sm">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <Label>Proyecto</Label>
          <Select
            value={form.watch('projectId')}
            onValueChange={(value) => form.setValue('projectId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar proyecto" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.projectId && (
            <p className="text-destructive mt-1 text-sm">
              {form.formState.errors.projectId.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="create-desc">Descripción (opcional)</Label>
          <Textarea
            id="create-desc"
            placeholder="Descripción de la plantilla"
            rows={3}
            {...form.register('description')}
          />
          {form.formState.errors.description && (
            <p className="text-destructive mt-1 text-sm">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>
      </div>
    </FormDialog>
  );
}
