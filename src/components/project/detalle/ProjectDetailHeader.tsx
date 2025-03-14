import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Building2,
  Layers,
  ChevronLeft,
  MoreHorizontal,
  Edit,
  MapPin,
  CreditCard,
  FileText,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { ProjectDetailDto } from "@/types/project.types";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface ProjectDetailHeaderProps {
  project: ProjectDetailDto | null;
  onEditClick: () => void;
}
export default function ProjectDetailHeader({
  project,
  onEditClick,
}: ProjectDetailHeaderProps) {
  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }, []);
  const { totalBlocks, totalLots, activeLots, progressPercentage } =
    useMemo(() => {
      if (!project) {
        return {
          totalBlocks: 0,
          totalLots: 0,
          activeLots: 0,
          progressPercentage: 0,
        };
      }
      const totalBlocks = project.stages.reduce(
        (sum, stage) => sum + stage.blocks.length,
        0,
      );
      const totalLots = project.stages.reduce(
        (sum, stage) =>
          sum +
          stage.blocks.reduce(
            (blockSum, block) => blockSum + block.lotCount,
            0,
          ),
        0,
      );
      const activeLots = project.stages.reduce(
        (sum, stage) =>
          sum +
          stage.blocks.reduce(
            (blockSum, block) => blockSum + block.activeLots,
            0,
          ),
        0,
      );
      const progressPercentage =
        totalLots > 0 ? (activeLots / totalLots) * 100 : 0;
      return { totalBlocks, totalLots, activeLots, progressPercentage };
    }, [project]);
  if (!project) return null;
  return (
    <div>
      {}
      <motion.div
        className="flex items-center justify-between mb-3"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Link href="/proyectos">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground hover:text-foreground group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Volver</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={onEditClick}
              className="h-8"
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Editar
            </Button>
          </motion.div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer text-xs">
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                <span>Exportar detalles</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-xs">
                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                <span>Compartir</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-xs text-destructive">
                <span>Archivar proyecto</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
      {}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden">
          {}
          <div
            className={`h-1 w-full ${project.isActive ? "bg-primary" : "bg-muted-foreground"}`}
          />
          <div className="p-4">
            <div className="flex gap-3 items-center">
              {}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={`h-14 w-14 rounded-md flex items-center justify-center ${
                  project.isActive ? "bg-primary/10" : "bg-secondary/50"
                }`}
              >
                {project.logo ? (
                  <Image
                    width={40}
                    height={40}
                    src={project.logo}
                    alt={`Logo de ${project.name}`}
                    className="max-h-10 max-w-10 object-contain"
                  />
                ) : (
                  <Building2
                    className={`h-6 w-6 ${
                      project.isActive
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                )}
              </motion.div>
              {}
              <div className="flex-1">
                <motion.div
                  className="flex items-center gap-2 mb-0.5 flex-wrap"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h1 className="text-xl font-bold">{project.name}</h1>
                  <Badge
                    variant={project.isActive ? "default" : "secondary"}
                    className="text-xs px-1.5 py-0"
                  >
                    {project.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs flex items-center"
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    {project.currency === "PEN" ? "Soles (S/)" : "Dólares ($)"}
                  </Badge>
                </motion.div>
                {}
                <motion.div
                  className="mt-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">
                      Lotes activos:{" "}
                      <span className="font-medium text-primary">
                        {activeLots}/{totalLots}
                      </span>
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {Math.round(progressPercentage)}% completado
                    </span>
                  </div>
                  <div className="relative w-full h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{
                        duration: 0.7,
                        delay: 0.4,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
            {}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
              <motion.div
                className="flex items-center text-xs text-muted-foreground"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.5 }}
              >
                <Building2 className="h-3.5 w-3.5 mr-1 text-primary/70" />
                <span>
                  <span className="font-medium">{project.stages.length}</span>{" "}
                  Etapas
                </span>
              </motion.div>
              <motion.div
                className="flex items-center text-xs text-muted-foreground"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.6 }}
              >
                <Layers className="h-3.5 w-3.5 mr-1 text-primary/70" />
                <span>
                  <span className="font-medium">{totalBlocks}</span> Manzanas
                </span>
              </motion.div>
              <motion.div
                className="flex items-center text-xs text-muted-foreground"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.7 }}
              >
                <MapPin className="h-3.5 w-3.5 mr-1 text-primary/70" />
                <span>
                  <span className="font-medium">{totalLots}</span> Lotes
                </span>
              </motion.div>
              <motion.div
                className="flex items-center text-xs text-muted-foreground"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.8 }}
              >
                <Calendar className="h-3.5 w-3.5 mr-1 text-primary/70" />
                <span>Act: {formatDate(project.updatedAt)}</span>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
