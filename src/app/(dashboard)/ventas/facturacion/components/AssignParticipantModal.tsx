'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SaleList } from '@domain/entities/sales/salevendor.entity';
import { Participant, ParticipantType } from '@domain/entities/sales/participant.entity';
import {
  getActiveParticipants,
  assignParticipantToSale
} from '@infrastructure/server-actions/participant.actions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Check, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssignParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: SaleList;
}

const PARTICIPANT_TYPE_LABELS = {
  [ParticipantType.LINER]: 'Liner',
  [ParticipantType.TELEMARKETING_SUPERVISOR]: 'Supervisor de Telemarketing',
  [ParticipantType.TELEMARKETING_CONFIRMER]: 'Supervisor Confirmador',
  [ParticipantType.TELEMARKETER]: 'Telemarketer',
  [ParticipantType.FIELD_MANAGER]: 'Jefe de Campo',
  [ParticipantType.FIELD_SUPERVISOR]: 'Supervisor de Campo',
  [ParticipantType.FIELD_SELLER]: 'Vendedor de Campo'
};

export default function AssignParticipantModal({
  isOpen,
  onClose,
  sale
}: AssignParticipantModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [assignedParticipants, setAssignedParticipants] = useState<ParticipantType[]>([]);
  const [currentAssignedParticipant, setCurrentAssignedParticipant] = useState<Participant | null>(
    null
  );

  const getCurrentAssignedParticipant = (type: ParticipantType): Participant | null => {
    switch (type) {
      case ParticipantType.LINER:
        return (sale.liner as Participant) || null;
      case ParticipantType.TELEMARKETING_SUPERVISOR:
        return (sale.telemarketingSupervisor as Participant) || null;
      case ParticipantType.TELEMARKETING_CONFIRMER:
        return (sale.telemarketingConfirmer as Participant) || null;
      case ParticipantType.TELEMARKETER:
        return (sale.telemarketer as Participant) || null;
      case ParticipantType.FIELD_MANAGER:
        return (sale.fieldManager as Participant) || null;
      case ParticipantType.FIELD_SUPERVISOR:
        return (sale.fieldSupervisor as Participant) || null;
      case ParticipantType.FIELD_SELLER:
        return (sale.fieldSeller as Participant) || null;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isOpen && sale) {
      const assigned: ParticipantType[] = [];

      if (sale.liner) assigned.push(ParticipantType.LINER);
      if (sale.telemarketingSupervisor) assigned.push(ParticipantType.TELEMARKETING_SUPERVISOR);
      if (sale.telemarketingConfirmer) assigned.push(ParticipantType.TELEMARKETING_CONFIRMER);
      if (sale.telemarketer) assigned.push(ParticipantType.TELEMARKETER);
      if (sale.fieldManager) assigned.push(ParticipantType.FIELD_MANAGER);
      if (sale.fieldSupervisor) assigned.push(ParticipantType.FIELD_SUPERVISOR);
      if (sale.fieldSeller) assigned.push(ParticipantType.FIELD_SELLER);

      setAssignedParticipants(assigned);
    }
  }, [isOpen, sale]);

  useEffect(() => {
    if (selectedType) {
      const currentParticipant = getCurrentAssignedParticipant(selectedType as ParticipantType);
      setCurrentAssignedParticipant(currentParticipant);
      loadActiveParticipants(selectedType);
      setSelectedParticipant('');
    } else {
      setAvailableParticipants([]);
      setSelectedParticipant('');
      setCurrentAssignedParticipant(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, sale]);

  const loadActiveParticipants = async (type: string) => {
    setIsLoading(true);
    try {
      const participants = await getActiveParticipants(type);
      setAvailableParticipants(participants);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar participantes');
      setAvailableParticipants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedParticipant) {
      toast.error('Debe seleccionar un participante');
      return;
    }

    if (currentAssignedParticipant && selectedParticipant === currentAssignedParticipant.id) {
      toast.info('El participante seleccionado ya está asignado');
      return;
    }

    setIsSubmitting(true);
    try {
      const assignmentData = {
        [getParticipantFieldName(selectedType as ParticipantType)]: selectedParticipant
      };
      await assignParticipantToSale(sale.id, assignmentData);
      toast.success('Participante asignado exitosamente');

      setSelectedType('');
      setSelectedParticipant('');
      setAvailableParticipants([]);

      router.refresh();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al asignar el participante');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getParticipantFieldName = (type: ParticipantType): string => {
    const fieldMapping = {
      [ParticipantType.LINER]: 'linerId',
      [ParticipantType.TELEMARKETING_SUPERVISOR]: 'telemarketingSupervisorId',
      [ParticipantType.TELEMARKETING_CONFIRMER]: 'telemarketingConfirmerId',
      [ParticipantType.TELEMARKETER]: 'telemarketerId',
      [ParticipantType.FIELD_MANAGER]: 'fieldManagerId',
      [ParticipantType.FIELD_SUPERVISOR]: 'fieldSupervisorId',
      [ParticipantType.FIELD_SELLER]: 'fieldSellerId'
    };

    return fieldMapping[type];
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedType('');
      setSelectedParticipant('');
      setAvailableParticipants([]);
      setIsLoading(false);
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedType('');
      setSelectedParticipant('');
      setAvailableParticipants([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  const availableParticipantTypes = Object.values(ParticipantType);
  const isReassigning = currentAssignedParticipant !== null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[70vh] max-w-2xl overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {isReassigning ? 'Cambiar Participante' : 'Asignar Participante'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-4">
          {assignedParticipants.length > 0 && (
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Ya asignados:
              </p>
              <div className="flex flex-wrap gap-1">
                {assignedParticipants.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {PARTICIPANT_TYPE_LABELS[type]}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {availableParticipantTypes.length > 0 ? (
            <>
              <div className="space-y-2">
                <Label>Tipo de Participante</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white dark:bg-gray-900">
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableParticipantTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {PARTICIPANT_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedType && currentAssignedParticipant && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-950/30">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      Participante actual asignado:
                    </p>
                  </div>
                  <Card className="border-orange-300 bg-white dark:bg-gray-900">
                    <CardContent className="px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                          <User className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {currentAssignedParticipant.firstName}&nbsp;
                            {currentAssignedParticipant.lastName}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Actual
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedType && (
                <div className="space-y-2">
                  <Label>
                    {isReassigning
                      ? 'Seleccione el nuevo participante'
                      : 'Seleccione un participante'}
                  </Label>

                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  ) : availableParticipants.length > 0 ? (
                    <div className="grid max-h-60 grid-cols-1 gap-3 sm:grid-cols-2">
                      {availableParticipants.map((participant) => {
                        const isCurrentlyAssigned =
                          currentAssignedParticipant?.id === participant.id;
                        const isSelected = selectedParticipant === participant.id;

                        return (
                          <Card
                            key={participant.id}
                            className={cn(
                              'cursor-pointer border transition-all hover:shadow-sm',
                              isSelected
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                                : isCurrentlyAssigned
                                  ? 'border-orange-300 bg-orange-50 dark:bg-orange-950/20'
                                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                            )}
                            onClick={() => setSelectedParticipant(participant.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex min-w-0 flex-1 items-center gap-2">
                                  <div
                                    className={cn(
                                      'flex h-8 w-8 items-center justify-center rounded-lg',
                                      isCurrentlyAssigned
                                        ? 'bg-orange-100 dark:bg-orange-900'
                                        : 'bg-gray-100 dark:bg-gray-800'
                                    )}
                                  >
                                    <User
                                      className={cn(
                                        'h-4 w-4',
                                        isCurrentlyAssigned
                                          ? 'text-orange-600'
                                          : 'text-gray-600 dark:text-gray-400'
                                      )}
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {participant.firstName} {participant.lastName}
                                    </p>
                                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                      {participant.documentType}: {participant.document}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {isCurrentlyAssigned && (
                                    <Badge variant="outline" className="text-xs">
                                      Actual
                                    </Badge>
                                  )}
                                  {isSelected && (
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                                      <Check className="h-3 w-3" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-gray-50 py-6 text-center dark:bg-gray-900">
                      <User className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500">No hay participantes disponibles</p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">
                Todos los tipos de participantes ya han sido asignados.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="sticky bottom-0 rounded-b-md bg-slate-50 pt-4 dark:bg-gray-800">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting || !selectedParticipant || availableParticipantTypes.length === 0
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isReassigning ? 'Cambiando...' : 'Asignando...'}
              </>
            ) : (
              <>
                {isReassigning ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Cambiar
                  </>
                ) : (
                  'Asignar'
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
