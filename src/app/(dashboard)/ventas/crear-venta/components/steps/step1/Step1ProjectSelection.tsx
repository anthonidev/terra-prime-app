'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { useProjectData } from '../../../hooks/useProjectData';
import {
  CreateSaleFormData,
  Step1FormData,
  step1Schema
} from '../../../validations/saleValidation';
import ProjectLocationSelector from './ProjectLocationSelector';
import SelectionSummary from './SelectionSummary';

interface Props {
  formData: Partial<CreateSaleFormData>;
  updateFormData: (data: Partial<CreateSaleFormData>) => void;
  updateStepValidation: (step: 'step1', isValid: boolean) => void;
}

const safeNumber = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null || value === '') return 0;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  return isNaN(num) ? 0 : num;
};

export default function Step1ProjectSelection({
  formData,
  updateFormData,
  updateStepValidation
}: Props) {
  const {
    projects,
    stages,
    blocks,
    lots,

    selected,
    loading,

    loadProjects,
    loadStages,
    loadBlocks,
    loadLots,

    selectProject,
    selectStage,
    selectBlock,
    selectLot
  } = useProjectData();

  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      isReservation: false,
      reservationAmount: undefined,
      maximumHoldPeriod: undefined,
      lotId: formData.lotId || '',
      saleType: formData.saleType || 'DIRECT_PAYMENT'
    }
  });

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      let isValid = !!(value.lotId && value.saleType);

      if (value.isReservation) {
        const reservationAmountValid = value.reservationAmount !== 0;
        const maximumHoldPeriodValid = value.maximumHoldPeriod !== 0;
        isValid = isValid && reservationAmountValid && maximumHoldPeriodValid;
      }

      updateStepValidation('step1', isValid);

      if (isValid)
        updateFormData({
          isReservation: value.isReservation,
          reservationAmount: value.reservationAmount,
          maximumHoldPeriod: value.maximumHoldPeriod,
          lotId: value.lotId,
          saleType: value.saleType as 'DIRECT_PAYMENT' | 'FINANCED'
        });
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleProjectChange = (projectId: string) => {
    selectProject(projectId);
    form.setValue('lotId', '');
    loadStages(projectId);
  };

  const handleStageChange = (stageId: string) => {
    selectStage(stageId);
    form.setValue('lotId', '');
    loadBlocks(stageId);
  };

  const handleBlockChange = (blockId: string) => {
    selectBlock(blockId);
    form.setValue('lotId', '');
    loadLots(blockId);
  };

  const handleLotChange = (lotId: string) => {
    selectLot(lotId);

    const foundLot = lots.find((lot) => lot.id === lotId);

    if (foundLot) {
      const lotPrice = safeNumber(foundLot.lotPrice);
      const urbanizationPrice = safeNumber(foundLot.urbanizationPrice);

      updateFormData({
        totalAmount: lotPrice,
        totalAmountUrbanDevelopment: urbanizationPrice
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Selección de Proyecto y Lote
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selecciona el proyecto, etapa, manzana y lote para la venta
        </p>
      </div>

      <Form {...form}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProjectLocationSelector
            control={form.control}
            errors={form.formState.errors}
            projects={projects}
            stages={stages}
            blocks={blocks}
            lots={lots}
            selectedProject={selected.project}
            selectedStage={selected.stage}
            selectedBlock={selected.block}
            loading={loading}
            onProjectChange={handleProjectChange}
            onStageChange={handleStageChange}
            onBlockChange={handleBlockChange}
            onLotChange={handleLotChange}
            isReservation={form.getValues('isReservation')}
            maximumHoldPeriod={form.getValues('maximumHoldPeriod') ?? 0}
          />
          <SelectionSummary
            selectedProject={selected.project}
            selectedStage={selected.stage}
            selectedBlock={selected.block}
            selectedLot={selected.lot}
            saleType={form.watch('saleType')}
          />
        </div>
      </Form>
    </div>
  );
}
