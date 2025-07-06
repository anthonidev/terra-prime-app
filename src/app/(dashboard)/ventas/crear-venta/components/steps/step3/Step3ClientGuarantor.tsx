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
import { Edit, Trash2, UserCheck } from 'lucide-react';

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

  useEffect(() => {
    const subscription = form.watch((value) => {
      const clientId = getClientId();
      const guarantorId = getGuarantorId();
      const secondaryClientIds = getSecondaryClientsId();

      const basicValidation = !!(value.leadId && clientId > 0 && clientAddress);
      const isValid = basicValidation;

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
  }, [
    form,
    updateFormData,
    updateStepValidation,
    getClientId,
    getGuarantorId,
    getSecondaryClientsId,
    secondaryClientsFormData,
    clientAddress
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
  };

  const handleCloseModal = () => {
    setEditingIndex(null);
    setModal({ ...modal, compradorModal: false });
  };

  const getEditingData = () => {
    return editingIndex !== null ? secondaryClientsFormData[editingIndex] : undefined;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Cliente y Garante
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selecciona el lead, configura el cliente y agrega un garante
        </p>
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
            {selectedLead && (
              <div className="rounded-md border p-4">
                <h3 className="text-xs font-medium text-blue-500">Co-Compradores</h3>
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
                  <div className="rounded-lg border border-dashed bg-slate-100 p-4 text-center dark:bg-gray-900">
                    <UserCheck className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Aún no se han generado co-compradores
                    </p>
                  </div>
                )}
              </div>
            )}
            {selectedLead && (
              <div className="rounded-md border p-4">
                <h3 className="text-xs font-medium text-green-500">Garante</h3>
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
                  <div className="rounded-lg border border-dashed border-gray-300 bg-slate-100 p-4 text-center dark:border-gray-700 dark:bg-gray-900">
                    <UserCheck className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Aún no se ha generado un garante
                    </p>
                    <p className="text-xs text-gray-400">
                      Haz clic en Agregar Garante para continuar
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
                  onAddSecondaryClient={() => setModal({ ...modal, compradorModal: true })}
                />
                <GuarantorSection
                  guarantorData={guarantorData}
                  disabled={!clientAddress}
                  isCreating={loading.creating}
                  onAddGuarantor={() => setModal({ ...modal, guarantorModal: true })}
                  isEditing={!!guarantorFormData}
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
