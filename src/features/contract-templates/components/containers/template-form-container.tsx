'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, GlobeLock, Save, ScrollText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/common/page-header';
import { useConfirmation } from '@/shared/hooks/use-confirmation';
import { useTemplateFormContainer } from '../../hooks/use-template-form-container';
import { usePublishTemplate } from '../../hooks/use-publish-template';
import { useUnpublishTemplate } from '../../hooks/use-unpublish-template';
import { TemplateStatus } from '../../types';
import { TemplateForm } from '../forms/template-form';
import { TemplateFormSkeleton } from '../skeletons/template-form-skeleton';
import { EditTemplateInfoDialog } from '../dialogs/edit-template-info-dialog';

interface TemplateFormContainerProps {
  templateId: string;
}

export function TemplateFormContainer({ templateId }: TemplateFormContainerProps) {
  const router = useRouter();
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const {
    form,
    isLoading,
    isPending,
    isDirty,
    initialContent,
    handleSubmit,
    handleSave,
    templateName,
    templateDescription,
    templateStatus,
  } = useTemplateFormContainer(templateId);

  const publishMutation = usePublishTemplate();
  const unpublishMutation = useUnpublishTemplate();
  const { confirm, ConfirmationDialog } = useConfirmation();

  const isActive = templateStatus === TemplateStatus.ACTIVE;

  const handlePublish = async () => {
    const confirmed = await confirm({
      title: 'Publicar plantilla',
      description:
        'Al publicar, esta plantilla estará disponible para generar contratos. ¿Deseas continuar?',
      confirmText: 'Publicar',
    });
    if (confirmed) publishMutation.mutate(templateId);
  };

  const handleUnpublish = async () => {
    const confirmed = await confirm({
      title: 'Despublicar plantilla',
      description:
        'Al despublicar, esta plantilla dejará de estar disponible para generar contratos. ¿Deseas continuar?',
      confirmText: 'Despublicar',
      variant: 'destructive',
    });
    if (confirmed) unpublishMutation.mutate(templateId);
  };

  if (isLoading) return <TemplateFormSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={templateName || 'Editar Plantilla'}
        description={templateDescription || 'Modifica el contenido de la plantilla de contrato'}
        icon={ScrollText}
        onTitleClick={() => setInfoDialogOpen(true)}
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/contratos/plantillas')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={isPending} className="relative">
            {isPending ? (
              <span className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Guardando...
              </span>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar
                <kbd className="text-muted-foreground bg-muted ml-1.5 rounded px-1 py-0.5 font-mono text-[10px]">
                  Ctrl+S
                </kbd>
              </>
            )}
            {isDirty && !isPending && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
            )}
          </Button>
          {isActive ? (
            <Button
              variant="destructive"
              onClick={handleUnpublish}
              disabled={unpublishMutation.isPending}
            >
              <GlobeLock className="mr-2 h-4 w-4" />
              Despublicar
            </Button>
          ) : (
            <Button onClick={handlePublish} disabled={publishMutation.isPending}>
              <Globe className="mr-2 h-4 w-4" />
              Publicar
            </Button>
          )}
        </div>
      </PageHeader>

      <TemplateForm form={form} initialContent={initialContent} onSave={handleSave} />
      <ConfirmationDialog />
      <EditTemplateInfoDialog
        open={infoDialogOpen}
        onOpenChange={setInfoDialogOpen}
        name={form.getValues('name')}
        description={form.getValues('description') || ''}
        isPending={isPending}
        onSave={(data) => {
          form.setValue('name', data.name, { shouldDirty: true });
          form.setValue('description', data.description, { shouldDirty: true });
          setInfoDialogOpen(false);
          handleSave();
        }}
      />
    </div>
  );
}
