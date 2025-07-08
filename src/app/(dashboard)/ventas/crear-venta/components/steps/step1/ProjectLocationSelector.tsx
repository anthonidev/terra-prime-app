'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Building,
  Calendar,
  CreditCard,
  DollarSign,
  File,
  Layers,
  MapPin,
  Square
} from 'lucide-react';
import { Control, FieldErrors } from 'react-hook-form';
import { Project } from '@domain/entities/lotes/project.entity';
import { Stage } from '@domain/entities/lotes/stage.entity';
import { Block } from '@domain/entities/lotes/block.entity';
import { Lot } from '@domain/entities/lotes/lot.entity';

import { Step1FormData } from '@sales/crear-venta/validations/saleValidation';
import { CurrencyType } from '@/lib/domain/entities/sales/payment.entity';
import { Switch } from '@/components/ui/switch';
import FormInputField from '@/components/common/form/FormInputField';

interface Props {
  control: Control<Step1FormData>;
  errors: FieldErrors<Step1FormData>;

  projects: Project[];
  stages: Stage[];
  blocks: Block[];
  lots: Lot[];

  selectedProject: Project | null;
  selectedStage: Stage | null;
  selectedBlock: Block | null;

  loading: {
    projects: boolean;
    stages: boolean;
    blocks: boolean;
    lots: boolean;
  };

  onProjectChange: (projectId: string) => void;
  onStageChange: (stageId: string) => void;
  onBlockChange: (blockId: string) => void;
  onLotChange: (lotId: string) => void;

  isReservation: boolean;
  maximumHoldPeriod: number;
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
  onLotChange,
  isReservation,
  maximumHoldPeriod
}: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium text-blue-500 dark:text-blue-600">
        Configuración de Venta
      </h3>
      <FormField
        control={control}
        name="saleType"
        render={({ field }) => (
          <FormItem className="text-sm">
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
                    <span className="text-sm">Pago Directo</span>
                  </SelectItem>
                  <SelectItem value="FINANCED">
                    <span className="text-sm">Financiado</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="space-y-2 rounded-md border p-4">
        <FormField
          control={control}
          name="isReservation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  Reservación
                </FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isReservation && (
          <>
            <FormInputField<Step1FormData>
              name="reservationAmount"
              label="Monto de reserva"
              placeholder="Ingrese el monto de reserva"
              type="number"
              icon={<DollarSign className="h-4 w-4" />}
              control={control}
              errors={errors}
            />
            <FormInputField<Step1FormData>
              name="maximumHoldPeriod"
              label="Período máximo de retención (días)"
              placeholder="Ingrese los días"
              type="number"
              icon={<Calendar className="h-4 w-4" />}
              control={control}
              errors={errors}
            />
            {maximumHoldPeriod && !maximumHoldPeriod && maximumHoldPeriod > 0 && (
              <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Fecha límite de pago</span>
                </div>
                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                  El cliente debe realizar el pago antes del:
                  <span className="font-semibold">
                    {(() => {
                      const currentDate = new Date();
                      const dueDate = new Date(currentDate);
                      dueDate.setDate(currentDate.getDate() + maximumHoldPeriod);

                      const formatDate = (date: Date) => {
                        const options: Intl.DateTimeFormatOptions = {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        };
                        return date.toLocaleDateString('es-ES', options);
                      };

                      return formatDate(dueDate);
                    })()}
                  </span>
                </p>
                <p className="mt-1 text-xs text-blue-500 dark:text-blue-500">
                  ({maximumHoldPeriod} días desde hoy:{' '}
                  {new Date().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  )
                </p>
              </div>
            )}
          </>
        )}
      </div>
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
                  <SelectValue placeholder={loading.projects ? 'cargando...' : 'Seleccionar'} />
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
                  <SelectValue placeholder={loading.stages ? 'cargando...' : 'Seleccionar'} />
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
      <FormField
        control={control}
        name="lotId"
        render={() => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Square className="h-4 w-4 text-gray-700" />
              Manzana
            </FormLabel>
            <FormControl>
              <Select onValueChange={onBlockChange} disabled={!selectedStage || loading.blocks}>
                <SelectTrigger>
                  <SelectValue placeholder={loading.stages ? 'cargando...' : 'Seleccionar'} />
                </SelectTrigger>
                <SelectContent className="max-h-72 overflow-y-auto">
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
                  <SelectValue placeholder={loading.stages ? 'cargando...' : 'Seleccionar'} />
                </SelectTrigger>
                <SelectContent>
                  {lots.map((lot) => (
                    <SelectItem key={lot.id} value={lot.id}>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {lot.name}
                        </div>
                        <div className="text-sm">
                          {lot.area}m² -&nbsp;
                          {selectedProject?.currency == CurrencyType.PEN ? 'PEN' : 'USD'}&nbsp;
                          {lot.lotPrice}
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
