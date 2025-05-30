'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Square, Layers, CreditCard } from 'lucide-react';

import { step1Schema, Step1FormData } from '../../validations/saleValidation';
import { CreateSaleFormData } from '../../validations/saleValidation';
import {
  getProyectsActives,
  getProyectStages,
  getProyectBlocks,
  getProyectLots
} from '../../action';
import {
  ProyectsActivesItems,
  ProyectStagesItems,
  ProyectBlocksItems,
  ProyectLotsItems
} from '@/types/sales';

interface Step1Props {
  formData: Partial<CreateSaleFormData>;
  updateFormData: (data: Partial<CreateSaleFormData>) => void;
  updateStepValidation: (step: 'step1', isValid: boolean) => void;
}

export default function Step1ProjectSelection({
  formData,
  updateFormData,
  updateStepValidation
}: Step1Props) {
  const [projects, setProjects] = useState<ProyectsActivesItems[]>([]);
  const [stages, setStages] = useState<ProyectStagesItems[]>([]);
  const [blocks, setBlocks] = useState<ProyectBlocksItems[]>([]);
  const [lots, setLots] = useState<ProyectLotsItems[]>([]);

  const [selectedProject, setSelectedProject] = useState<ProyectsActivesItems | null>(null);
  const [selectedStage, setSelectedStage] = useState<ProyectStagesItems | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<ProyectBlocksItems | null>(null);
  const [selectedLot, setSelectedLot] = useState<ProyectLotsItems | null>(null);

  const [loading, setLoading] = useState({
    projects: false,
    stages: false,
    blocks: false,
    lots: false
  });

  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      lotId: formData.lotId || '',
      saleType: formData.saleType || 'DIRECT_PAYMENT'
    }
  });

  // Cargar proyectos al montar el componente
  useEffect(() => {
    loadProjects();
  }, []);

  // Validar formulario cuando cambie
  useEffect(() => {
    const subscription = form.watch((value) => {
      const isValid = value.lotId && value.saleType;
      updateStepValidation('step1', !!isValid);

      if (isValid) {
        updateFormData({
          lotId: value.lotId,
          saleType: value.saleType as 'DIRECT_PAYMENT' | 'FINANCED'
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, updateFormData, updateStepValidation]);

  const loadProjects = async () => {
    setLoading((prev) => ({ ...prev, projects: true }));
    try {
      const projectsData = await getProyectsActives();
      setProjects(projectsData);
    } catch (error) {
      toast.error('Error al cargar los proyectos');
      console.error('Error loading projects:', error);
    } finally {
      setLoading((prev) => ({ ...prev, projects: false }));
    }
  };

  const loadStages = async (projectId: string) => {
    setLoading((prev) => ({ ...prev, stages: true }));
    setStages([]);
    setBlocks([]);
    setLots([]);
    setSelectedStage(null);
    setSelectedBlock(null);
    setSelectedLot(null);

    try {
      const stagesData = await getProyectStages({ id: projectId });
      setStages(stagesData);
    } catch (error) {
      toast.error('Error al cargar las etapas');
      console.error('Error loading stages:', error);
    } finally {
      setLoading((prev) => ({ ...prev, stages: false }));
    }
  };

  const loadBlocks = async (stageId: string) => {
    setLoading((prev) => ({ ...prev, blocks: true }));
    setBlocks([]);
    setLots([]);
    setSelectedBlock(null);
    setSelectedLot(null);

    try {
      const blocksData = await getProyectBlocks({ id: stageId });
      setBlocks(blocksData);
    } catch (error) {
      toast.error('Error al cargar las manzanas');
      console.error('Error loading blocks:', error);
    } finally {
      setLoading((prev) => ({ ...prev, blocks: false }));
    }
  };

  const loadLots = async (blockId: string) => {
    setLoading((prev) => ({ ...prev, lots: true }));
    setLots([]);
    setSelectedLot(null);

    try {
      const lotsData = await getProyectLots({ id: blockId });
      setLots(lotsData);
    } catch (error) {
      toast.error('Error al cargar los lotes');
      console.error('Error loading lots:', error);
    } finally {
      setLoading((prev) => ({ ...prev, lots: false }));
    }
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    setSelectedProject(project || null);
    form.setValue('lotId', '');
    loadStages(projectId);
  };

  const handleStageChange = (stageId: string) => {
    const stage = stages.find((s) => s.id === stageId);
    setSelectedStage(stage || null);
    form.setValue('lotId', '');
    loadBlocks(stageId);
  };

  const handleBlockChange = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    setSelectedBlock(block || null);
    form.setValue('lotId', '');
    loadLots(blockId);
  };

  const handleLotChange = (lotId: string) => {
    const lot = lots.find((l) => l.id === lotId);
    setSelectedLot(lot || null);
    form.setValue('lotId', lotId);

    // Actualizar datos del lote en el formulario general
    if (lot) {
      updateFormData({
        totalAmount: parseFloat(lot.lotPrice),
        totalAmountUrbanDevelopment: parseFloat(lot.urbanizationPrice)
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
          {/* Selección de ubicación */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
              Ubicación del Lote
            </h3>

            {/* Proyecto */}
            <FormField
              control={form.control}
              name="lotId"
              render={() => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Proyecto
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={handleProjectChange} disabled={loading.projects}>
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
              control={form.control}
              name="lotId"
              render={() => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Etapa
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={handleStageChange}
                      disabled={!selectedProject || loading.stages}
                    >
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
              control={form.control}
              name="lotId"
              render={() => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Square className="h-4 w-4" />
                    Manzana
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={handleBlockChange}
                      disabled={!selectedStage || loading.blocks}
                    >
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
              control={form.control}
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
                        handleLotChange(value);
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tipo de venta y resumen */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
              Configuración de Venta
            </h3>

            {/* Tipo de Venta */}
            <FormField
              control={form.control}
              name="saleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Tipo de Venta
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de venta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DIRECT_PAYMENT">
                          <div className="flex flex-col">
                            <span>Pago Directo</span>
                            <span className="text-xs text-gray-500">Pago completo al contado</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="FINANCED">
                          <div className="flex flex-col">
                            <span>Financiado</span>
                            <span className="text-xs text-gray-500">
                              Pago en cuotas con intereses
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resumen de selección */}
            {selectedLot && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                <h4 className="mb-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                  Resumen de Selección
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Proyecto:</span>
                    <span className="font-medium">{selectedProject?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Etapa:</span>
                    <span className="font-medium">{selectedStage?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Manzana:</span>
                    <span className="font-medium">{selectedBlock?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Lote:</span>
                    <span className="font-medium">{selectedLot.name}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 dark:border-gray-600">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Área:</span>
                      <span className="font-medium">{selectedLot.area} m²</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Precio Lote:</span>
                      <span className="font-semibold text-green-600">
                        S/ {selectedLot.lotPrice}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Habilitación Urbana:</span>
                      <span className="font-semibold text-blue-600">
                        S/ {selectedLot.urbanizationPrice}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-1 text-sm dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400">Total:</span>
                      <span className="text-lg font-bold">S/ {selectedLot.totalPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <Badge variant={form.watch('saleType') === 'FINANCED' ? 'default' : 'secondary'}>
                    {form.watch('saleType') === 'FINANCED' ? 'Venta Financiada' : 'Pago Directo'}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}
