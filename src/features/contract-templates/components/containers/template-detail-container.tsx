'use client';

import { useState, ViewTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, ScrollText, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/common/page-header';
import { useTemplateDetailContainer } from '../../hooks/use-template-detail-container';
import { TemplatePreview } from '../displays/template-preview';
import { TemplateFormSkeleton } from '../skeletons/template-form-skeleton';
import { EditTemplateInfoDialog } from '../dialogs/edit-template-info-dialog';
import { TemplateStatus } from '../../types';

const STATUS_BADGE: Record<
  TemplateStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  [TemplateStatus.DRAFT]: { label: 'Borrador', variant: 'secondary' },
  [TemplateStatus.ACTIVE]: { label: 'Activo', variant: 'default' },
  [TemplateStatus.INACTIVE]: { label: 'Inactivo', variant: 'outline' },
};

interface TemplateDetailContainerProps {
  templateId: string;
}

export function TemplateDetailContainer({ templateId }: TemplateDetailContainerProps) {
  const router = useRouter();
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const {
    template,
    isLoading,
    isDraft,
    isActive,
    handlePublish,
    handleUnpublish,
    handleDelete,
    handleUpdateInfo,
    isUpdating,
    ConfirmationDialog,
  } = useTemplateDetailContainer(templateId);

  if (isLoading || !template) return <TemplateFormSkeleton />;

  const badge = STATUS_BADGE[template.status];

  return (
    <ViewTransition name={`template-${template.id}`}>
      <div className="space-y-6">
        <PageHeader
          title={template.name}
          description={template.description || 'Sin descripción'}
          icon={ScrollText}
          onTitleClick={() => setInfoDialogOpen(true)}
        >
          <div className="flex items-center gap-2">
            <Badge variant={badge.variant}>{badge.label}</Badge>

            <Button variant="outline" onClick={() => router.push('/contratos/plantillas')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>

            {isDraft && (
              <Button
                variant="outline"
                onClick={() => router.push(`/contratos/plantillas/editar/${template.id}`)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}

            {isDraft && (
              <Button onClick={handlePublish}>
                <ToggleRight className="mr-2 h-4 w-4" />
                Publicar
              </Button>
            )}

            {isActive && (
              <Button variant="outline" onClick={handleUnpublish}>
                <ToggleLeft className="mr-2 h-4 w-4" />
                Despublicar
              </Button>
            )}

            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </PageHeader>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-card rounded-lg border p-4">
            <p className="text-muted-foreground text-xs">Proyecto</p>
            <p className="font-medium">{template.project?.name || '-'}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-muted-foreground text-xs">Variables personalizadas</p>
            <p className="font-medium">{template.customVariables?.length || 0}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-muted-foreground text-xs">Última actualización</p>
            <p className="font-medium">
              {new Date(template.updatedAt).toLocaleDateString('es-PE')}
            </p>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Vista previa</h2>
          <TemplatePreview content={template.content} />
        </div>

        <ConfirmationDialog />
        <EditTemplateInfoDialog
          open={infoDialogOpen}
          onOpenChange={setInfoDialogOpen}
          name={template.name}
          description={template.description || ''}
          isPending={isUpdating}
          onSave={(data) => {
            handleUpdateInfo(data);
            setInfoDialogOpen(false);
          }}
        />
      </div>
    </ViewTransition>
  );
}
