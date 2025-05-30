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
  Step3FormData,
  step3Schema
} from '../../../validations/saleValidation';
import AddGuarantorModal from '../../modals/AddGuarantorModal';

interface Step3Props {
  formData: Partial<CreateSaleFormData>;
  updateFormData: (data: Partial<CreateSaleFormData>) => void;
  updateStepValidation: (step: 'step3', isValid: boolean) => void;
}

export default function Step3ClientGuarantor({
  formData,
  updateFormData,
  updateStepValidation
}: Step3Props) {
  const [showGuarantorModal, setShowGuarantorModal] = useState(false);

  const {
    leads,
    selectedLead,
    existingClient,
    guarantorData,
    clientAddress,

    // Loading states
    loading,

    // Actions
    loadLeads,
    handleLeadChange,
    handleAddressChange,
    handleGuarantorSuccess,

    // Getters
    getClientId,
    getGuarantorId
  } = useClientGuarantor();

  const form = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      clientId: formData.clientId || 0,
      guarantorId: formData.guarantorId || 0,
      leadId: '',
      clientAddress: ''
    }
  });

  // Cargar leads al montar el componente
  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Validar formulario cuando cambie
  useEffect(() => {
    const subscription = form.watch((value) => {
      const clientId = getClientId();
      const guarantorId = getGuarantorId();

      const isValid = !!(value.leadId && clientId > 0 && guarantorId > 0 && clientAddress);

      updateStepValidation('step3', isValid);

      if (isValid) {
        updateFormData({
          clientId,
          guarantorId
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, updateFormData, updateStepValidation, getClientId, getGuarantorId, clientAddress]);

  // Actualizar valores del formulario cuando cambien los datos
  useEffect(() => {
    form.setValue('clientId', getClientId());
    form.setValue('guarantorId', getGuarantorId());
    form.setValue('clientAddress', clientAddress);
  }, [form, getClientId, getGuarantorId, clientAddress]);

  const handleLeadSelection = async (leadId: string) => {
    form.setValue('leadId', leadId);
    await handleLeadChange(leadId);
  };

  const handleGuarantorModalSuccess = async (guarantorFormData: any) => {
    try {
      await handleGuarantorSuccess(guarantorFormData);
      setShowGuarantorModal(false);
    } catch (error) {
      // Error ya manejado en el hook
    }
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
          {/* Selección de Lead */}
          <div className="space-y-4">
            <ClientLeadSelector
              control={form.control}
              errors={form.formState.errors}
              leads={leads}
              loading={loading.leads}
              onLeadChange={handleLeadSelection}
            />

            {/* Información del Lead Seleccionado */}
            {selectedLead && <LeadInfoCard lead={selectedLead} />}
          </div>

          {/* Configuración de Cliente */}
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

                {/* Sección de Garante */}
                {clientAddress && (
                  <GuarantorSection
                    guarantorData={guarantorData}
                    isCreating={loading.creating}
                    onAddGuarantor={() => setShowGuarantorModal(true)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </Form>

      {/* Modal para agregar garante */}
      <AddGuarantorModal
        isOpen={showGuarantorModal}
        onClose={() => setShowGuarantorModal(false)}
        onSuccess={handleGuarantorModalSuccess}
        isCreating={loading.creating}
      />
    </div>
  );
}
