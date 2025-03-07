import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BlockDetailDto, StageDetailDto } from "@/types/project.types";
import { motion } from "framer-motion";
import {
  Building2,
  Layers,
  Plus,
  Check,
  Clock,
  Tag,
  AlertCircle,
  MapPin,
} from "lucide-react";
import BlockActions from "./BlockActions";
import StageActions from "./StageActions";
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
  onEditBlock,
}: ProjectStagesProps) {
  if (!stages.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 border border-dashed border-primary/30 rounded-lg bg-primary/5"
      >
        <div className="p-5 bg-primary/10 rounded-full mb-5">
          <Building2 className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2">No hay etapas registradas</h3>
        <p className="text-muted-foreground mb-6 max-w-md text-center">
          Para comenzar a configurar este proyecto, crea tu primera etapa y
          luego añade manzanas y lotes.
        </p>
        <Button
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
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
        staggerChildren: 0.07,
      },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };
  const totalMetrics = stages.reduce(
    (acc, stage) => {
      const stageLots = stage.blocks.reduce(
        (total, block) => total + block.lotCount,
        0,
      );
      const stageActiveLots = stage.blocks.reduce(
        (total, block) => total + block.activeLots,
        0,
      );
      const stageSoldLots = stage.blocks.reduce(
        (total, block) => total + block.soldLots,
        0,
      );
      const stageReservedLots = stage.blocks.reduce(
        (total, block) => total + block.reservedLots,
        0,
      );
      return {
        totalLots: acc.totalLots + stageLots,
        activeLots: acc.activeLots + stageActiveLots,
        soldLots: acc.soldLots + stageSoldLots,
        reservedLots: acc.reservedLots + stageReservedLots,
      };
    },
    { totalLots: 0, activeLots: 0, soldLots: 0, reservedLots: 0 },
  );
  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Etapas del proyecto
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {stages.length} {stages.length === 1 ? "etapa" : "etapas"} con{" "}
            {totalMetrics.totalLots} lotes en total
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <BlockActions onCreateClick={onCreateBlock} />
          <StageActions onCreateClick={onCreateStage} />
        </div>
      </div>
      {}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Card className="border border-green-200 dark:border-green-900 overflow-hidden">
          <div className="flex items-center h-full">
            <div className="bg-green-50 dark:bg-green-950/30 h-full flex items-center px-2">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 pl-2 pr-3 py-1.5">
              <p className="text-xs text-muted-foreground leading-none mb-1">
                Activos
              </p>
              <p className="text-base font-semibold text-green-600 dark:text-green-400 leading-none">
                {totalMetrics.activeLots}
              </p>
            </div>
          </div>
        </Card>
        <Card className="border border-blue-200 dark:border-blue-900 overflow-hidden">
          <div className="flex items-center h-full">
            <div className="bg-blue-50 dark:bg-blue-950/30 h-full flex items-center px-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 pl-2 pr-3 py-1.5">
              <p className="text-xs text-muted-foreground leading-none mb-1">
                Separados
              </p>
              <p className="text-base font-semibold text-blue-600 dark:text-blue-400 leading-none">
                {totalMetrics.reservedLots}
              </p>
            </div>
          </div>
        </Card>
        <Card className="border border-purple-200 dark:border-purple-900 overflow-hidden">
          <div className="flex items-center h-full">
            <div className="bg-purple-50 dark:bg-purple-950/30 h-full flex items-center px-2">
              <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 pl-2 pr-3 py-1.5">
              <p className="text-xs text-muted-foreground leading-none mb-1">
                Vendidos
              </p>
              <p className="text-base font-semibold text-purple-600 dark:text-purple-400 leading-none">
                {totalMetrics.soldLots}
              </p>
            </div>
          </div>
        </Card>
        <Card className="border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center h-full">
            <div className="bg-gray-50 dark:bg-gray-800/30 h-full flex items-center px-2">
              <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="flex-1 pl-2 pr-3 py-1.5">
              <p className="text-xs text-muted-foreground leading-none mb-1">
                Inactivos
              </p>
              <p className="text-base font-semibold text-gray-500 dark:text-gray-400 leading-none">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stages.map((stage) => (
          <motion.div key={stage.id} variants={item} className="group">
            <Card
              className={`h-full overflow-hidden transition-all duration-300 border-l-4 ${
                stage.isActive
                  ? "border-l-primary hover:border-l-primary"
                  : "border-l-gray-300 dark:border-l-gray-700 hover:border-l-gray-400 dark:hover:border-l-gray-600"
              } ${!stage.isActive ? "opacity-90" : ""}`}
            >
              <CardHeader className="bg-card/50 pb-2 pt-3 px-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-md font-medium inline-flex items-center gap-1.5 mb-0.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${stage.isActive ? "bg-primary" : "bg-muted-foreground/50"}`}
                      />
                      <span className="truncate">Etapa: {stage.name}</span>
                    </CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1">
                      <Layers className="h-3 w-3 text-muted-foreground" />
                      {stage.blocks.length}{" "}
                      {stage.blocks.length === 1 ? "Manzana" : "Manzanas"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge
                      variant={stage.isActive ? "default" : "secondary"}
                      className="text-xs px-1.5 py-0"
                    >
                      {stage.isActive ? "Activa" : "Inactiva"}
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
              <CardContent className="pt-0 pb-3 px-4">
                <div className="flex-1 mt-1 mb-2">
                  {stage.blocks.length > 0 ? (
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs rounded-sm"
                        onClick={() => onCreateBlock(stage.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Añadir manzana
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {stage.blocks.reduce(
                          (sum, block) => sum + block.lotCount,
                          0,
                        )}{" "}
                        lotes totales
                      </span>
                    </div>
                  ) : (
                    <BlockActions
                      variant="stage"
                      stage={stage}
                      onCreateClick={onCreateBlock}
                    />
                  )}
                </div>
                {stage.blocks.length > 0 && (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1 pt-1">
                    {stage.blocks.map((block) => {
                      const total = block.lotCount || 1;
                      const percentages = {
                        active: (block.activeLots / total) * 100,
                        reserved: (block.reservedLots / total) * 100,
                        sold: (block.soldLots / total) * 100,
                        inactive: (block.inactiveLots / total) * 100,
                      };
                      return (
                        <div
                          key={block.id}
                          className="border rounded-md transition-all hover:shadow-sm hover:border-primary/30 overflow-hidden bg-card"
                        >
                          <div className="p-2 flex justify-between items-center bg-secondary/20">
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <div
                                className={`p-1 rounded-sm ${block.isActive ? "bg-primary/10" : "bg-secondary/30"}`}
                              >
                                <MapPin
                                  className={`h-3 w-3 ${block.isActive ? "text-primary" : "text-muted-foreground"}`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-xs truncate">
                                  Mz: {block.name}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {block.lotCount}{" "}
                                  {block.lotCount === 1 ? "Lote" : "Lotes"}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge
                                variant={
                                  block.isActive ? "outline" : "secondary"
                                }
                                className="text-xs px-1.5 py-0"
                              >
                                {block.isActive ? "Activa" : "Inactiva"}
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
                            <div className="h-2 flex rounded-full overflow-hidden bg-secondary/50">
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
                            <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2 text-[10px]">
                              <div className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1" />
                                <span>
                                  <span className="font-medium">
                                    {block.activeLots}
                                  </span>{" "}
                                  act
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1" />
                                <span>
                                  <span className="font-medium">
                                    {block.reservedLots}
                                  </span>{" "}
                                  sep
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1" />
                                <span>
                                  <span className="font-medium">
                                    {block.soldLots}
                                  </span>{" "}
                                  ven
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 mr-1" />
                                <span>
                                  <span className="font-medium">
                                    {block.inactiveLots}
                                  </span>{" "}
                                  ina
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
                  <div className="text-center py-3 border border-dashed rounded-sm bg-secondary/10 mt-2">
                    <Layers className="h-6 w-6 mx-auto text-muted-foreground/50 mb-1" />
                    <p className="text-xs text-muted-foreground mb-2">
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
