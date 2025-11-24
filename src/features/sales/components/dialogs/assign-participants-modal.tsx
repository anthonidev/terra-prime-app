'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, Phone, MapPin, Briefcase, UserCheck } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useActiveParticipants } from '@/features/participants/hooks/use-active-participants';
import { ParticipantType } from '@/features/participants/types';
import { FormDialog } from '@/shared/components/form-dialog';
import { useAssignParticipants } from '../../hooks/use-assign-participants';
import { assignParticipantsSchema, type AssignParticipantsFormData } from '../../lib/validation';

interface AssignParticipantsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleId: string;
}

export function AssignParticipantsModal({
  open,
  onOpenChange,
  saleId,
}: AssignParticipantsModalProps) {
  const { data: participants, isLoading: isLoadingParticipants } = useActiveParticipants();
  const { mutate, isPending } = useAssignParticipants();

  const form = useForm<AssignParticipantsFormData>({
    resolver: zodResolver(assignParticipantsSchema),
    defaultValues: {
      linerId: undefined,
      telemarketingSupervisorId: undefined,
      telemarketingConfirmerId: undefined,
      telemarketerId: undefined,
      fieldManagerId: undefined,
      fieldSupervisorId: undefined,
      fieldSellerId: undefined,
      salesManagerId: undefined,
      salesGeneralManagerId: undefined,
      postSaleId: undefined,
      closerId: undefined,
    },
  });

  const onSubmit = () => {
    const data = form.getValues();
    // Filter out undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== '')
    );

    mutate(
      { saleId, data: cleanedData },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };

  // Filter participants by type
  const getParticipantsByType = (type: ParticipantType) => {
    return participants?.filter((p) => p.participantType === type) || [];
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Asignar Participantes"
      description="Selecciona los participantes que deseas asignar a esta venta."
      icon={Users}
      form={form}
      onSubmit={onSubmit}
      submitLabel="Asignar Participantes"
      isPending={isPending}
      className="sm:max-w-3xl"
    >
      <div className="space-y-6">
        {/* Telemarketing Section */}
        <div className="space-y-4">
          <div className="text-primary flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <h4 className="text-sm font-medium">Equipo de Telemarketing</h4>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="linerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liner</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingParticipants || isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getParticipantsByType(ParticipantType.LINER).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telemarketerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telemarketer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingParticipants || isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getParticipantsByType(ParticipantType.TELEMARKETER).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telemarketingSupervisorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingParticipants || isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getParticipantsByType(ParticipantType.TELEMARKETING_SUPERVISOR).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telemarketingConfirmerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmador</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingParticipants || isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getParticipantsByType(ParticipantType.TELEMARKETING_CONFIRMER).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Field Section */}
        <div className="space-y-4">
          <div className="text-primary flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <h4 className="text-sm font-medium">Equipo de Campo</h4>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fieldSellerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendedor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingParticipants || isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getParticipantsByType(ParticipantType.FIELD_SELLER).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fieldSupervisorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingParticipants || isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getParticipantsByType(ParticipantType.FIELD_SUPERVISOR).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fieldManagerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gerente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingParticipants || isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getParticipantsByType(ParticipantType.FIELD_MANAGER).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Management Section */}
        <div className="space-y-4">
          <div className="text-primary flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <h4 className="text-sm font-medium">Gerencia y Cierre</h4>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="salesManagerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gerente de Ventas</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingParticipants || isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getParticipantsByType(ParticipantType.SALES_MANAGER).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salesGeneralManagerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gerente General</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingParticipants || isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getParticipantsByType(ParticipantType.SALES_GENERAL_MANAGER).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="closerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Closer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingParticipants || isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getParticipantsByType(ParticipantType.CLOSER).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Post Sale Section */}
        <div className="space-y-4">
          <div className="text-primary flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <h4 className="text-sm font-medium">Post Venta</h4>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="postSaleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Encargado Post Venta</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingParticipants || isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getParticipantsByType(ParticipantType.POST_SALE).map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </FormDialog>
  );
}
