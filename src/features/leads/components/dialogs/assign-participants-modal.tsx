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
import { Megaphone, ShieldCheck, Store, Handshake, Users, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAssignParticipants } from '../../hooks/use-assign-participants';
import { useParticipants } from '../../hooks/use-participants';
import { ParticipantType, type LeadVisit, type ParticipantResponseActive } from '../../types';

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

interface ParticipantFieldConfig {
  type: ParticipantType;
  fieldName: keyof AssignParticipantsFormData;
  label: string;
}

interface ParticipantGroup {
  title: string;
  icon: LucideIcon;
  fields: ParticipantFieldConfig[];
}

const participantGroups: ParticipantGroup[] = [
  {
    title: 'Dirección',
    icon: ShieldCheck,
    fields: [
      {
        type: ParticipantType.GENERAL_DIRECTOR,
        fieldName: 'generalDirectorId',
        label: 'Director General',
      },
      { type: ParticipantType.LINER, fieldName: 'linerParticipantId', label: 'Liner' },
    ],
  },
  {
    title: 'Telemarketing',
    icon: Megaphone,
    fields: [
      {
        type: ParticipantType.TELEMARKETING_SUPERVISOR,
        fieldName: 'telemarketingSupervisorId',
        label: 'Supervisor',
      },
      {
        type: ParticipantType.TELEMARKETING_CONFIRMER,
        fieldName: 'telemarketingConfirmerId',
        label: 'Confirmador',
      },
      { type: ParticipantType.TELEMARKETER, fieldName: 'telemarketerId', label: 'Telemarketer' },
    ],
  },
  {
    title: 'Campo',
    icon: Store,
    fields: [
      { type: ParticipantType.FIELD_MANAGER, fieldName: 'fieldManagerId', label: 'Gerente' },
      {
        type: ParticipantType.FIELD_SUPERVISOR,
        fieldName: 'fieldSupervisorId',
        label: 'Supervisor',
      },
      { type: ParticipantType.FIELD_SELLER, fieldName: 'fieldSellerId', label: 'Vendedor' },
    ],
  },
  {
    title: 'Ventas',
    icon: Handshake,
    fields: [
      { type: ParticipantType.SALES_MANAGER, fieldName: 'salesManagerId', label: 'Gerente' },
      {
        type: ParticipantType.SALES_GENERAL_MANAGER,
        fieldName: 'salesGeneralManagerId',
        label: 'Gerente General',
      },
      { type: ParticipantType.CLOSER, fieldName: 'closerId', label: 'Closer' },
    ],
  },
  {
    title: 'Post Venta',
    icon: Users,
    fields: [{ type: ParticipantType.POST_SALE, fieldName: 'postSaleId', label: 'Post Venta' }],
  },
];

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

  const formValues = form.watch();

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

  // Count assigned participants
  const assignedCount = useMemo(() => {
    return Object.values(formValues).filter((v) => v && v !== 'NONE').length;
  }, [formValues]);

  // Load current participants when visit changes
  useEffect(() => {
    if (visit && isOpen) {
      form.reset({
        linerParticipantId: visit.liner?.id || undefined,
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

    const processedData = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key as keyof AssignParticipantsFormData] = value || '';
      return acc;
    }, {} as Partial<AssignParticipantsFormData>);

    await assignParticipants.mutateAsync({
      visitId: visit.id,
      data: processedData,
    });

    onClose();
  };

  const renderParticipantSelect = (fieldConfig: ParticipantFieldConfig) => {
    const participantsForType = participantsByType[fieldConfig.type] || [];
    const hasParticipants = participantsForType.length > 0;

    return (
      <FormField
        key={fieldConfig.type}
        control={form.control}
        name={fieldConfig.fieldName}
        render={({ field }) => {
          const isAssigned = !!field.value && field.value !== 'NONE';
          return (
            <FormItem className="space-y-1">
              <FormLabel className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <span
                  className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${isAssigned ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}
                />
                <span className="truncate">{fieldConfig.label}</span>
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
                            ? 'Sin asignar'
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
          );
        }}
      />
    );
  };

  return (
    <FormDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="Asignar Participantes"
      description={`${assignedCount} de 12 asignados`}
      isEditing={true}
      isPending={assignParticipants.isPending}
      onSubmit={form.handleSubmit(onSubmit)}
      submitLabel="Guardar Asignaciones"
      maxWidth="2xl"
      icon={Users}
    >
      <Form {...form}>
        <div className="space-y-5">
          {participantGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title}>
                <div className="mb-2.5 flex items-center gap-2">
                  <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-md">
                    <Icon className="text-muted-foreground h-3.5 w-3.5" />
                  </div>
                  <h4 className="text-foreground text-xs font-semibold tracking-wide uppercase">
                    {group.title}
                  </h4>
                  <div className="bg-border h-px flex-1" />
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
                  {group.fields.map(renderParticipantSelect)}
                </div>
              </div>
            );
          })}
        </div>
      </Form>
    </FormDialog>
  );
}
