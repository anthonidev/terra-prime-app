'use client';

import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveLeadSources, useUbigeos, useActiveProjectsForLead } from '../hooks/use-lead-form-data';
import { useRegisterLead } from '../hooks/use-register-lead';
import { useLeadFormState } from '../hooks/use-lead-form-state';
import { useLeadSearch } from '../hooks/use-lead-search';
import { useUbigeoHierarchy } from '../hooks/use-ubigeo-hierarchy';
import { LeadFormStepper } from './lead-form-stepper';
import { DocumentVerificationStep } from './document-verification-step';
import { PersonalInfoStep } from './personal-info-step';
import { AdditionalInfoStep } from './additional-info-step';
import { SummaryStep } from './summary-step';
import { LeadInOfficeDialog } from './lead-in-office-dialog';
import { ExistingLeadDialog } from './existing-lead-dialog';
import type { Lead } from '../types';

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

  const { departments, getProvinces, getDistricts, findHierarchyFromDistrict } =
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
  }, [formData.departmentId]);

  useEffect(() => {
    if (formData.provinceId) {
      updateFormData({ districtId: '' });
    }
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

  const handleProjectToggle = (projectId: string) => {
    const current = formData.interestProjects;
    const updated = current.includes(projectId)
      ? current.filter((id) => id !== projectId)
      : [...current, projectId];
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Registrar Nuevo Lead</h1>
        <p className="text-muted-foreground mt-2">
          Complete el formulario para registrar un nuevo lead en el sistema.
        </p>
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
          projects={projects}
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
