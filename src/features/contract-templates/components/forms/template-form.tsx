'use client';

import { useCallback, useMemo, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { JSONContent } from '@tiptap/react';

import { TiptapEditor } from '../editor/tiptap-editor';
import { CustomVariableDialog } from '../dialogs/custom-variable-dialog';
import type { TemplateFormValues } from '../../lib/validation';
import type { CustomVariable } from '../../types';
import type { CustomVariableFormValues } from '../../lib/validation';

interface TemplateFormProps {
  form: UseFormReturn<TemplateFormValues>;
  initialContent?: JSONContent;
  onSave?: () => void;
}

export function TemplateForm({ form, initialContent, onSave }: TemplateFormProps) {
  const [customVarDialogOpen, setCustomVarDialogOpen] = useState(false);

  const customVariables = form.watch('customVariables') || [];

  const handleEditorUpdate = useCallback(
    (json: JSONContent) => {
      form.setValue('content', JSON.stringify(json), { shouldDirty: true });
    },
    [form]
  );

  const handleAddCustomVariable = useCallback(
    (variable: CustomVariableFormValues) => {
      const current = form.getValues('customVariables') || [];
      form.setValue('customVariables', [...current, variable as CustomVariable], {
        shouldDirty: true,
      });
    },
    [form]
  );

  const editorContent = useMemo(() => {
    if (initialContent) return initialContent;
    const raw = form.getValues('content');
    if (!raw) return undefined;
    try {
      return JSON.parse(raw);
    } catch {
      return undefined;
    }
  }, [initialContent, form]);

  return (
    <>
      <TiptapEditor
        content={editorContent}
        onUpdate={handleEditorUpdate}
        customVariables={customVariables}
        onAddCustomVariable={() => setCustomVarDialogOpen(true)}
        onSave={onSave}
      />
      {form.formState.errors.content && (
        <p className="text-destructive mt-1 text-sm">{form.formState.errors.content.message}</p>
      )}

      <CustomVariableDialog
        open={customVarDialogOpen}
        onOpenChange={setCustomVarDialogOpen}
        onSave={handleAddCustomVariable}
      />
    </>
  );
}
