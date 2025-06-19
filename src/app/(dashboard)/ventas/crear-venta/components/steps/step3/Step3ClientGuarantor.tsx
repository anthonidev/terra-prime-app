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

  const handleAddSecondaryClient = (data: SecondaryClientFormData) => {
    setSecondaryClientsFormData((prev) => [...prev, data]);
    setModal({ ...modal, compradorModal: false });
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

      const basicValidation = !!(
        value.leadId &&
        clientId > 0 &&
        secondaryClientIds.length > 0 &&
        clientAddress
      );
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

  const handleAction = async (guarantorFormData?: GuarantorFormData) => {
    try {
      await handleGuarantorClientSuccess(secondaryClientsFormData, guarantorFormData);
      setModal({ ...modal, guarantorModal: false });
    } catch (error) {
      console.error('Error al manejar el éxito del garante:', error);
    }
  };

  const handleGenerate = async () => {
    await await handleGuarantorClientSuccess(secondaryClientsFormData);
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Apellido</TableHead>
                      <TableHead>Documento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {secondaryClientsFormData.length > 0 ? (
                      secondaryClientsFormData.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{item.firstName}</TableCell>
                          <TableCell>{item.lastName}</TableCell>
                          <TableCell>{item.document}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4}>No hay registros guardados</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
                  isGenerated={secondaryClientsFormData.length > 0}
                  onGenerated={handleGenerate}
                  onAddSecondaryClient={() => setModal({ ...modal, compradorModal: true })}
                />
                <GuarantorSection
                  guarantorData={guarantorData}
                  disabled={!clientAddress}
                  isCreating={loading.creating}
                  onAddGuarantor={() => setModal({ ...modal, guarantorModal: true })}
                />
              </>
            )}
          </div>
        </div>
      </Form>

      <AddSecondaryClientModal
        isOpen={modal.compradorModal}
        onClose={() => setModal({ ...modal, compradorModal: false })}
        onSuccess={handleAddSecondaryClient}
        isCreating={loading.creating}
      />
      <AddGuarantorModal
        isOpen={modal.guarantorModal}
        onClose={() => setModal({ ...modal, guarantorModal: false })}
        onSuccess={handleAction}
        isCreating={loading.creating}
      />
    </div>
  );
}
