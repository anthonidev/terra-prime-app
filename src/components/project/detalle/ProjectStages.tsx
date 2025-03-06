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
import { Building2, Layers, Plus } from "lucide-react";
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
        className="text-center py-8 border border-border rounded-md bg-card/60"
      >
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground mb-4">
          Este proyecto no tiene etapas registradas.
        </p>
        <Button
          variant="outline"
          className="mx-auto flex items-center gap-2"
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
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Etapas del proyecto</h2>
        <div className="flex items-center gap-2">
          <BlockActions onCreateClick={onCreateBlock} />
          <StageActions onCreateClick={onCreateStage} />
        </div>
      </div>

      {stages.map((stage, index) => (
        <motion.div key={stage.id} variants={item}>
          <Card
            className={!stage.isActive ? "opacity-90 border-border/50" : ""}
          >
            <CardHeader className="bg-card pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      Etapa: {stage.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    {stage.blocks.length}{" "}
                    {stage.blocks.length === 1 ? "Manzana" : "Manzanas"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={stage.isActive ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {stage.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                  <BlockActions
                    variant="stage"
                    stage={stage}
                    onCreateClick={onCreateBlock}
                  />
                  <StageActions
                    variant="minimal"
                    stage={stage}
                    onCreateClick={onCreateStage}
                    onEditClick={onEditStage}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              {stage.blocks.length > 0 ? (
                <div className="space-y-4">
                  {stage.blocks.map((block) => {
                    const total = block.lotCount || 1;
                    const percentages = {
                      active: (block.activeLots / total) * 100,
                      reserved: (block.reservedLots / total) * 100,
                      sold: (block.soldLots / total) * 100,
                      inactive: (block.inactiveLots / total) * 100,
                    };

                    return (
                      <motion.div
                        key={block.id}
                        className="border border-border rounded-md p-4 transition-colors hover:bg-accent/20"
                        whileHover={{ y: -2 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 10,
                        }}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-primary/10">
                              <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <div className="font-medium">
                              Manzana: {block.name}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={block.isActive ? "outline" : "secondary"}
                              className="text-xs"
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

                        <div className="mb-3 text-sm text-muted-foreground flex items-center gap-1">
                          <span>
                            {block.lotCount}{" "}
                            {block.lotCount === 1 ? "Lote" : "Lotes"}
                          </span>
                        </div>

                        <div className="h-3 flex rounded-full overflow-hidden bg-secondary/50">
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

                        {/* Leyenda de colores */}
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs">
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5" />
                            <span>
                              Activos:{" "}
                              <span className="font-medium">
                                {block.activeLots}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5" />
                            <span>
                              Separados:{" "}
                              <span className="font-medium">
                                {block.reservedLots}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mr-1.5" />
                            <span>
                              Vendidos:{" "}
                              <span className="font-medium">
                                {block.soldLots}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30 mr-1.5" />
                            <span>
                              Inactivos:{" "}
                              <span className="font-medium">
                                {block.inactiveLots}
                              </span>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 border rounded-md bg-card/50">
                  <p className="text-muted-foreground mb-3">
                    Esta etapa no tiene manzanas registradas.
                  </p>
                  <BlockActions
                    variant="stage"
                    stage={stage}
                    onCreateClick={onCreateBlock}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
