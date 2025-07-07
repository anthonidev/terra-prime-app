'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';

import ClientLeadSelector from './ClientLeadSelector';
import LeadInfoCard from './LeadInfoCard';
import ClientConfiguration from './ClientConfiguration';
import GuarantorSection from './GuarantorSection';
import { useClientGuarantor } from '../../../hooks/useClientGuarantor';
import {
  CreateSaleFormData,
  GuarantorFormData,
  SecondaryClientFormData,
  Step3FormData,
  step3Schema
} from '../../../validations/saleValidation';
import AddGuarantorModal from '../../modals/AddGuarantorModal';
import SecondaryClientSection from './SecondaryClientSection';
import AddSecondaryClientModal from '../../modals/AddSecondaryClientModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, UserCheck, UserPlus } from 'lucide-react';

interface Props {
  formData: Partial<CreateSaleFormData>;
  updateFormData: (data: Partial<CreateSaleFormData>) => void;
  updateStepValidation: (step: 'step3', isValid: boolean) => void;
}

export default function Step3ClientGuarantor({
  formData,
  updateFormData,
  updateStepValidation
}: Props) {
  const [secondaryClientsFormData, setSecondaryClientsFormData] = useState<
    SecondaryClientFormData[]
  >([]);
  const [guarantorFormData, setGuarantorFormData] = useState<GuarantorFormData>();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddSecondaryClient = (data: SecondaryClientFormData) => {
    if (editingIndex !== null) {
      setSecondaryClientsFormData((prev) =>
        prev.map((client, index) => (index === editingIndex ? data : client))
      );
      setEditingIndex(null);
    } else setSecondaryClientsFormData((prev) => [...prev, data]);

    setModal({ ...modal, compradorModal: false });
  };

  const handleEditSecondaryClient = (index: number) => {
    setEditingIndex(index);
    setModal({ ...modal, compradorModal: true });
  };

  const handleEditGuarantor = () => {
    setModal({ ...modal, guarantorModal: true });
  };

  const handleDeleteSecondaryClient = (index: number) => {
    setSecondaryClientsFormData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteGuarantor = () => {
    setGuarantorFormData(undefined);
  };

  const handleAddGuarantor = (data: GuarantorFormData) => {
    setGuarantorFormData(data);
    setModal({ ...modal, guarantorModal: false });
  };

  const [modal, setModal] = useState<{
    guarantorModal: boolean;
    compradorModal: boolean;
  }>({
    guarantorModal: false,
    compradorModal: false
  });

  const [switchEnable, setSwitchEnable] = useState<{
    guarantorEnable: boolean;
    compradorEnable: boolean;
  }>({
    guarantorEnable: false,
    compradorEnable: false
  });

  const {
    leads,
    selectedLead,
    existingClient,
    guarantorData,
    secondaryClientsData,
    clientAddress,

    loading,

    loadLeads,
    handleLeadChange,
    handleAddressChange,
    handleGuarantorClientSuccess,

    getClientId,
    getGuarantorId,
    getSecondaryClientsId
  } = useClientGuarantor();

  const form = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      clientId: formData.clientId || 0,
      guarantorId: formData.guarantorId || 0,
      secondaryClientIds: formData.secondaryClientIds,
      leadId: '',
      clientAddress: ''
    }
  });

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // useEffect para validar cuando cambien los campos del formulario
  useEffect(() => {
    const subscription = form.watch(() => {
      const clientId = getClientId();
      const guarantorId = getGuarantorId();
      const secondaryClientIds = getSecondaryClientsId();
      const leadId = form.getValues('leadId');

      const basicValidation = !!(leadId && clientId > 0 && clientAddress);

      // Validar switches: solo bloquear si están activos Y no hay datos del backend
      const compradorBlocking =
        switchEnable.compradorEnable && (!secondaryClientIds || secondaryClientIds.length === 0);
      const guarantorBlocking = switchEnable.guarantorEnable && !guarantorId;
      const switchesBlocking = compradorBlocking || guarantorBlocking;

      const isValid = basicValidation && !switchesBlocking;

      updateStepValidation('step3', isValid);

      if (isValid) {
        updateFormData({
          clientId,
          guarantorId,
          secondaryClientIds
        });
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, clientAddress, switchEnable.compradorEnable, switchEnable.guarantorEnable]);

  // useEffect separado para cuando cambien solo los switches o se generen datos del backend
  useEffect(() => {
    const clientId = getClientId();
    const guarantorId = getGuarantorId();
    const secondaryClientIds = getSecondaryClientsId();
    const leadId = form.getValues('leadId');

    const basicValidation = !!(leadId && clientId > 0 && clientAddress);

    // Validar switches: solo bloquear si están activos Y no hay datos del backend
    const compradorBlocking =
      switchEnable.compradorEnable && (!secondaryClientIds || secondaryClientIds.length === 0);
    const guarantorBlocking = switchEnable.guarantorEnable && !guarantorId;
    const switchesBlocking = compradorBlocking || guarantorBlocking;

    const isValid = basicValidation && !switchesBlocking;

    updateStepValidation('step3', isValid);

    if (isValid) {
      updateFormData({
        clientId,
        guarantorId,
        secondaryClientIds
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    switchEnable.compradorEnable,
    switchEnable.guarantorEnable,
    guarantorData, // Escuchar cuando se genere un garante desde el backend
    secondaryClientsData // Escuchar cuando se generen clientes secundarios desde el backend
  ]);

  useEffect(() => {
    form.setValue('clientId', getClientId());
    form.setValue('guarantorId', getGuarantorId());
    form.setValue('secondaryClientIds', getSecondaryClientsId());
    form.setValue('clientAddress', clientAddress);
  }, [form, getClientId, getGuarantorId, getSecondaryClientsId, clientAddress]);

  const handleLeadSelection = async (leadId: string) => {
    form.setValue('leadId', leadId);
    await handleLeadChange(leadId);
  };

  const handleAction = async () => {
    await handleGuarantorClientSuccess(secondaryClientsFormData, guarantorFormData);
    setModal({ compradorModal: false, guarantorModal: false });
    setSwitchEnable({ compradorEnable: false, guarantorEnable: false });
  };

  const handleCloseModal = () => {
    setEditingIndex(null);
    setModal({ ...modal, compradorModal: false });
  };

  const getEditingData = () => {
    return editingIndex !== null ? secondaryClientsFormData[editingIndex] : undefined;
  };

  // Helper para mostrar estado de validación
  const getValidationStatus = () => {
    const basicValid = !!(form.watch('leadId') && getClientId() > 0 && clientAddress);
    const guarantorId = getGuarantorId();
    const secondaryClientIds = getSecondaryClientsId();

    // Switches bloquean solo si están activos Y no hay datos del backend
    const compradorBlocking =
      switchEnable.compradorEnable && (!secondaryClientIds || secondaryClientIds.length === 0);
    const guarantorBlocking = switchEnable.guarantorEnable && !guarantorId;
    const switchesBlocking = compradorBlocking || guarantorBlocking;

    return {
      basic: basicValid,
      compradorBlocking: compradorBlocking,
      guarantorBlocking: guarantorBlocking,
      switchesBlocking: switchesBlocking,
      overall: basicValid && !switchesBlocking
    };
  };

  const validationStatus = getValidationStatus();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Cliente y Garante
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selecciona el lead, configura el cliente y agrega un garante
        </p>

        {/* Indicador de estado de validación */}
        <div className="mt-4 rounded-lg border p-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Estado:</span>
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-1 ${validationStatus.basic ? 'text-green-600' : 'text-red-600'}`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${validationStatus.basic ? 'bg-green-500' : 'bg-red-500'}`}
                ></div>
                <span>Cliente</span>
              </div>
              {switchEnable.compradorEnable && (
                <div
                  className={`flex items-center gap-1 ${validationStatus.compradorBlocking ? 'text-orange-600' : 'text-green-600'}`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${validationStatus.compradorBlocking ? 'bg-orange-500' : 'bg-green-500'}`}
                  ></div>
                  <span>
                    Co-compradores{' '}
                    {validationStatus.compradorBlocking ? '(bloqueando)' : '(completado)'}
                  </span>
                </div>
              )}
              {switchEnable.guarantorEnable && (
                <div
                  className={`flex items-center gap-1 ${validationStatus.guarantorBlocking ? 'text-orange-600' : 'text-green-600'}`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${validationStatus.guarantorBlocking ? 'bg-orange-500' : 'bg-green-500'}`}
                  ></div>
                  <span>
                    Garante {validationStatus.guarantorBlocking ? '(bloqueando)' : '(completado)'}
                  </span>
                </div>
              )}
              <div
                className={`flex items-center gap-1 font-medium ${validationStatus.overall ? 'text-green-600' : 'text-red-600'}`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${validationStatus.overall ? 'bg-green-500' : 'bg-red-500'}`}
                ></div>
                <span>Step {validationStatus.overall ? 'Habilitado' : 'Deshabilitado'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <ClientLeadSelector
              control={form.control}
              errors={form.formState.errors}
              leads={leads}
              loading={loading.leads}
              onLeadChange={handleLeadSelection}
            />
            {selectedLead && <LeadInfoCard lead={selectedLead} />}
            {selectedLead && switchEnable.compradorEnable && (
              <div
                className={`rounded-md border p-4 ${validationStatus.compradorBlocking ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/10' : 'border-green-300 bg-green-50 dark:bg-green-900/10'}`}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-medium text-blue-500">Co-Compradores</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      validationStatus.compradorBlocking
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}
                  >
                    {validationStatus.compradorBlocking
                      ? 'Pendiente - Bloqueando Step'
                      : 'Completado - Step Habilitado'}
                  </span>
                </div>
                {secondaryClientsFormData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nº</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apellido</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {secondaryClientsFormData.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{item.firstName}</TableCell>
                          <TableCell>{item.lastName}</TableCell>
                          <TableCell>{item.document}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditSecondaryClient(i)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                              >
                                <Edit className="h-3 w-3" />
                                Editar
                              </Button>
                              <Button
                                onClick={() => handleDeleteSecondaryClient(i)}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                                Eliminar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div
                    className={`rounded-lg border border-dashed p-4 text-center ${
                      validationStatus.compradorBlocking
                        ? 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20'
                        : 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                    }`}
                  >
                    <Button
                      type="button"
                      onClick={() => setModal({ ...modal, compradorModal: true })}
                      disabled={loading.creating}
                      variant="ghost"
                      className="text-purple-500"
                    >
                      <UserPlus className="h-4 w-4" />
                      Agregar
                    </Button>
                    <p className="mt-2 text-sm text-gray-500">
                      {validationStatus.compradorBlocking
                        ? 'Switch activo - Genera co-compradores para habilitar step'
                        : 'Co-compradores generados exitosamente'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {validationStatus.compradorBlocking
                        ? 'Haz clic en "Validar Cliente" después de agregar'
                        : 'Step3 habilitado automáticamente'}
                    </p>
                  </div>
                )}
              </div>
            )}
            {selectedLead && switchEnable.guarantorEnable && (
              <div
                className={`rounded-md border p-4 ${validationStatus.guarantorBlocking ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/10' : 'border-green-300 bg-green-50 dark:bg-green-900/10'}`}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-medium text-green-500">Garante</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      validationStatus.guarantorBlocking
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}
                  >
                    {validationStatus.guarantorBlocking
                      ? 'Pendiente - Bloqueando Step'
                      : 'Completado - Step Habilitado'}
                  </span>
                </div>
                {guarantorFormData ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apellido</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{guarantorFormData.firstName}</TableCell>
                        <TableCell>{guarantorFormData.lastName}</TableCell>
                        <TableCell>{guarantorFormData.document}</TableCell>
                        <TableCell className="max-w-20 truncate">
                          {guarantorFormData.email}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleEditGuarantor}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              disabled={loading.creating}
                            >
                              <Edit className="h-3 w-3" />
                              Editar
                            </Button>
                            <Button
                              onClick={handleDeleteGuarantor}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 text-red-600 hover:text-red-700"
                              disabled={loading.creating}
                            >
                              <Trash2 className="h-3 w-3" />
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <div
                    className={`rounded-lg border border-dashed p-4 text-center ${
                      validationStatus.guarantorBlocking
                        ? 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20'
                        : 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                    }`}
                  >
                    <Button
                      type="button"
                      onClick={() => setModal({ ...modal, guarantorModal: true })}
                      variant="ghost"
                      className="text-purple-500"
                    >
                      <UserCheck className="h-4 w-4" />
                      Agregar
                    </Button>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {validationStatus.guarantorBlocking
                        ? 'Switch activo - Genera garante para habilitar step'
                        : 'Garante generado exitosamente'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {validationStatus.guarantorBlocking
                        ? 'Haz clic en "Validar Cliente" después de agregar'
                        : 'Step3 habilitado automáticamente'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {selectedLead && (
              <>
                <ClientConfiguration
                  control={form.control}
                  errors={form.formState.errors}
                  isLoadingClient={loading.client}
                  existingClient={existingClient}
                  clientAddress={clientAddress}
                  onAddressChange={handleAddressChange}
                />
                <SecondaryClientSection
                  secondaryClientsData={secondaryClientsData}
                  disabled={!clientAddress}
                  isCreating={loading.creating}
                  guarantorEnable={switchEnable.guarantorEnable}
                  compradorEnable={switchEnable.compradorEnable}
                  compradorSwitch={setSwitchEnable}
                />
                <GuarantorSection
                  guarantorData={guarantorData}
                  disabled={!clientAddress}
                  isCreating={loading.creating}
                  guarantorEnable={switchEnable.guarantorEnable}
                  compradorEnable={switchEnable.compradorEnable}
                  guarantorSwitch={setSwitchEnable}
                />
                <div className="pt-4">
                  <Button
                    onClick={handleAction}
                    disabled={
                      (!guarantorFormData && secondaryClientsFormData.length === 0) ||
                      loading.creating
                    }
                    variant="default"
                    className="w-full"
                  >
                    {loading.creating ? 'Validando...' : 'Validar Cliente'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Form>

      <AddSecondaryClientModal
        isOpen={modal.compradorModal}
        onClose={handleCloseModal}
        onSuccess={handleAddSecondaryClient}
        isCreating={loading.creating}
        editingData={getEditingData()}
        isEditing={editingIndex !== null}
      />
      <AddGuarantorModal
        isOpen={modal.guarantorModal}
        onClose={() => setModal({ ...modal, guarantorModal: false })}
        onSuccess={handleAddGuarantor}
        isCreating={loading.creating}
        editingData={guarantorFormData}
        isEditing={!!guarantorFormData}
      />
    </div>
  );
}
