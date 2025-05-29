import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  ProyectBlocksItems,
  ProyectsActivesItems,
  ProyectStagesItems,
  ProyectLotsItems
} from '@/types/sales';
import { motion } from 'framer-motion';
import { Building, Check } from 'lucide-react';
import { useProyectsActives } from '../hooks/useProyectsActives';
import { useProyectStages } from '../hooks/useProyectStages';
import { useProyectBlocks } from '../hooks/useProyectBlocks';
import { useProyectLots } from '../hooks/useProyectLots';
import { UseFormReturn } from 'react-hook-form';
import { SaleFormData } from '@/lib/validations/sales';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Props {
  selectedProject: ProyectsActivesItems | null;
  selectedStage: ProyectStagesItems | null;
  selectedBlock: ProyectBlocksItems | null;
  setSelectedProject: React.Dispatch<React.SetStateAction<ProyectsActivesItems | null>>;
  setSelectedStage: React.Dispatch<React.SetStateAction<ProyectStagesItems | null>>;
  setSelectedBlock: React.Dispatch<React.SetStateAction<ProyectBlocksItems | null>>;
  form: UseFormReturn<SaleFormData>;
}

export function InformationStep({
  selectedProject,
  selectedStage,
  selectedBlock,
  setSelectedProject,
  setSelectedStage,
  setSelectedBlock,
  form
}: Props) {
  const { data: proyectsData, isLoading: loadingProyect } = useProyectsActives();

  const { stages, isLoading: loadingStage } = useProyectStages(selectedProject?.id);
  const { blocks, isLoading: loadingBlock } = useProyectBlocks(selectedStage?.id);
  const { lots, isLoading: loadingLot } = useProyectLots(selectedBlock?.id);

  const paymentMethod = form.watch('methodPayment');
  const lotId = form.watch('lotId');
  const selectedLot = lots?.find((lot) => lot.id === lotId);

  form.setValue('totalAmount', Number(selectedLot?.totalPrice));
  form.setValue('totalAmountUrbanDevelopment', Number(selectedLot?.urbanizationPrice));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="mb-2 rounded border-l-2 border-green-600 bg-gray-50 p-2 dark:border-green-700 dark:bg-gray-900 dark:shadow-sm">
        <h3 className="text-base font-medium text-[#035c64] dark:text-slate-200">
          Formulario de información
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Selecciona el proyecto, etapa, bloque y lote para continuar con la creación de la venta.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="">
          <span className="text-muted-foreground text-sm">Proyecto:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="icon" className="w-full px-2">
                  <span className="text-sm text-gray-600 dark:text-green-600">
                    {selectedProject?.name || 'Seleccionar'}
                  </span>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {loadingProyect ? (
                <p className="p-px text-sm">cargando</p>
              ) : (
                proyectsData?.map((proyecto: ProyectsActivesItems) => (
                  <DropdownMenuItem
                    key={proyecto.id}
                    className={cn(
                      'cursor-pointer text-xs',
                      selectedProject?.id === proyecto.id && 'bg-blue-50 dark:bg-blue-900'
                    )}
                    onSelect={() => setSelectedProject(proyecto)}
                  >
                    <Building className="mr-2 h-3.5 w-3.5 text-blue-500" />
                    <span className="truncate text-sm">{proyecto.name}</span>
                    {selectedProject?.id === proyecto.id && (
                      <Check className="ml-auto h-3.5 w-3.5 text-blue-500" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="">
          <span className="text-muted-foreground text-sm">Etapa:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-full px-2"
                  disabled={!selectedProject}
                >
                  <span className="text-sm text-gray-600 dark:text-green-600">
                    {selectedStage?.name || 'Seleccionar'}
                  </span>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {loadingStage ? (
                <p className="p-px text-sm">cargando</p>
              ) : (
                stages?.map((stage: ProyectStagesItems) => (
                  <DropdownMenuItem
                    key={stage.id}
                    className={cn(
                      'cursor-pointer text-xs',
                      selectedStage?.id === stage.id && 'bg-blue-50 dark:bg-blue-900'
                    )}
                    onSelect={() => setSelectedStage(stage)}
                  >
                    <Building className="mr-2 h-3.5 w-3.5 text-blue-500" />
                    <span className="truncate text-sm">{stage.name}</span>
                    {selectedStage?.id === stage.id && (
                      <Check className="ml-auto h-3.5 w-3.5 text-blue-500" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="">
          <span className="text-muted-foreground text-sm">Manzana:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-full px-2"
                  disabled={!selectedStage}
                >
                  <span className="text-sm text-gray-600 dark:text-green-600">
                    {selectedBlock?.name || 'Seleccionar'}
                  </span>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {loadingBlock ? (
                <p className="p-px text-sm">cargando</p>
              ) : (
                blocks?.map((block: ProyectBlocksItems) => (
                  <DropdownMenuItem
                    key={block.id}
                    className={cn(
                      'cursor-pointer text-xs',
                      selectedBlock?.id === block.id && 'bg-blue-50 dark:bg-blue-900'
                    )}
                    onSelect={() => setSelectedBlock(block)}
                  >
                    <Building className="mr-2 h-3.5 w-3.5 text-blue-500" />
                    <span className="truncate text-sm">{block.name}</span>
                    {selectedBlock?.id === block.id && (
                      <Check className="ml-auto h-3.5 w-3.5 text-blue-500" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="">
          <span className="text-muted-foreground text-sm">Lote:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-full px-2"
                  disabled={!selectedBlock}
                >
                  <span className="text-sm text-gray-600 dark:text-green-600">
                    {selectedLot?.name || 'Seleccionar'}
                  </span>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {loadingLot ? (
                <p className="p-px text-sm">cargando</p>
              ) : (
                lots
                  ?.filter((lot: ProyectLotsItems) => lot.status === 'Activo')
                  ?.map((lot: ProyectLotsItems) => (
                    <DropdownMenuItem
                      key={lot.id}
                      className={cn(
                        'cursor-pointer text-xs',
                        selectedLot?.id === lot.id && 'bg-blue-50 dark:bg-blue-900'
                      )}
                      onSelect={() => form.setValue('lotId', lot.id)}
                    >
                      <Building className="mr-2 h-3.5 w-3.5 text-blue-500" />
                      <span className="truncate text-sm">{lot.name}</span>
                      {selectedLot?.id === lot.id && (
                        <Check className="ml-auto h-3.5 w-3.5 text-blue-500" />
                      )}
                    </DropdownMenuItem>
                  ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="">
          <span className="text-muted-foreground text-sm">Forma de pago:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="icon" className="w-full px-2">
                  <span className="text-sm text-gray-600 dark:text-green-600">
                    {paymentMethod === 'DIRECT_PAYMENT'
                      ? 'Cash'
                      : paymentMethod === 'FINANCED'
                        ? 'Financiado'
                        : 'Seleccionar'}
                  </span>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem
                className={cn(
                  'cursor-pointer text-xs',
                  paymentMethod === 'DIRECT_PAYMENT' && 'bg-blue-50 dark:bg-blue-900'
                )}
                onSelect={() => form.setValue('methodPayment', 'DIRECT_PAYMENT')}
              >
                <span className="truncate text-sm">Cash</span>
                {paymentMethod === 'DIRECT_PAYMENT' && (
                  <Check className="ml-auto h-3.5 w-3.5 text-blue-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(
                  'cursor-pointer text-xs',
                  paymentMethod === 'FINANCED' && 'bg-blue-50 dark:bg-blue-900'
                )}
                onSelect={() => form.setValue('methodPayment', 'FINANCED')}
              >
                <span className="truncate text-sm">Financiado</span>
                {paymentMethod === 'FINANCED' && (
                  <Check className="ml-auto h-3.5 w-3.5 text-blue-500" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {selectedProject && selectedStage && selectedBlock && selectedLot && paymentMethod && (
        <motion.div className={cn('')} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="mt-5 overflow-hidden rounded-md border bg-slate-50 dark:bg-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead>Manzana</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Precio Lote</TableHead>
                  <TableHead>Precio HU.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="lowercase">{selectedProject?.name}</TableCell>
                  <TableCell className="lowercase">{selectedStage?.name}</TableCell>
                  <TableCell className="lowercase">{selectedBlock?.name}</TableCell>
                  <TableCell className="lowercase">{selectedLot?.name}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="lowercase">
                      <span className="text-sm">
                        {paymentMethod === 'DIRECT_PAYMENT'
                          ? 'Cash'
                          : paymentMethod === 'FINANCED'
                            ? 'Financiado'
                            : 'Seleccionar'}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {selectedLot.lotPrice}&nbsp;
                    <span className="text-green-600">
                      {selectedProject?.currency == 'usd' ? '$' : 'S/.'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {selectedLot.urbanizationPrice}&nbsp;
                    <span className="text-green-600">
                      {selectedProject?.currency == 'usd' ? '$' : 'S/.'}
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
