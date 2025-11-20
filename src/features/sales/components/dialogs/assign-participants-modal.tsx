'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { useActiveParticipants } from '@/features/participants/hooks/use-active-participants';
import { ParticipantType } from '@/features/participants/types';
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

  const onSubmit = (data: AssignParticipantsFormData) => {
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

  const handleClose = () => {
    if (!isPending) {
      form.reset();
      onOpenChange(false);
    }
  };

  // Filter participants by type
  const getParticipantsByType = (type: ParticipantType) => {
    return participants?.filter((p) => p.participantType === type) || [];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Asignar Participantes
          </DialogTitle>
          <DialogDescription>
            Selecciona los participantes que deseas asignar a esta venta. Todos los campos son
            opcionales.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Liner */}
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

              {/* Telemarketing Supervisor */}
              <FormField
                control={form.control}
                name="telemarketingSupervisorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supervisor de Telemarketing</FormLabel>
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
                        {getParticipantsByType(ParticipantType.TELEMARKETING_SUPERVISOR).map(
                          (p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.firstName} {p.lastName}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Telemarketing Confirmer */}
              <FormField
                control={form.control}
                name="telemarketingConfirmerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmador de Telemarketing</FormLabel>
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

              {/* Telemarketer */}
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

              {/* Field Manager */}
              <FormField
                control={form.control}
                name="fieldManagerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gerente de Campo</FormLabel>
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

              {/* Field Supervisor */}
              <FormField
                control={form.control}
                name="fieldSupervisorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supervisor de Campo</FormLabel>
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

              {/* Field Seller */}
              <FormField
                control={form.control}
                name="fieldSellerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendedor de Campo</FormLabel>
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

              {/* Sales Manager */}
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

              {/* Sales General Manager */}
              <FormField
                control={form.control}
                name="salesGeneralManagerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gerente General de Ventas</FormLabel>
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

              {/* Post Sale */}
              <FormField
                control={form.control}
                name="postSaleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Venta</FormLabel>
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

              {/* Closer */}
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

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleClose} disabled={isPending}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending || isLoadingParticipants}>
                <Users className="mr-2 h-4 w-4" />
                {isPending ? 'Asignando...' : 'Asignar Participantes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
