import { Badge } from "@/components/ui/badge";
import { Calendar, Building2, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectDetailDto } from "@/types/project.types";

interface ProjectDetailHeaderProps {
  project: ProjectDetailDto | null;
}

export default function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  if (!project) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-PE", {
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

  return (
    <div className="border-b pb-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <Badge variant={project.isActive ? "default" : "secondary"}>
              {project.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">
            {project.currency === "PEN" ? "Soles (S/)" : "Dólares ($)"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/proyectos/editar/${project.id}`}>
            <Button variant="outline" size="sm">Editar</Button>
          </Link>
          <Link href="/proyectos">
            <Button variant="ghost" size="sm">Volver</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mt-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            <span className="font-medium">{project.stages.length}</span> Etapas
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            <span className="font-medium">{totalBlocks}</span> Manzanas
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            <span className="font-medium text-green-600">{activeLots}</span>
            <span className="text-gray-500">/{totalLots} Lotes activos</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">
            Actualizado: {formatDate(project.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}