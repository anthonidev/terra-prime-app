'use client';

import { useContractTemplate } from './use-contract-template';
import { useUpdateTemplate } from './use-update-template';
import { usePublishTemplate } from './use-publish-template';
import { useUnpublishTemplate } from './use-unpublish-template';
import { useDeleteTemplate } from './use-delete-template';
import { useConfirmation } from '@/shared/hooks/use-confirmation';
import { TemplateStatus } from '../types';

export function useTemplateDetailContainer(id: string) {
  const { data: template, isLoading } = useContractTemplate(id);
  const updateMutation = useUpdateTemplate(id);
  const { confirm, ConfirmationDialog } = useConfirmation();
  const publishMutation = usePublishTemplate();
  const unpublishMutation = useUnpublishTemplate();
  const deleteMutation = useDeleteTemplate();

  const isDraft = template?.status === TemplateStatus.DRAFT;
  const isActive = template?.status === TemplateStatus.ACTIVE;

  const handlePublish = async () => {
    const confirmed = await confirm({
      title: 'Publicar plantilla',
      description: '¿Estás seguro de que deseas publicar esta plantilla?',
      confirmText: 'Publicar',
    });
    if (confirmed) publishMutation.mutate(id);
  };

  const handleUnpublish = async () => {
    const confirmed = await confirm({
      title: 'Despublicar plantilla',
      description: '¿Estás seguro de que deseas despublicar esta plantilla?',
      confirmText: 'Despublicar',
    });
    if (confirmed) unpublishMutation.mutate(id);
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Eliminar plantilla',
      description:
        '¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      variant: 'destructive',
    });
    if (confirmed) deleteMutation.mutate(id);
  };

  const handleUpdateInfo = (data: { name: string; description: string }) => {
    updateMutation.mutate(data);
  };

  return {
    template,
    isLoading,
    isDraft,
    isActive,
    handlePublish,
    handleUnpublish,
    handleDelete,
    handleUpdateInfo,
    isUpdating: updateMutation.isPending,
    ConfirmationDialog,
  };
}
