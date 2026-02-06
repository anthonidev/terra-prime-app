'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';

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
import { useActiveParticipants } from '@/features/participants/hooks/use-active-participants';
import { ParticipantType, type Participant } from '@/features/participants/types';
import { FormDialog } from '@/shared/components/form-dialog';
import { useAssignParticipants } from '../../hooks/use-assign-participants';
import { assignParticipantsSchema, type AssignParticipantsFormData } from '../../lib/validation';
import type { AdminSale } from '../../types';

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

interface AssignParticipantsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: AdminSale;
}

export function AssignParticipantsModal({
  open,
  onOpenChange,
  sale,
}: AssignParticipantsModalProps) {
  const { data: participants, isLoading: isLoadingParticipants } = useActiveParticipants();
  const { mutate, isPending } = useAssignParticipants();

  const form = useForm<AssignParticipantsFormData>({
    resolver: zodResolver(assignParticipantsSchema),
  });

  // Group participants by type
  const participantsByType = useMemo(() => {
    if (!participants) return {} as Record<ParticipantType, Participant[]>;

    return participants.reduce(
      (acc, participant) => {
        if (!acc[participant.participantType]) {
          acc[participant.participantType] = [];
        }
        acc[participant.participantType].push(participant);
        return acc;
      },
      {} as Record<ParticipantType, Participant[]>
    );
  }, [participants]);

  // Load current participants when sale/open changes
  useEffect(() => {
    if (sale && open) {
      form.reset({
        generalDirectorId: sale.generalDirector?.id || undefined,
        linerId: sale.liner?.id || undefined,
        telemarketingSupervisorId: sale.telemarketingSupervisor?.id || undefined,
        telemarketingConfirmerId: sale.telemarketingConfirmer?.id || undefined,
        telemarketerId: sale.telemarketer?.id || undefined,
        fieldManagerId: sale.fieldManager?.id || undefined,
        fieldSupervisorId: sale.fieldSupervisor?.id || undefined,
        fieldSellerId: sale.fieldSeller?.id || undefined,
        salesManagerId: sale.salesManager?.id || undefined,
        salesGeneralManagerId: sale.salesGeneralManager?.id || undefined,
        postSaleId: sale.postSale?.id || undefined,
        closerId: sale.closer?.id || undefined,
      });
    }
  }, [sale, open, form]);

  const onSubmit = async (data: AssignParticipantsFormData) => {
    // Convert all values, treating undefined/NONE as empty string for clearing assignments
    const processedData = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key as keyof AssignParticipantsFormData] = value || '';
      return acc;
    }, {} as Partial<AssignParticipantsFormData>);

    mutate(
      { saleId: sale.id, data: processedData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
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
      open={open}
      onOpenChange={onOpenChange}
      title="Asignar Participantes"
      description="Asigna los participantes correspondientes a esta venta"
      isEditing={true}
      isPending={isPending}
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
            'linerId',
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
