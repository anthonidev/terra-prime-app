'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreateUpdateLeadDto,
  FindLeadByDocumentDto,
  Lead,
  LeadSource,
  Ubigeo
} from '@/types/leads.types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { createOrUpdateLead, findLeadByDocument } from '../action';
import LeadInOfficeMessage from './LeadInOfficeMessage';
import LeadRegistrationForm from './LeadRegistrationForm';
import LeadSearchForm from './LeadSearchForm';

interface NewLeadFormProps {
  leadSources: LeadSource[];
  ubigeos: Ubigeo[];
}

export default function NewLeadForm({ leadSources, ubigeos }: NewLeadFormProps) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLeadFound, setIsLeadFound] = useState<boolean>(false);
  const [isLeadInOffice, setIsLeadInOffice] = useState<boolean>(false);
  const [searchedDocument, setSearchedDocument] = useState<FindLeadByDocumentDto | null>(null);
  const [activeTab, setActiveTab] = useState<string>('search');
  const [viewingDetails, setViewingDetails] = useState<boolean>(false);

  const handleFindLead = async (findDto: FindLeadByDocumentDto) => {
    setIsSearching(true);
    setSearchError(null);
    setLead(null);
    setIsLeadFound(false);
    setIsLeadInOffice(false);
    setSearchedDocument(findDto);

    try {
      const response = await findLeadByDocument(findDto);

      if (response.success) {
        setLead(response.data);
        setIsLeadFound(true);
        setIsLeadInOffice(false);
        toast.success('Lead encontrado');
      } else {
        if (response.data) {
          setLead(response.data);
          setIsLeadFound(true);
          setIsLeadInOffice(true);
          toast.warning(response.message);
        } else {
          setIsLeadFound(false);
          toast.info(response.message || 'No se encontró el lead');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al buscar el lead';
      setSearchError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveLead = async (leadData: CreateUpdateLeadDto): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      console.log('Saving lead data:', leadData);
      const response = await createOrUpdateLead(leadData);

      if (response.success) {
        setLead(response.data);
        setIsLeadFound(true);
        setIsLeadInOffice(true);
        toast.success(response.message);

        // Redirect to leads list after success
        router.push('/leads');
        return true;
      } else {
        setSubmitError(response.message);
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el lead';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setLead(null);
    setIsLeadFound(false);
    setIsLeadInOffice(false);
    setSearchError(null);
    setSubmitError(null);
    setSearchedDocument(null);
    setViewingDetails(false);
  };

  const handleSearchComplete = () => {
    if (!isLeadInOffice) {
      setActiveTab('register');
    }
  };

  const handleViewDetails = () => {
    setViewingDetails(true);
    setActiveTab('register');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'search') {
      handleReset();
    }
  };

  const getDepartments = () => {
    return ubigeos.filter((u) => u.parentId === null);
  };

  const getProvinces = (departmentId: number) => {
    const department = ubigeos.find((u) => u.id === departmentId);
    return department?.children || [];
  };

  const getDistricts = (provinceId: number) => {
    const findProvinceAndGetChildren = (items: Ubigeo[]): Ubigeo[] => {
      for (const item of items) {
        if (item.id === provinceId) {
          return item.children || [];
        }
        if (item.children) {
          const found = findProvinceAndGetChildren(item.children);
          if (found.length > 0) {
            return found;
          }
        }
      }
      return [];
    };
    return findProvinceAndGetChildren(ubigeos);
  };

  return (
    <>
      <Separator className="mb-6" />

      {isLeadInOffice && lead && !viewingDetails ? (
        <LeadInOfficeMessage lead={lead} onContinue={handleViewDetails} />
      ) : (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="search">Buscar Lead</TabsTrigger>
            <TabsTrigger value="register">
              {lead ? 'Actualizar Lead' : 'Registrar Lead'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <LeadSearchForm
              onSearch={async (data) => {
                await handleFindLead(data);
                handleSearchComplete();
              }}
              isSearching={isSearching}
              searchError={searchError}
              isLeadFound={isLeadFound}
            />

            {!isSearching && !searchError && (
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => setActiveTab('register')}
                  className="bg-primary text-primary-foreground hover:bg-primary-hover"
                >
                  {isLeadFound ? 'Actualizar lead' : 'Crear nuevo lead'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="register">
            <LeadRegistrationForm
              lead={lead}
              searchedDocument={searchedDocument}
              leadSources={leadSources}
              isSubmitting={isSubmitting}
              submitError={submitError}
              saveLead={handleSaveLead}
              getDepartments={getDepartments}
              getProvinces={getProvinces}
              getDistricts={getDistricts}
              isReadOnly={isLeadInOffice && viewingDetails}
            />
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
