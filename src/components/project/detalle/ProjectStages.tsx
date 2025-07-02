import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Building2, Layers, Plus, Check, Clock, Tag, AlertCircle, MapPin } from 'lucide-react';
import BlockActions from './BlockActions';
import StageActions from './StageActions';
import { BlockDetailDto, StageDetailDto } from '@infrastructure/types/projects/project.types';

interface ProjectStagesProps {
  stages: StageDetailDto[];
  onCreateStage: () => void;
  onEditStage: (stage: StageDetailDto) => void;
  onCreateBlock: (stageId?: string) => void;
  onEditBlock: (block: BlockDetailDto) => void;
}

export default function ProjectStages({
  stages,
  onCreateStage,
  onEditStage,
  onCreateBlock,
  onEditBlock
}: ProjectStagesProps) {
  if (!stages.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-primary/30 bg-primary/5 flex flex-col items-center justify-center rounded-lg border border-dashed py-12"
      >
        <div className="bg-primary/10 mb-5 rounded-full p-5">
          <Building2 className="text-primary h-10 w-10" />
        </div>
        <h3 className="mb-2 text-xl font-medium">No hay etapas registradas</h3>
        <p className="text-muted-foreground mb-6 max-w-md text-center">
          Para comenzar a configurar este proyecto, crea tu primera etapa y luego añade manzanas y
          lotes.
        </p>
        <Button
          className="bg-primary hover:bg-primary/90 flex items-center gap-2 text-white"
          onClick={onCreateStage}
        >
          <Plus className="h-4 w-4" />
          Crear primera etapa
        </Button>
      </motion.div>
    );
  }
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07
      }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  const totalMetrics = stages.reduce(
    (acc, stage) => {
      const stageLots = stage.blocks.reduce((total, block) => total + block.lotCount, 0);
      const stageActiveLots = stage.blocks.reduce((total, block) => total + block.activeLots, 0);
      const stageSoldLots = stage.blocks.reduce((total, block) => total + block.soldLots, 0);
      const stageReservedLots = stage.blocks.reduce(
        (total, block) => total + block.reservedLots,
        0
      );
      return {
        totalLots: acc.totalLots + stageLots,
        activeLots: acc.activeLots + stageActiveLots,
        soldLots: acc.soldLots + stageSoldLots,
        reservedLots: acc.reservedLots + stageReservedLots
      };
    },
    { totalLots: 0, activeLots: 0, soldLots: 0, reservedLots: 0 }
  );
  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Building2 className="text-primary h-5 w-5" />
            Etapas del proyecto
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {stages.length} {stages.length === 1 ? 'etapa' : 'etapas'} con {totalMetrics.totalLots}{' '}
            lotes en total
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <BlockActions onCreateClick={onCreateBlock} />
          <StageActions onCreateClick={onCreateStage} />
        </div>
      </div>
      {}
      <div className="mb-4 grid grid-cols-4 gap-3">
        <Card className="overflow-hidden border border-green-200 dark:border-green-900">
          <div className="flex h-full items-center">
            <div className="flex h-full items-center bg-green-50 px-2 dark:bg-green-950/30">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 py-1.5 pr-3 pl-2">
              <p className="text-muted-foreground mb-1 text-xs leading-none">Activos</p>
              <p className="text-base leading-none font-semibold text-green-600 dark:text-green-400">
                {totalMetrics.activeLots}
              </p>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden border border-blue-200 dark:border-blue-900">
          <div className="flex h-full items-center">
            <div className="flex h-full items-center bg-blue-50 px-2 dark:bg-blue-950/30">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 py-1.5 pr-3 pl-2">
              <p className="text-muted-foreground mb-1 text-xs leading-none">Separados</p>
              <p className="text-base leading-none font-semibold text-blue-600 dark:text-blue-400">
                {totalMetrics.reservedLots}
              </p>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden border border-purple-200 dark:border-purple-900">
          <div className="flex h-full items-center">
            <div className="flex h-full items-center bg-purple-50 px-2 dark:bg-purple-950/30">
              <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 py-1.5 pr-3 pl-2">
              <p className="text-muted-foreground mb-1 text-xs leading-none">Vendidos</p>
              <p className="text-base leading-none font-semibold text-purple-600 dark:text-purple-400">
                {totalMetrics.soldLots}
              </p>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex h-full items-center">
            <div className="flex h-full items-center bg-gray-50 px-2 dark:bg-gray-800/30">
              <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="flex-1 py-1.5 pr-3 pl-2">
              <p className="text-muted-foreground mb-1 text-xs leading-none">Inactivos</p>
              <p className="text-base leading-none font-semibold text-gray-500 dark:text-gray-400">
                {totalMetrics.totalLots -
                  totalMetrics.activeLots -
                  totalMetrics.soldLots -
                  totalMetrics.reservedLots}
              </p>
            </div>
          </div>
        </Card>
      </div>
      {}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stages.map((stage) => (
          <motion.div key={stage.id} variants={item} className="group">
            <Card
              className={`h-full overflow-hidden border-l-4 transition-all duration-300 ${
                stage.isActive
                  ? 'border-l-primary hover:border-l-primary'
                  : 'border-l-gray-300 hover:border-l-gray-400 dark:border-l-gray-700 dark:hover:border-l-gray-600'
              } ${!stage.isActive ? 'opacity-90' : ''}`}
            >
              <CardHeader className="bg-card/50 px-4 pt-3 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-md mb-0.5 inline-flex items-center gap-1.5 font-medium">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${stage.isActive ? 'bg-primary' : 'bg-muted-foreground/50'}`}
                      />
                      <span className="truncate">Etapa: {stage.name}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Layers className="text-muted-foreground h-3 w-3" />
                      {stage.blocks.length} {stage.blocks.length === 1 ? 'Manzana' : 'Manzanas'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge
                      variant={stage.isActive ? 'default' : 'secondary'}
                      className="px-1.5 py-0 text-xs"
                    >
                      {stage.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                    <StageActions
                      variant="minimal"
                      stage={stage}
                      onCreateClick={onCreateStage}
                      onEditClick={onEditStage}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pt-0 pb-3">
                <div className="mt-1 mb-2 flex-1">
                  {stage.blocks.length > 0 ? (
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 rounded-sm text-xs"
                        onClick={() => onCreateBlock(stage.id)}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Añadir manzana
                      </Button>
                      <span className="text-muted-foreground text-xs">
                        {stage.blocks.reduce((sum, block) => sum + block.lotCount, 0)} lotes totales
                      </span>
                    </div>
                  ) : (
                    <BlockActions variant="stage" stage={stage} onCreateClick={onCreateBlock} />
                  )}
                </div>
                {stage.blocks.length > 0 && (
                  <div className="max-h-52 space-y-2 overflow-y-auto pt-1 pr-1">
                    {stage.blocks.map((block) => {
                      const total = block.lotCount || 1;
                      const percentages = {
                        active: (block.activeLots / total) * 100,
                        reserved: (block.reservedLots / total) * 100,
                        sold: (block.soldLots / total) * 100,
                        inactive: (block.inactiveLots / total) * 100
                      };
                      return (
                        <div
                          key={block.id}
                          className="hover:border-primary/30 bg-card overflow-hidden rounded-md border transition-all hover:shadow-sm"
                        >
                          <div className="bg-secondary/20 flex items-center justify-between p-2">
                            <div className="flex min-w-0 flex-1 items-center gap-1.5">
                              <div
                                className={`rounded-sm p-1 ${block.isActive ? 'bg-primary/10' : 'bg-secondary/30'}`}
                              >
                                <MapPin
                                  className={`h-3 w-3 ${block.isActive ? 'text-primary' : 'text-muted-foreground'}`}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-xs font-medium">Mz: {block.name}</div>
                                <div className="text-muted-foreground text-[10px]">
                                  {block.lotCount} {block.lotCount === 1 ? 'Lote' : 'Lotes'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge
                                variant={block.isActive ? 'outline' : 'secondary'}
                                className="px-1.5 py-0 text-xs"
                              >
                                {block.isActive ? 'Activa' : 'Inactiva'}
                              </Badge>
                              <BlockActions
                                variant="minimal"
                                block={block}
                                onCreateClick={onCreateBlock}
                                onEditClick={onEditBlock}
                              />
                            </div>
                          </div>
                          <div className="p-2">
                            {}
                            <div className="bg-secondary/50 flex h-2 overflow-hidden rounded-full">
                              {percentages.active > 0 && (
                                <div
                                  className="bg-green-500 transition-all"
                                  style={{ width: `${percentages.active}%` }}
                                  title={`Activos: ${block.activeLots}`}
                                />
                              )}
                              {percentages.reserved > 0 && (
                                <div
                                  className="bg-blue-500 transition-all"
                                  style={{ width: `${percentages.reserved}%` }}
                                  title={`Separados: ${block.reservedLots}`}
                                />
                              )}
                              {percentages.sold > 0 && (
                                <div
                                  className="bg-purple-500 transition-all"
                                  style={{ width: `${percentages.sold}%` }}
                                  title={`Vendidos: ${block.soldLots}`}
                                />
                              )}
                              {percentages.inactive > 0 && (
                                <div
                                  className="bg-muted-foreground/30 transition-all"
                                  style={{ width: `${percentages.inactive}%` }}
                                  title={`Inactivos: ${block.inactiveLots}`}
                                />
                              )}
                            </div>
                            {}
                            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[10px]">
                              <div className="flex items-center">
                                <div className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                                <span>
                                  <span className="font-medium">{block.activeLots}</span> act
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="mr-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                                <span>
                                  <span className="font-medium">{block.reservedLots}</span> sep
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="mr-1 h-1.5 w-1.5 rounded-full bg-purple-500" />
                                <span>
                                  <span className="font-medium">{block.soldLots}</span> ven
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="bg-muted-foreground/30 mr-1 h-1.5 w-1.5 rounded-full" />
                                <span>
                                  <span className="font-medium">{block.inactiveLots}</span> ina
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {}
                {stage.blocks.length === 0 && (
                  <div className="bg-secondary/10 mt-2 rounded-sm border border-dashed py-3 text-center">
                    <Layers className="text-muted-foreground/50 mx-auto mb-1 h-6 w-6" />
                    <p className="text-muted-foreground mb-2 text-xs">
                      Esta etapa no tiene manzanas registradas.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
