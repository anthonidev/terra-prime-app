'use client';

import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step4Schema, type Step4FormData } from '../lib/validation';
import { useVendorLeads } from '@/features/leads/hooks/use-vendor-leads';
import { useClientByDocument } from './use-client-by-document';
import type { Step4Data } from '../types';

interface UseClientInfoFormProps {
  initialData?: Step4Data;
  onSubmit: (data: Step4Data) => void;
}

export function useClientInfoForm({ initialData, onSubmit }: UseClientInfoFormProps) {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(initialData?.leadId || '');
  const [showGuarantor, setShowGuarantor] = useState<boolean>(!!initialData?.guarantor);
  const [showSecondaryClients, setShowSecondaryClients] = useState<boolean>(
    !!initialData?.secondaryClients && initialData.secondaryClients.length > 0
  );
  const [secondaryClientsCount, setSecondaryClientsCount] = useState<number>(
    initialData?.secondaryClients?.length || 0
  );

  const { data: vendorLeads, isLoading: isLoadingLeads } = useVendorLeads();

  // Find selected lead to get document for client lookup
  const selectedLead = vendorLeads?.find((lead) => lead.id === selectedLeadId);
  const { data: clientData, isLoading: isLoadingClient } = useClientByDocument(
    selectedLead?.document || ''
  );

  const form = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      leadId: initialData?.leadId || '',
      clientAddress: initialData?.clientAddress || '',
      guarantor: initialData?.guarantor,
      secondaryClients: initialData?.secondaryClients || [],
    },
  });

  // Lead selection handler
  const handleLeadSelect = (leadId: string) => {
    setSelectedLeadId(leadId);
    form.setValue('leadId', leadId);
  };

  // Auto-fill client address when client data is loaded
  useEffect(() => {
    if (clientData?.address) {
      form.setValue('clientAddress', clientData.address);
    }
  }, [clientData?.address, form]);

  // Guarantor handlers
  const handleAddGuarantor = () => {
    setShowGuarantor(true);
  };

  const handleRemoveGuarantor = () => {
    setShowGuarantor(false);
    form.setValue('guarantor', undefined);
  };

  // Secondary clients handlers
  const handleAddSecondaryClient = () => {
    setShowSecondaryClients(true);
    setSecondaryClientsCount((prev) => prev + 1);
  };

  const handleRemoveSecondaryClient = (index: number) => {
    const currentClients = form.getValues('secondaryClients') || [];
    const newClients = currentClients.filter((_, i) => i !== index);
    form.setValue('secondaryClients', newClients);
    setSecondaryClientsCount(newClients.length);
    if (newClients.length === 0) {
      setShowSecondaryClients(false);
    }
  };

  const handleSubmit = (formData: Step4FormData) => {
    const stepData: Step4Data = {
      leadId: formData.leadId,
      leadName: selectedLead ? `${selectedLead.firstName} ${selectedLead.lastName}` : undefined,
      leadDocument: selectedLead?.document,
      clientId: clientData?.id ? Number(clientData.id) : undefined,
      clientAddress: formData.clientAddress,
      guarantor: showGuarantor ? formData.guarantor : undefined,
      secondaryClients: showSecondaryClients ? formData.secondaryClients : undefined,
    };
    onSubmit(stepData);
  };

  return {
    // Form
    form: form as UseFormReturn<Step4FormData>,

    // State
    selectedLeadId,
    showGuarantor,
    showSecondaryClients,
    secondaryClientsCount,

    // Data
    vendorLeads,
    isLoadingLeads,
    selectedLead,
    clientData,
    isLoadingClient,

    // Handlers
    handleLeadSelect,
    handleAddGuarantor,
    handleRemoveGuarantor,
    handleAddSecondaryClient,
    handleRemoveSecondaryClient,
    handleSubmit: form.handleSubmit(handleSubmit),

    // Form state
    errors: form.formState.errors,
  };
}
