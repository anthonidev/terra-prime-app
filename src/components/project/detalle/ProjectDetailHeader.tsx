import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Building2, Layers, ChevronLeft, MoreHorizontal, Edit } from "lucide-react";
import Link from "next/link";
import { ProjectDetailDto } from "@/types/project.types";

interface ProjectDetailHeaderProps {
  project: ProjectDetailDto | null;
  onEditClick: () => void; 
}

export default function ProjectDetailHeader({ project, onEditClick }: ProjectDetailHeaderProps) {
  if (!project) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  };

  const totalBlocks = project.stages.reduce(
    (sum, stage) => sum + stage.blocks.length,
    0
  );

  const totalLots = project.stages.reduce(
    (sum, stage) => sum + stage.blocks.reduce(
      (blockSum, block) => blockSum + block.lotCount,
      0
    ),
    0
  );

  const activeLots = project.stages.reduce(
    (sum, stage) => sum + stage.blocks.reduce(
      (blockSum, block) => blockSum + block.activeLots,
      0
    ),
    0
  );

  const progressPercentage = totalLots > 0 ? (activeLots / totalLots) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Link href="/proyectos">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            Volver a proyectos
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {/* Reemplazamos el Link por un Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={onEditClick}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-6 bg-card/60 backdrop-blur-[2px]">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Logo o Imagen */}
          <div className={`h-20 w-20 rounded-md flex items-center justify-center ${project.isActive ? 'bg-primary/10' : 'bg-secondary/50'}`}>
            {project.logo ? (
              <img
                src={project.logo}
                alt={`Logo de ${project.name}`}
                className="max-h-16 max-w-16 object-contain"
              />
            ) : (
              <Building2 className={`h-10 w-10 ${project.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
            )}
          </div>

          {/* Información del proyecto */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <Badge variant={project.isActive ? "default" : "secondary"}>
                  {project.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {project.currency === "PEN" ? "Soles (S/)" : "Dólares ($)"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 mt-4">
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm">
                  <span className="font-medium">{project.stages.length}</span> Etapas
                </span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm">
                  <span className="font-medium">{totalBlocks}</span> Manzanas
                </span>
              </motion.div>
              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-sm">
                  <span className="font-medium text-green-600 dark:text-green-400">{activeLots}</span>
                  <span className="text-muted-foreground">/{totalLots} Lotes activos</span>
                </span>
                <div className="w-full h-1.5 bg-secondary rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Actualizado: {formatDate(project.updatedAt)}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}