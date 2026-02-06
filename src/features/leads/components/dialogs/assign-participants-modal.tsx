'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormDialog } from '@/shared/components/form-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAssignParticipants } from '../../hooks/use-assign-participants';
import { useParticipants } from '../../hooks/use-participants';
import { ParticipantType, type LeadVisit, type ParticipantResponseActive } from '../../types';

const participantLabels: Record<ParticipantType, string> = {
  [ParticipantType.LINER]: 'Liner',
  [ParticipantType.TELEMARKETING_SUPERVISOR]: 'Sup. Telemarketing',
  [ParticipantType.TELEMARKETING_CONFIRMER]: 'Conf. Telemarketing',
  [ParticipantType.TELEMARKETER]: 'Telemarketer',
  [ParticipantType.FIELD_MANAGER]: 'Gte. de Campo',
  [ParticipantType.FIELD_SUPERVISOR]: 'Sup. de Campo',
  [ParticipantType.FIELD_SELLER]: 'Vendedor de Campo',
  [ParticipantType.SALES_MANAGER]: 'Gte. de Ventas',
  [ParticipantType.SALES_GENERAL_MANAGER]: 'Gte. Gral. de Ventas',
  [ParticipantType.POST_SALE]: 'Post Venta',
  [ParticipantType.CLOSER]: 'Closer',
  [ParticipantType.GENERAL_DIRECTOR]: 'Director General',
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
  generalDirectorId: z.string().optional(),
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

  const form = useForm<AssignParticipantsFormData>({
    resolver: zodResolver(assignParticipantsSchema),
  });

  // Group participants by type
  const participantsByType = useMemo(() => {
    if (!participants) return {} as Record<ParticipantType, ParticipantResponseActive[]>;

    return participants.reduce(
      (acc, participant) => {
        if (!acc[participant.participantType]) {
          acc[participant.participantType] = [];
        }
        acc[participant.participantType].push(participant);
        return acc;
      },
      {} as Record<ParticipantType, ParticipantResponseActive[]>
    );
  }, [participants]);

  // Load current participants when visit changes
  useEffect(() => {
    if (visit && isOpen) {
      form.reset({
        linerParticipantId: visit.linerParticipant?.id || undefined,
        telemarketingSupervisorId: visit.telemarketingSupervisor?.id || undefined,
        telemarketingConfirmerId: visit.telemarketingConfirmer?.id || undefined,
        telemarketerId: visit.telemarketer?.id || undefined,
        fieldManagerId: visit.fieldManager?.id || undefined,
        fieldSupervisorId: visit.fieldSupervisor?.id || undefined,
        fieldSellerId: visit.fieldSeller?.id || undefined,
        salesManagerId: visit.salesManager?.id || undefined,
        salesGeneralManagerId: visit.salesGeneralManager?.id || undefined,
        postSaleId: visit.postSale?.id || undefined,
        closerId: visit.closer?.id || undefined,
        generalDirectorId: visit.generalDirector?.id || undefined,
      });
    }
  }, [visit, isOpen, form]);

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

  const renderParticipantSelect = (
    type: ParticipantType,
    fieldName: keyof AssignParticipantsFormData,
    label: string
  ) => {
    const participantsForType = participantsByType[type] || [];
    const hasParticipants = participantsForType.length > 0;

    return (
      <FormField
        key={type}
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-foreground flex items-center gap-1.5 text-xs font-medium">
              <User className="h-3 w-3 shrink-0" />
              <span className="truncate">{label}</span>
            </FormLabel>
            <Select
              value={field.value || undefined}
              onValueChange={(value) => field.onChange(value === 'NONE' ? '' : value)}
              disabled={!hasParticipants || isLoadingParticipants}
            >
              <FormControl>
                <SelectTrigger className="focus:ring-primary/30 h-8 w-full max-w-full min-w-0 overflow-hidden whitespace-normal transition-all [&>span:first-child]:truncate">
                  <SelectValue
                    className="truncate"
                    placeholder={
                      isLoadingParticipants
                        ? 'Cargando...'
                        : hasParticipants
                          ? 'Seleccionar'
                          : 'No disponible'
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="NONE">Sin asignar</SelectItem>
                {participantsForType.map((participant) => (
                  <SelectItem key={participant.id} value={participant.id}>
                    {participant.firstName} {participant.lastName} - {participant.document}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <FormDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Asignar Participantes"
      description="Asigna los participantes correspondientes a esta visita"
      isEditing={true}
      isPending={assignParticipants.isPending}
      onSubmit={form.handleSubmit(onSubmit)}
      submitLabel="Asignar Participantes"
      maxWidth="2xl"
    >
      <Form {...form}>
        <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
          {renderParticipantSelect(
            ParticipantType.GENERAL_DIRECTOR,
            'generalDirectorId',
            participantLabels[ParticipantType.GENERAL_DIRECTOR]
          )}
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
      </Form>
    </FormDialog>
  );
}
