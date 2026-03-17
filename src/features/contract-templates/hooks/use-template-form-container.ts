'use client';

import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type { JSONContent } from '@tiptap/react';

import { useContractTemplate } from './use-contract-template';
import { useUpdateTemplate } from './use-update-template';
import { templateFormSchema, type TemplateFormValues } from '../lib/validation';

export function useTemplateFormContainer(templateId: string) {
  const { data: template, isLoading } = useContractTemplate(templateId);
  const updateMutation = useUpdateTemplate(templateId);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: '',
      description: '',
      projectId: '',
      content: '',
      customVariables: [],
    },
    values: template
      ? {
          name: template.name,
          description: template.description || '',
          projectId: template.projectId,
          content:
            typeof template.content === 'string'
              ? template.content
              : JSON.stringify(template.content),
          customVariables: template.customVariables || [],
        }
      : undefined,
  });

  const initialContent = useMemo<JSONContent | undefined>(() => {
    if (!template?.content) return undefined;
    if (typeof template.content === 'object') return template.content as JSONContent;
    try {
      return JSON.parse(template.content);
    } catch {
      return undefined;
    }
  }, [template?.content]);

  const handleSubmit = form.handleSubmit((data) => {
    let contentObj: Record<string, unknown>;
    try {
      contentObj = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
    } catch {
      contentObj = { type: 'doc', content: [{ type: 'paragraph' }] };
    }

    updateMutation.mutate(
      {
        name: data.name,
        description: data.description || '',
        content: contentObj,
        customVariables: data.customVariables || [],
      },
      {
        onSuccess: () => {
          form.reset(form.getValues());
          toast.success('Cambios guardados', { duration: 2000 });
        },
        onError: () => toast.error('Error al guardar la plantilla'),
      }
    );
  });

  const handleSave = useCallback(() => {
    const data = form.getValues();
    let contentObj: Record<string, unknown>;
    try {
      contentObj = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
    } catch {
      contentObj = { type: 'doc', content: [{ type: 'paragraph' }] };
    }

    updateMutation.mutate(
      {
        name: data.name,
        description: data.description || '',
        content: contentObj,
        customVariables: data.customVariables || [],
      },
      {
        onSuccess: () => {
          form.reset(form.getValues());
          toast.success('Cambios guardados', { duration: 2000 });
        },
        onError: () => toast.error('Error al guardar la plantilla'),
      }
    );
  }, [form, updateMutation]);

  return {
    form,
    isLoading,
    isPending: updateMutation.isPending,
    isDirty: form.formState.isDirty,
    initialContent,
    handleSubmit,
    handleSave,
    templateName: template?.name,
    templateDescription: template?.description,
    templateStatus: template?.status,
  };
}
