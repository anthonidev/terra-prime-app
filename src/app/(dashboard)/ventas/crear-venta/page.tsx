'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { Check, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Stepper } from '@/components/ui/stepper';
import { useStepper } from '@/hooks/stepper/useStepper';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import {
  LeadsVendorItems,
  ProyectBlocksItems,
  ProyectsActivesItems,
  ProyectStagesItems
} from '@/types/sales';
import { useLeadsVendor } from '../hooks/useLeadsVendor';
import { InformationStep } from '../components/InformationStep';
import { FinancingStep } from '../components/FinancingStep';
import { ClientStep } from '../components/ClientStep';
import { useClients } from '../hooks/useClients';
import { createSaleFinanceSchema, SaleFormData } from '@/lib/validations/sales';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const _steps = [{ id: 'step_01' }, { id: 'step_02' }, { id: 'step_03' }, { id: 'step_04' }];

export default function Page() {
  const form = useForm<SaleFormData>({
    resolver: zodResolver(createSaleFinanceSchema),
    defaultValues: {
      interestRate: 12,
      quantityHuCuotes: 1,
      quantitySaleCoutes: 1
    }
  });
  const { steps, currentStepId, nextStep, prevStep } = useStepper(_steps);

  const [selectedProject, setSelectedProject] = React.useState<ProyectsActivesItems | null>(null);
  const [selectedStage, setSelectedStage] = React.useState<ProyectStagesItems | null>(null);
  const [selectedBlock, setSelectedBlock] = React.useState<ProyectBlocksItems | null>(null);
  const [selectedLeadVendor, setSelectedLeadVendor] = React.useState<LeadsVendorItems | null>(null);

  const { data: leadsData } = useLeadsVendor();
  const { client, searchClient, createClientGuarantor } = useClients();

  React.useEffect(() => {
    if (selectedLeadVendor?.document) {
      searchClient(Number(selectedLeadVendor.document));
    }
  }, [selectedLeadVendor?.document, searchClient]);

  const stepContent = () => {
    switch (currentStepId) {
      case 'step_01':
        return (
          <InformationStep
            selectedProject={selectedProject}
            selectedStage={selectedStage}
            selectedBlock={selectedBlock}
            setSelectedProject={setSelectedProject}
            setSelectedStage={setSelectedStage}
            setSelectedBlock={setSelectedBlock}
            form={form}
          />
        );
      case 'step_02':
        return <FinancingStep form={form} />;
      case 'step_03':
        return (
          <ClientStep
            client={client}
            selectedLeadVendor={selectedLeadVendor}
            setSelectedLeadVendor={setSelectedLeadVendor}
            leadsData={leadsData}
            createClientGuarantor={createClientGuarantor}
            form={form}
          />
        );
      case 'step_04':
        return <p>Resumen del proyecto</p>;
      default:
        return null;
    }
  };

  return (
    <form className="container pt-8">
      <PageHeader
        icon={User}
        title="Crear Venta"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        variant="default"
      />
      <div className="container">
        <Stepper steps={steps} currentStepId={currentStepId} className="mb-4" />
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-900">
          {stepContent()}
          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              className="text-sm font-normal"
              variant="outline"
              onClick={prevStep}
              disabled={currentStepId === _steps[0].id}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            {currentStepId !== _steps[_steps.length - 1].id ? (
              <Button
                type="button"
                className="border border-blue-500 bg-blue-500 text-sm font-normal transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={nextStep}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 font-normal" />
              </Button>
            ) : (
              <Button className="bg-gradient-to-r from-[#025864] to-[#00CA7C] font-normal">
                Finalizar <Check className="" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
