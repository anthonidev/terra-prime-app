'use client';

import { useState } from 'react';
import type { DocumentType, Lead, LeadMetadata } from '../types';

export interface LeadFormData {
  // Step 1
  documentType: DocumentType;
  document: string;

  // Step 2
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phone2: string;
  age: string;

  // Step 3
  sourceId: string;
  departmentId: string;
  provinceId: string;
  districtId: string;
  interestProjects: string[];
  hasCompanion: boolean;
  companionFullName: string;
  companionDni: string;
  companionRelationship: string;

  // Metadata
  estadoCivil: string;
  tieneTarjetasCredito: boolean;
  cantidadTarjetasCredito: string;
  tieneTarjetasDebito: boolean;
  cantidadTarjetasDebito: string;
  cantidadHijos: string;
  ocupacion: string;
  ingresoPromedioFamiliar: string;

  // Step 4
  observations: string;
}

const initialFormData: LeadFormData = {
  documentType: 'DNI',
  document: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  phone2: '',
  age: '',
  sourceId: '',
  departmentId: '',
  provinceId: '',
  districtId: '',
  interestProjects: [],
  hasCompanion: false,
  companionFullName: '',
  companionDni: '',
  companionRelationship: '',
  estadoCivil: '',
  tieneTarjetasCredito: false,
  cantidadTarjetasCredito: '',
  tieneTarjetasDebito: false,
  cantidadTarjetasDebito: '',
  cantidadHijos: '',
  ocupacion: '',
  ingresoPromedioFamiliar: '',
  observations: '',
};

export function useLeadFormState() {
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = (updates: Partial<LeadFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const prefillFromExistingLead = (lead: Lead) => {
    setFormData({
      documentType: lead.documentType,
      document: lead.document,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email || '',
      phone: lead.phone || '',
      phone2: lead.phone2 || '',
      age: lead.age?.toString() || '',
      sourceId: lead.source?.id?.toString() || '',
      departmentId: lead.departmentId?.toString() || '',
      provinceId: lead.provinceId?.toString() || '',
      districtId: lead.ubigeo?.id?.toString() || '',
      interestProjects: lead.interestProjects || [],
      hasCompanion: !!lead.companionFullName,
      companionFullName: lead.companionFullName || '',
      companionDni: lead.companionDni || '',
      companionRelationship: lead.companionRelationship || '',
      estadoCivil: lead.metadata?.estadoCivil || '',
      tieneTarjetasCredito: lead.metadata?.tieneTarjetasCredito || false,
      cantidadTarjetasCredito: lead.metadata?.cantidadTarjetasCredito?.toString() || '',
      tieneTarjetasDebito: lead.metadata?.tieneTarjetasDebito || false,
      cantidadTarjetasDebito: lead.metadata?.cantidadTarjetasDebito?.toString() || '',
      cantidadHijos: lead.metadata?.cantidadHijos?.toString() || '',
      ocupacion: lead.metadata?.ocupacion || '',
      ingresoPromedioFamiliar: lead.metadata?.ingresoPromedioFamiliar?.toString() || '',
      observations: '',
    });
  };

  const buildMetadata = (): LeadMetadata => {
    const metadata: LeadMetadata = {};

    if (formData.estadoCivil) metadata.estadoCivil = formData.estadoCivil;
    if (formData.tieneTarjetasCredito) {
      metadata.tieneTarjetasCredito = true;
      if (formData.cantidadTarjetasCredito) {
        metadata.cantidadTarjetasCredito = parseInt(formData.cantidadTarjetasCredito);
      }
    }
    if (formData.tieneTarjetasDebito) {
      metadata.tieneTarjetasDebito = true;
      if (formData.cantidadTarjetasDebito) {
        metadata.cantidadTarjetasDebito = parseInt(formData.cantidadTarjetasDebito);
      }
    }
    if (formData.cantidadHijos) {
      metadata.cantidadHijos = parseInt(formData.cantidadHijos);
    }
    if (formData.ocupacion) metadata.ocupacion = formData.ocupacion;
    if (formData.ingresoPromedioFamiliar) {
      metadata.ingresoPromedioFamiliar = parseFloat(formData.ingresoPromedioFamiliar);
    }

    return metadata;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  return {
    formData,
    currentStep,
    updateFormData,
    setCurrentStep,
    prefillFromExistingLead,
    buildMetadata,
    resetForm,
  };
}
