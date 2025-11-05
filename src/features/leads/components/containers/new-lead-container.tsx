'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { UserPlus } from 'lucide-react';

import { useActiveLeadSources, useActiveProjectsForLead, useUbigeos } from '../../hooks/use-lead-form-data';
import { useLeadFormState } from '../../hooks/use-lead-form-state';
import { useLeadSearch } from '../../hooks/use-lead-search';
import { useRegisterLead } from '../../hooks/use-register-lead';
import { useUbigeoHierarchy } from '../../hooks/use-ubigeo-hierarchy';
import type { Lead } from '../../types';
import { ExistingLeadDialog } from '../dialogs/existing-lead-dialog';
import { LeadInOfficeDialog } from '../dialogs/lead-in-office-dialog';
import { AdditionalInfoStep } from '../steps/additional-info-step';
import { DocumentVerificationStep } from '../steps/document-verification-step';
import { LeadFormStepper } from '../steps/lead-form-stepper';
import { PersonalInfoStep } from '../steps/personal-info-step';
import { SummaryStep } from '../steps/summary-step';

export function NewLeadContainer() {
  const router = useRouter();

  // Data queries
  const { data: sources } = useActiveLeadSources();
  const { data: ubigeos } = useUbigeos();
  const { data: projects } = useActiveProjectsForLead();
  const { mutate: registerLead, isPending: isRegistering } = useRegisterLead();

  // Custom hooks
  const {
    formData,
    currentStep,
    updateFormData,
    setCurrentStep,
    prefillFromExistingLead,
    buildMetadata,
    resetForm,
  } = useLeadFormState();

  const {
    existingLead,
    showInOfficeDialog,
    showExistingLeadDialog,
    isSearching,
    searchLead,
    handleAcceptExistingLead,
    handleCancelExistingLead,
    closeInOfficeDialog,
  } = useLeadSearch({
    onLeadNotFound: () => setCurrentStep(2),
    onAcceptExistingLead: (lead: Lead) => {
      prefillFromExistingLead(lead);
      setCurrentStep(2);
    },
  });

  const { departments, getProvinces, getDistricts, } =
    useUbigeoHierarchy(ubigeos);

  // Ubigeo computed values
  const provinces = useMemo(
    () => (formData.departmentId ? getProvinces(Number(formData.departmentId)) : []),
    [formData.departmentId, getProvinces]
  );

  const districts = useMemo(
    () => (formData.provinceId ? getDistricts(Number(formData.provinceId)) : []),
    [formData.provinceId, getDistricts]
  );

  // Reset dependent fields when parent changes
  useEffect(() => {
    if (formData.departmentId) {
      updateFormData({ provinceId: '', districtId: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.departmentId]);

  useEffect(() => {
    if (formData.provinceId) {
      updateFormData({ districtId: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.provinceId]);

  // Get names for summary
  const departmentName =
    departments.find((d) => d.id === Number(formData.departmentId))?.name || '-';
  const provinceName = provinces.find((p) => p.id === Number(formData.provinceId))?.name || '-';
  const districtName = districts.find((d) => d.id === Number(formData.districtId))?.name || '-';

  // Handlers
  const handleDocumentSearch = () => {
    searchLead(formData.documentType, formData.document);
  };

  const handleProjectToggle = (projectName: string) => {
    const current = formData.interestProjects;
    const updated = current.includes(projectName)
      ? current.filter((name) => name !== projectName)
      : [...current, projectName];
    updateFormData({ interestProjects: updated });
  };

  const handleFieldChange = (field: string, value: string | boolean) => {
    updateFormData({ [field]: value });
  };

  const handleSubmit = () => {
    const payload = {
      documentType: formData.documentType,
      document: formData.document,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email || undefined,
      phone: formData.phone,
      phone2: formData.phone2 || undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
      sourceId: parseInt(formData.sourceId),
      ubigeoId: parseInt(formData.districtId),
      interestProjects: formData.interestProjects.length > 0 ? formData.interestProjects : undefined,
      companionFullName: formData.hasCompanion ? formData.companionFullName : undefined,
      companionDni: formData.hasCompanion ? formData.companionDni : undefined,
      companionRelationship: formData.hasCompanion ? formData.companionRelationship : undefined,
      metadata: buildMetadata(),
      observations: formData.observations || undefined,
    };

    registerLead(payload, {
      onSuccess: (response) => {
        if (response.success) {
          resetForm();
          router.push('/leads');
        }
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <UserPlus className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registrar Nuevo Lead</h1>
          <p className="text-sm text-muted-foreground">
            Complete el formulario para registrar un nuevo lead en el sistema
          </p>
        </div>
      </div>

      <LeadFormStepper currentStep={currentStep} />

      {currentStep === 1 && (
        <DocumentVerificationStep
          documentType={formData.documentType}
          document={formData.document}
          isSearching={isSearching}
          onDocumentTypeChange={(value) => updateFormData({ documentType: value })}
          onDocumentChange={(value) => updateFormData({ document: value })}
          onSearch={handleDocumentSearch}
        />
      )}

      {currentStep === 2 && (
        <PersonalInfoStep
          firstName={formData.firstName}
          lastName={formData.lastName}
          email={formData.email}
          phone={formData.phone}
          phone2={formData.phone2}
          age={formData.age}
          onFieldChange={handleFieldChange}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <AdditionalInfoStep
          sourceId={formData.sourceId}
          sources={sources}
          onSourceChange={(value) => updateFormData({ sourceId: value })}
          departmentId={formData.departmentId}
          provinceId={formData.provinceId}
          districtId={formData.districtId}
          departments={departments}
          provinces={provinces}
          districts={districts}
          onDepartmentChange={(value) => updateFormData({ departmentId: value })}
          onProvinceChange={(value) => updateFormData({ provinceId: value })}
          onDistrictChange={(value) => updateFormData({ districtId: value })}
          interestProjects={formData.interestProjects}
          projects={projects}
          onProjectToggle={handleProjectToggle}
          hasCompanion={formData.hasCompanion}
          companionFullName={formData.companionFullName}
          companionDni={formData.companionDni}
          companionRelationship={formData.companionRelationship}
          onCompanionToggle={(checked) => updateFormData({ hasCompanion: checked })}
          onFieldChange={handleFieldChange}
          estadoCivil={formData.estadoCivil}
          tieneTarjetasCredito={formData.tieneTarjetasCredito}
          cantidadTarjetasCredito={formData.cantidadTarjetasCredito}
          tieneTarjetasDebito={formData.tieneTarjetasDebito}
          cantidadTarjetasDebito={formData.cantidadTarjetasDebito}
          cantidadHijos={formData.cantidadHijos}
          ocupacion={formData.ocupacion}
          onNext={() => setCurrentStep(4)}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <SummaryStep
          documentType={formData.documentType}
          document={formData.document}
          firstName={formData.firstName}
          lastName={formData.lastName}
          email={formData.email}
          phone={formData.phone}
          phone2={formData.phone2}
          age={formData.age}
          sourceId={formData.sourceId}
          sources={sources}
          departmentName={departmentName}
          provinceName={provinceName}
          districtName={districtName}
          interestProjects={formData.interestProjects}
          hasCompanion={formData.hasCompanion}
          companionFullName={formData.companionFullName}
          companionDni={formData.companionDni}
          companionRelationship={formData.companionRelationship}
          estadoCivil={formData.estadoCivil}
          tieneTarjetasCredito={formData.tieneTarjetasCredito}
          cantidadTarjetasCredito={formData.cantidadTarjetasCredito}
          tieneTarjetasDebito={formData.tieneTarjetasDebito}
          cantidadTarjetasDebito={formData.cantidadTarjetasDebito}
          cantidadHijos={formData.cantidadHijos}
          ocupacion={formData.ocupacion}
          observations={formData.observations}
          onObservationsChange={(value) => updateFormData({ observations: value })}
          onSubmit={handleSubmit}
          onBack={() => setCurrentStep(3)}
          isSubmitting={isRegistering}
        />
      )}

      {/* Dialogs */}
      <LeadInOfficeDialog
        open={showInOfficeDialog}
        leadName={existingLead ? `${existingLead.firstName} ${existingLead.lastName}` : ''}
        onClose={closeInOfficeDialog}
      />

      <ExistingLeadDialog
        open={showExistingLeadDialog}
        leadName={existingLead ? `${existingLead.firstName} ${existingLead.lastName}` : ''}
        onAccept={handleAcceptExistingLead}
        onCancel={handleCancelExistingLead}
      />
    </div>
  );
}
