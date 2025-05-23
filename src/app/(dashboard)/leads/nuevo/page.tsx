'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import LeadInOfficeMessage from './components/LeadInOfficeMessage';
import LeadSearchForm from './components/LeadSearchForm';
import LeadRegistrationForm from './components/LeadRegistrationForm';
import { useLeadManagement } from '../hooks/UseLeadManagementReturn';
export default function NewLeadPage() {
  const {
    lead,
    leadSources,
    isSearching,
    isSubmitting,
    searchError,
    submitError,
    isLeadFound,
    searchedDocument,
    isLeadInOffice,
    findLead,
    saveLead,
    reset,
    getDepartments,
    getProvinces,
    getDistricts
  } = useLeadManagement();
  const [activeTab, setActiveTab] = useState<string>('search');
  const [viewingDetails, setViewingDetails] = useState<boolean>(false);
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
      reset();
      setViewingDetails(false);
    }
  };
  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/leads">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground mb-2 gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Volver a Leads</span>
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Lead</h1>
          <p className="text-muted-foreground">Registra un nuevo lead o actualiza uno existente</p>
        </div>
      </div>
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
                await findLead(data);
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
              saveLead={saveLead}
              getDepartments={getDepartments}
              getProvinces={getProvinces}
              getDistricts={getDistricts}
              isReadOnly={isLeadInOffice && viewingDetails}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
