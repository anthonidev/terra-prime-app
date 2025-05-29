import {
  CreateUpdateLeadDto,
  DocumentType,
  FindLeadByDocumentDto,
  Lead,
  LeadSource,
  Ubigeo
} from '@/types/leads.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { leadFormSchema, LeadFormValues } from '../schema/leadform';

interface Props {
  lead: Lead | null;
  searchedDocument: FindLeadByDocumentDto | null;
  getDepartments: () => Ubigeo[];
  getProvinces: (departmentId: number) => Ubigeo[];
  getDistricts: (provinceId: number) => Ubigeo[];
  leadSources: LeadSource[];
  saveLead: (data: CreateUpdateLeadDto) => Promise<boolean>;
}

export function useLeadRegister({
  lead,
  searchedDocument,
  getDepartments,
  getProvinces,
  getDistricts,
  saveLead,
  leadSources
}: Props) {
  const [departments, setDepartments] = useState<Ubigeo[]>([]);
  const [provinces, setProvinces] = useState<Ubigeo[]>([]);
  const [districts, setDistricts] = useState<Ubigeo[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      firstName: lead?.firstName || '',
      lastName: lead?.lastName || '',
      document: lead?.document || searchedDocument?.document || '',
      documentType: lead?.documentType || searchedDocument?.documentType || DocumentType.DNI,
      email: lead?.email || '',
      phone: lead?.phone || '',
      phone2: lead?.phone2 || '',
      age: lead?.age ?? undefined,
      sourceId: lead?.source?.id ? String(lead.source.id) : '',
      departmentId: lead?.departmentId ? String(lead.departmentId) : '',
      provinceId: lead?.provinceId ? String(lead.provinceId) : '',
      ubigeoId: lead?.ubigeo?.id ?? undefined,
      observations: ''
    }
  });

  useEffect(() => {
    setDepartments(getDepartments());
  }, [getDepartments]);

  useEffect(() => {
    if (lead) {
      console.log('Setting form data for lead:', lead);

      const formValues: LeadFormValues = {
        firstName: lead.firstName,
        lastName: lead.lastName,
        document: lead.document,
        documentType: lead.documentType,
        email: lead.email || '',
        phone: lead.phone || '',
        phone2: lead.phone2 || '',
        age: typeof lead.age === 'number' ? lead.age : undefined,
        sourceId: lead.source?.id ? String(lead.source.id) : '',
        departmentId: lead.departmentId ? String(lead.departmentId) : '',
        provinceId: lead.provinceId ? String(lead.provinceId) : '',
        ubigeoId: lead.ubigeo?.id ?? undefined,
        observations: ''
      };

      form.reset(formValues);

      if (lead.departmentId) {
        const provincesForDept = getProvinces(lead.departmentId);
        setProvinces(provincesForDept);

        if (lead.provinceId) {
          const districtsForProv = getDistricts(lead.provinceId);
          setDistricts(districtsForProv);
        }
      }

      setIsInitialized(true);
    } else if (searchedDocument) {
      form.setValue('document', searchedDocument.document);
      form.setValue('documentType', searchedDocument.documentType);
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, [lead, searchedDocument, form, getProvinces, getDistricts]);

  const departmentId = form.watch('departmentId');
  useEffect(() => {
    if (!isInitialized) return;

    if (departmentId && departmentId !== (lead?.departmentId ? String(lead.departmentId) : '')) {
      const provincesForDept = getProvinces(Number(departmentId));
      setProvinces(provincesForDept);

      form.setValue('provinceId', '');
      form.setValue('ubigeoId', undefined);
      setDistricts([]);
    } else if (!departmentId) {
      setProvinces([]);
      setDistricts([]);
      form.setValue('provinceId', '');
      form.setValue('ubigeoId', undefined);
    }
  }, [departmentId, getProvinces, form, isInitialized, lead?.departmentId]);

  const provinceId = form.watch('provinceId');
  useEffect(() => {
    if (!isInitialized) return;

    console.log('Province ID changed (user selection):', provinceId);

    if (provinceId && provinceId !== (lead?.provinceId ? String(lead.provinceId) : '')) {
      console.log('Loading districts for user-selected province:', provinceId);
      const districtsForProv = getDistricts(Number(provinceId));
      setDistricts(districtsForProv);

      form.setValue('ubigeoId', undefined);
    } else if (!provinceId) {
      setDistricts([]);
      form.setValue('ubigeoId', undefined);
    }
  }, [provinceId, getDistricts, form, isInitialized, lead?.provinceId]);

  const handleSubmit = async (data: LeadFormValues) => {
    console.log('Form data before submission:', data);

    const leadData: CreateUpdateLeadDto = {
      firstName: data.firstName,
      lastName: data.lastName,
      document: data.document,
      documentType: data.documentType,
      email: data.email || undefined,
      phone: data.phone || undefined,
      phone2: data.phone2 || undefined,
      age: data.age ? (typeof data.age === 'string' ? Number(data.age) : data.age) : undefined,
      sourceId: data.sourceId || undefined,
      ubigeoId: data.ubigeoId
        ? typeof data.ubigeoId === 'string'
          ? Number(data.ubigeoId)
          : data.ubigeoId
        : undefined,
      observations: data.observations || undefined,
      isNewLead: !lead
    };

    console.log('Transformed lead data for submission:', leadData);
    await saveLead(leadData);
  };

  const documentTypeOptions = [
    { value: DocumentType.DNI, label: 'DNI' },
    { value: DocumentType.CE, label: 'CE' },
    { value: DocumentType.RUC, label: 'RUC' }
  ];

  const leadSourceOptions = leadSources.map((source) => ({
    value: String(source.id),
    label: source.name
  }));

  const departmentOptions = departments.map((dept) => ({
    value: String(dept.id),
    label: dept.name
  }));

  const provinceOptions = provinces.map((prov) => ({
    value: String(prov.id),
    label: prov.name
  }));

  const districtOptions = districts.map((dist) => ({
    value: String(dist.id),
    label: dist.name
  }));
  return {
    form,
    handleSubmit,
    documentTypeOptions,
    leadSourceOptions,
    departmentOptions,
    provinceOptions,
    departmentId,
    provinceId,
    districtOptions
  };
}
