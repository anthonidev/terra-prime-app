'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClientInfoForm } from '../../hooks/use-client-info-form';
import { LeadSelector } from './components/lead-selector';
import { ClientAddressInput } from './components/client-address-input';
import { GuarantorForm } from './components/guarantor-form';
import { SecondaryClientsForm } from './components/secondary-clients-form';
import type { Step4Data } from '../../types';

interface SalesStep4Props {
  data?: Step4Data;
  onNext: (data: Step4Data) => void;
  onBack: () => void;
}

export function SalesStep4({ data, onNext, onBack }: SalesStep4Props) {
  const {
    form,
    selectedLeadId,
    showGuarantor,
    showSecondaryClients,
    secondaryClientsCount,
    vendorLeads,
    isLoadingLeads,
    selectedLead,
    clientData,
    isLoadingClient,
    handleLeadSelect,
    handleAddGuarantor,
    handleRemoveGuarantor,
    handleAddSecondaryClient,
    handleRemoveSecondaryClient,
    handleSubmit,
    errors,
  } = useClientInfoForm({
    initialData: data,
    onSubmit: onNext,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Lead Selector */}
      <LeadSelector
        selectedLeadId={selectedLeadId}
        vendorLeads={vendorLeads}
        isLoadingLeads={isLoadingLeads}
        selectedLead={selectedLead}
        clientData={clientData}
        isLoadingClient={isLoadingClient}
        onLeadSelect={handleLeadSelect}
        error={errors.leadId?.message}
      />

      {/* Client Address Input */}
      <ClientAddressInput form={form} show={!!selectedLeadId} />

      {/* Guarantor Form */}
      <GuarantorForm
        form={form}
        showGuarantor={showGuarantor}
        onAdd={handleAddGuarantor}
        onRemove={handleRemoveGuarantor}
      />

      {/* Secondary Clients Form */}
      <SecondaryClientsForm
        form={form}
        showSecondaryClients={showSecondaryClients}
        secondaryClientsCount={secondaryClientsCount}
        onAdd={handleAddSecondaryClient}
        onRemove={handleRemoveSecondaryClient}
      />

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between pt-2"
      >
        <Button type="button" variant="outline" onClick={onBack} size="lg" className="min-w-32">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <Button type="submit" size="lg" className="min-w-32">
          Siguiente
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </form>
  );
}
