'use client';

import { useState } from 'react';
import { useLeadDetail } from '../hooks/use-lead-detail';
import { LeadDetailHeader } from './lead-detail-header';
import { LeadInfoSections } from './lead-info-sections';
import { VisitsTable } from './visits-table';
import { EditLeadModal } from './edit-lead-modal';
import { AssignParticipantsModal } from './assign-participants-modal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { LeadDetailSkeleton } from './lead-detail-skeleton';
import type { LeadVisit } from '../types';

interface LeadDetailContainerProps {
  leadId: string;
}

export function LeadDetailContainer({ leadId }: LeadDetailContainerProps) {
  const { data: lead, isLoading, isError, error } = useLeadDetail(leadId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<LeadVisit | null>(null);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenAssignModal = (visit: LeadVisit) => {
    setSelectedVisit(visit);
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setSelectedVisit(null);
    setIsAssignModalOpen(false);
  };

  if (isLoading) {
    return <LeadDetailSkeleton />;
  }

  if (isError || !lead) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : 'Error al cargar los detalles del lead. Por favor, intente nuevamente.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <LeadDetailHeader lead={lead} onEdit={handleOpenEditModal} />

      {/* Historial de Visitas - Principal */}
      <VisitsTable
        visits={lead.visits || []}
        leadId={leadId}
        onAssignParticipants={handleOpenAssignModal}
      />

      {/* Información del Lead - Secundaria */}
      <LeadInfoSections lead={lead} />

      <EditLeadModal
        lead={lead}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
      />

      <AssignParticipantsModal
        visit={selectedVisit}
        leadId={leadId}
        isOpen={isAssignModalOpen}
        onClose={handleCloseAssignModal}
      />
    </div>
  );
}
