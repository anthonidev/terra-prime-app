// src/app/(dashboard)/leads/nuevo/components/NewLeadForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreateUpdateLeadDto,
  FindLeadByDocumentDto,
  Lead,
  LeadSource,
  Ubigeo
} from '@/types/leads.types';
import { motion } from 'framer-motion';
import { ArrowRight, Search, UserPlus } from 'lucide-react';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Progress Indicator */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    activeTab === 'search'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}
                >
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Buscar Lead</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Verificar si el lead ya existe
                  </p>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-gray-400" />

              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    activeTab === 'register'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                  }`}
                >
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {lead ? 'Actualizar Lead' : 'Registrar Lead'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {lead ? 'Modificar información existente' : 'Crear nuevo registro'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      {isLeadInOffice && lead && !viewingDetails ? (
        <motion.div variants={itemVariants}>
          <LeadInOfficeMessage lead={lead} onContinue={handleViewDetails} />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <div className="flex items-center justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1 dark:bg-gray-800">
                <TabsTrigger
                  value="search"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900"
                >
                  <Search className="h-4 w-4" />
                  Buscar
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-900"
                >
                  <UserPlus className="h-4 w-4" />
                  {lead ? 'Actualizar' : 'Registrar'}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="search" className="space-y-6">
              <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Buscar Lead Existente</CardTitle>
                      <CardDescription>
                        Ingresa el documento para verificar si el lead ya está registrado
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <LeadSearchForm
                    onSearch={async (data) => {
                      await handleFindLead(data);
                      handleSearchComplete();
                    }}
                    isSearching={isSearching}
                    searchError={searchError}
                    isLeadFound={isLeadFound}
                  />
                </CardContent>
              </Card>

              {!isSearching && !searchError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <Separator className="mb-6" />
                  <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    ¿No encontraste el lead? Puedes crear uno nuevo
                  </p>
                  <Button
                    onClick={() => setActiveTab('register')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 text-white shadow-sm hover:from-blue-700 hover:to-blue-800"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {isLeadFound ? 'Continuar con lead existente' : 'Crear nuevo lead'}
                  </Button>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <UserPlus className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {lead ? 'Actualizar Información del Lead' : 'Registrar Nuevo Lead'}
                      </CardTitle>
                      <CardDescription>
                        {lead
                          ? 'Modifica la información del lead existente'
                          : 'Completa la información para crear un nuevo lead'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
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
                    onCancelRegistration={
                      activeTab === 'register' ? () => setActiveTab('search') : undefined
                    }
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </motion.div>
  );
}
