'use client';

import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Building, Layers, Square, MapPin } from 'lucide-react';
import { Control, FieldErrors } from 'react-hook-form';

import {
  ProyectsActivesItems,
  ProyectStagesItems,
  ProyectBlocksItems,
  ProyectLotsItems
} from '@/types/sales';
import { Step1FormData } from '../../../validations/saleValidation';

interface ProjectLocationSelectorProps {
  control: Control<Step1FormData>;
  errors: FieldErrors<Step1FormData>;

  // Data
  projects: ProyectsActivesItems[];
  stages: ProyectStagesItems[];
  blocks: ProyectBlocksItems[];
  lots: ProyectLotsItems[];

  // Selected items
  selectedProject: ProyectsActivesItems | null;
  selectedStage: ProyectStagesItems | null;
  selectedBlock: ProyectBlocksItems | null;

  // Loading states
  loading: {
    projects: boolean;
    stages: boolean;
    blocks: boolean;
    lots: boolean;
  };

  // Event handlers
  onProjectChange: (projectId: string) => void;
  onStageChange: (stageId: string) => void;
  onBlockChange: (blockId: string) => void;
  onLotChange: (lotId: string) => void;
}

export default function ProjectLocationSelector({
  control,
  errors,
  projects,
  stages,
  blocks,
  lots,
  selectedProject,
  selectedStage,
  selectedBlock,
  loading,
  onProjectChange,
  onStageChange,
  onBlockChange,
  onLotChange
}: ProjectLocationSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">Ubicación del Lote</h3>

      {/* Proyecto */}
      <FormField
        control={control}
        name="lotId"
        render={() => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Proyecto
            </FormLabel>
            <FormControl>
              <Select onValueChange={onProjectChange} disabled={loading.projects}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loading.projects ? 'Cargando proyectos...' : 'Selecciona un proyecto'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {project.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />

      {/* Etapa */}
      <FormField
        control={control}
        name="lotId"
        render={() => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Etapa
            </FormLabel>
            <FormControl>
              <Select onValueChange={onStageChange} disabled={!selectedProject || loading.stages}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !selectedProject
                        ? 'Primero selecciona un proyecto'
                        : loading.stages
                          ? 'Cargando etapas...'
                          : 'Selecciona una etapa'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        {stage.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />

      {/* Manzana */}
      <FormField
        control={control}
        name="lotId"
        render={() => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Square className="h-4 w-4" />
              Manzana
            </FormLabel>
            <FormControl>
              <Select onValueChange={onBlockChange} disabled={!selectedStage || loading.blocks}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !selectedStage
                        ? 'Primero selecciona una etapa'
                        : loading.blocks
                          ? 'Cargando manzanas...'
                          : 'Selecciona una manzana'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {blocks.map((block) => (
                    <SelectItem key={block.id} value={block.id}>
                      <div className="flex items-center gap-2">
                        <Square className="h-4 w-4" />
                        {block.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />

      {/* Lote */}
      <FormField
        control={control}
        name="lotId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Lote
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  onLotChange(value);
                }}
                disabled={!selectedBlock || loading.lots}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !selectedBlock
                        ? 'Primero selecciona una manzana'
                        : loading.lots
                          ? 'Cargando lotes...'
                          : 'Selecciona un lote'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {lots.map((lot) => (
                    <SelectItem key={lot.id} value={lot.id}>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {lot.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lot.area}m² - S/ {lot.lotPrice}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            {errors.lotId && <p className="text-sm text-red-500">{errors.lotId.message}</p>}
          </FormItem>
        )}
      />
    </div>
  );
}
