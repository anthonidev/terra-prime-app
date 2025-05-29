'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreateUpdateLeadDto, Lead } from '@/types/leads.types';
import { AlertCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useLeadDetail } from '../hooks/useLeadDetail';
import LeadDetailHeader from './LeadDetailHeader';
import LeadEditForm from './LeadEditForm';
import LeadVisits from './LeadVisits';

interface LeadDetailViewProps {
  lead: Lead;
}

export default function LeadDetailView({ lead }: LeadDetailViewProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { updating, error, updateLeadContactAction, registerDepartureAction } = useLeadDetail(lead);

  const handleOpenEditModal = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleUpdateLead = useCallback(
    async (data: CreateUpdateLeadDto) => {
      const success = await updateLeadContactAction(data, lead.id);
      if (success) {
        handleCloseEditModal();
      }
      return success;
    },
    [updateLeadContactAction, lead.id, handleCloseEditModal]
  );

  const handleRegisterDeparture = useCallback(async () => {
    return await registerDepartureAction(lead.id);
  }, [registerDepartureAction, lead.id]);

  if (!lead) {
    return (
      <div className="bg-destructive/10 border-destructive/30 mx-auto mb-6 flex max-w-lg flex-col items-center justify-center rounded-md border p-6 text-center">
        <AlertCircle className="text-destructive mb-4 h-12 w-12" />
        <h3 className="text-destructive mb-2 text-lg font-semibold">Lead no encontrado</h3>
        <p className="text-destructive/80">
          No se pudo encontrar la información del lead solicitado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert
          variant="destructive"
          className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Lead Information */}
      <LeadDetailHeader
        lead={lead}
        onEditClick={handleOpenEditModal}
        onRegisterDeparture={handleRegisterDeparture}
        isUpdating={updating}
      />

      {/* Visits History */}
      <LeadVisits lead={lead} />

      {/* Edit Modal */}
      <LeadEditForm
        lead={lead}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateLead}
        isUpdating={updating}
        error={error}
      />
    </div>
  );
}
