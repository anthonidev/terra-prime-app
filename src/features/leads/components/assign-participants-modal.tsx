'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useParticipants } from '../hooks/use-participants';
import { useAssignParticipants } from '../hooks/use-assign-participants';
import { ParticipantType, type LeadVisit, type ParticipantResponseActive } from '../types';

const participantLabels: Record<ParticipantType, string> = {
  [ParticipantType.LINER]: 'Liner',
  [ParticipantType.TELEMARKETING_SUPERVISOR]: 'Supervisor de Telemarketing',
  [ParticipantType.TELEMARKETING_CONFIRMER]: 'Confirmador de Telemarketing',
  [ParticipantType.TELEMARKETER]: 'Telemarketer',
  [ParticipantType.FIELD_MANAGER]: 'Gerente de Campo',
  [ParticipantType.FIELD_SUPERVISOR]: 'Supervisor de Campo',
  [ParticipantType.FIELD_SELLER]: 'Vendedor de Campo',
  [ParticipantType.SALES_MANAGER]: 'Gerente de Ventas',
  [ParticipantType.SALES_GENERAL_MANAGER]: 'Gerente General de Ventas',
  [ParticipantType.POST_SALE]: 'Post Venta',
  [ParticipantType.CLOSER]: 'Closer',
};

const assignParticipantsSchema = z.object({
  linerParticipantId: z.string().optional(),
  telemarketingSupervisorId: z.string().optional(),
  telemarketingConfirmerId: z.string().optional(),
  telemarketerId: z.string().optional(),
  fieldManagerId: z.string().optional(),
  fieldSupervisorId: z.string().optional(),
  fieldSellerId: z.string().optional(),
  salesManagerId: z.string().optional(),
  salesGeneralManagerId: z.string().optional(),
  postSaleId: z.string().optional(),
  closerId: z.string().optional(),
});

type AssignParticipantsFormData = z.infer<typeof assignParticipantsSchema>;

interface AssignParticipantsModalProps {
  visit: LeadVisit | null;
  leadId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AssignParticipantsModal({
  visit,
  leadId,
  isOpen,
  onClose,
}: AssignParticipantsModalProps) {
  const { data: participants, isLoading: isLoadingParticipants } = useParticipants();
  const assignParticipants = useAssignParticipants(leadId);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<AssignParticipantsFormData>({
    resolver: zodResolver(assignParticipantsSchema),
  });

  // Group participants by type
  const participantsByType = useMemo(() => {
    if (!participants) return {} as Record<ParticipantType, ParticipantResponseActive[]>;

    return participants.reduce((acc, participant) => {
      if (!acc[participant.participantType]) {
        acc[participant.participantType] = [];
      }
      acc[participant.participantType].push(participant);
      return acc;
    }, {} as Record<ParticipantType, ParticipantResponseActive[]>);
  }, [participants]);

  // Load current participants when visit changes
  useEffect(() => {
    if (visit) {
      setValue('linerParticipantId', visit.linerParticipant?.id || undefined);
      setValue('telemarketingSupervisorId', visit.telemarketingSupervisor?.id || undefined);
      setValue('telemarketingConfirmerId', visit.telemarketingConfirmer?.id || undefined);
      setValue('telemarketerId', visit.telemarketer?.id || undefined);
      setValue('fieldManagerId', visit.fieldManager?.id || undefined);
      setValue('fieldSupervisorId', visit.fieldSupervisor?.id || undefined);
      setValue('fieldSellerId', visit.fieldSeller?.id || undefined);
      setValue('salesManagerId', visit.salesManager?.id || undefined);
      setValue('salesGeneralManagerId', visit.salesGeneralManager?.id || undefined);
      setValue('postSaleId', visit.postSale?.id || undefined);
      setValue('closerId', visit.closer?.id || undefined);
    }
  }, [visit, setValue]);

  const onSubmit = async (data: AssignParticipantsFormData) => {
    if (!visit) return;

    // Convert all values, treating undefined/NONE as empty string for API
    const processedData = Object.entries(data).reduce((acc, [key, value]) => {
      // Include all fields, convert undefined to empty string for clearing assignments
      acc[key as keyof AssignParticipantsFormData] = value || '';
      return acc;
    }, {} as Partial<AssignParticipantsFormData>);

    await assignParticipants.mutateAsync({
      visitId: visit.id,
      data: processedData,
    });

    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const renderParticipantSelect = (
    type: ParticipantType,
    fieldName: keyof AssignParticipantsFormData,
    label: string
  ) => {
    const participantsForType = participantsByType[type] || [];
    const hasParticipants = participantsForType.length > 0;

    return (
      <div key={type} className="space-y-2">
        <Label htmlFor={fieldName}>{label}</Label>
        <Select
          value={watch(fieldName) || undefined}
          onValueChange={(value) => setValue(fieldName, value === 'NONE' ? '' : value)}
          disabled={!hasParticipants || isLoadingParticipants}
        >
          <SelectTrigger id={fieldName}>
            <SelectValue
              placeholder={
                isLoadingParticipants
                  ? 'Cargando...'
                  : hasParticipants
                  ? 'Seleccionar participante'
                  : 'No hay participantes'
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NONE">Sin asignar</SelectItem>
            {participantsForType.map((participant) => (
              <SelectItem key={participant.id} value={participant.id}>
                {participant.firstName} {participant.lastName} - {participant.document}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asignar Participantes a la Visita</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {renderParticipantSelect(
              ParticipantType.LINER,
              'linerParticipantId',
              participantLabels[ParticipantType.LINER]
            )}
            {renderParticipantSelect(
              ParticipantType.TELEMARKETING_SUPERVISOR,
              'telemarketingSupervisorId',
              participantLabels[ParticipantType.TELEMARKETING_SUPERVISOR]
            )}
            {renderParticipantSelect(
              ParticipantType.TELEMARKETING_CONFIRMER,
              'telemarketingConfirmerId',
              participantLabels[ParticipantType.TELEMARKETING_CONFIRMER]
            )}
            {renderParticipantSelect(
              ParticipantType.TELEMARKETER,
              'telemarketerId',
              participantLabels[ParticipantType.TELEMARKETER]
            )}
            {renderParticipantSelect(
              ParticipantType.FIELD_MANAGER,
              'fieldManagerId',
              participantLabels[ParticipantType.FIELD_MANAGER]
            )}
            {renderParticipantSelect(
              ParticipantType.FIELD_SUPERVISOR,
              'fieldSupervisorId',
              participantLabels[ParticipantType.FIELD_SUPERVISOR]
            )}
            {renderParticipantSelect(
              ParticipantType.FIELD_SELLER,
              'fieldSellerId',
              participantLabels[ParticipantType.FIELD_SELLER]
            )}
            {renderParticipantSelect(
              ParticipantType.SALES_MANAGER,
              'salesManagerId',
              participantLabels[ParticipantType.SALES_MANAGER]
            )}
            {renderParticipantSelect(
              ParticipantType.SALES_GENERAL_MANAGER,
              'salesGeneralManagerId',
              participantLabels[ParticipantType.SALES_GENERAL_MANAGER]
            )}
            {renderParticipantSelect(
              ParticipantType.POST_SALE,
              'postSaleId',
              participantLabels[ParticipantType.POST_SALE]
            )}
            {renderParticipantSelect(
              ParticipantType.CLOSER,
              'closerId',
              participantLabels[ParticipantType.CLOSER]
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={assignParticipants.isPending}>
              {assignParticipants.isPending ? 'Asignando...' : 'Asignar Participantes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
