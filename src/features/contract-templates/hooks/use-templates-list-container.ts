'use client';

import { useState } from 'react';
import { useContractTemplates } from './use-contract-templates';
import { usePublishTemplate } from './use-publish-template';
import { useUnpublishTemplate } from './use-unpublish-template';
import { useDeleteTemplate } from './use-delete-template';
import { useConfirmation } from '@/shared/hooks/use-confirmation';
import type { TemplateStatus } from '../types';

type ViewMode = 'grid' | 'list';

const STORAGE_KEY = 'templates-view-mode';

function getInitialViewMode(): ViewMode {
  if (typeof window === 'undefined') return 'grid';
  return (localStorage.getItem(STORAGE_KEY) as ViewMode) || 'grid';
}

export function useTemplatesListContainer() {
  const [viewMode, setViewModeState] = useState<ViewMode>(getInitialViewMode);
  const [projectId, setProjectId] = useState('');
  const [status, setStatus] = useState('ALL');
  const [term, setTerm] = useState('');
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  const { confirm, ConfirmationDialog } = useConfirmation();
  const publishMutation = usePublishTemplate();
  const unpublishMutation = useUnpublishTemplate();
  const deleteMutation = useDeleteTemplate();

  const params = {
    ...(projectId && { projectId }),
    page,
    limit: 20,
    order,
    ...(status !== 'ALL' && { status: status as TemplateStatus }),
    ...(term && { term }),
  };

  const { data, isLoading } = useContractTemplates(params);

  const templates = data?.items || [];
  const meta = data?.meta;
  const isEmpty = !isLoading && templates.length === 0;

  const handlePublish = async (id: string) => {
    const confirmed = await confirm({
      title: 'Publicar plantilla',
      description:
        '¿Estás seguro de que deseas publicar esta plantilla? Estará disponible para generar contratos.',
      confirmText: 'Publicar',
    });
    if (confirmed) publishMutation.mutate(id);
  };

  const handleUnpublish = async (id: string) => {
    const confirmed = await confirm({
      title: 'Despublicar plantilla',
      description:
        '¿Estás seguro de que deseas despublicar esta plantilla? Ya no estará disponible para generar contratos.',
      confirmText: 'Despublicar',
    });
    if (confirmed) unpublishMutation.mutate(id);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Eliminar plantilla',
      description:
        '¿Estás seguro de que deseas eliminar esta plantilla? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      variant: 'destructive',
    });
    if (confirmed) deleteMutation.mutate(id);
  };

  const toggleOrder = () => setOrder((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));

  return {
    templates,
    meta,
    isLoading,
    isEmpty,
    viewMode,
    setViewMode,
    projectId,
    setProjectId,
    status,
    setStatus,
    term,
    setTerm,
    page,
    setPage,
    order,
    toggleOrder,
    handlePublish,
    handleUnpublish,
    handleDelete,
    ConfirmationDialog,
  };
}
