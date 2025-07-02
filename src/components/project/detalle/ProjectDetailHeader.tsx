import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  Share2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ProjectDetailDto } from '@infrastructure/types/projects/project.types';

interface ProjectDetailHeaderProps {
  project: ProjectDetailDto | null;
  onEditClick: () => void;
}

export default function ProjectDetailHeader({ project, onEditClick }: ProjectDetailHeaderProps) {
  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }, []);
  const { totalBlocks, totalLots, activeLots, progressPercentage } = useMemo(() => {
    if (!project) {
      return {
        totalBlocks: 0,
        totalLots: 0,
        activeLots: 0,
        progressPercentage: 0
      };
    }
    const totalBlocks = project.stages.reduce((sum, stage) => sum + stage.blocks.length, 0);
    const totalLots = project.stages.reduce(
      (sum, stage) => sum + stage.blocks.reduce((blockSum, block) => blockSum + block.lotCount, 0),
      0
    );
    const activeLots = project.stages.reduce(
      (sum, stage) =>
        sum + stage.blocks.reduce((blockSum, block) => blockSum + block.activeLots, 0),
      0
    );
    const progressPercentage = totalLots > 0 ? (activeLots / totalLots) * 100 : 0;
    return { totalBlocks, totalLots, activeLots, progressPercentage };
  }, [project]);
  if (!project) return null;
  return (
    <div>
      <motion.div
        className="mb-3 flex items-center justify-between"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Link href="/proyectos">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground group gap-1"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Volver</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" size="sm" onClick={onEditClick} className="h-8">
              <Edit className="mr-1 h-3.5 w-3.5" />
              Editar
            </Button>
          </motion.div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer text-xs">
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                <span>Exportar detalles</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-xs">
                <Share2 className="mr-1.5 h-3.5 w-3.5" />
                <span>Compartir</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer text-xs">
                <span>Archivar proyecto</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden">
          <div
            className={`h-1 w-full ${project.isActive ? 'bg-primary' : 'bg-muted-foreground'}`}
          />
          <div className="p-4">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={`flex h-14 w-14 items-center justify-center rounded-md ${
                  project.isActive ? 'bg-primary/10' : 'bg-secondary/50'
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
                      project.isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                )}
              </motion.div>
              <div className="flex-1">
                <motion.div
                  className="mb-0.5 flex flex-wrap items-center gap-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h1 className="text-xl font-bold">{project.name}</h1>
                  <Badge
                    variant={project.isActive ? 'default' : 'secondary'}
                    className="px-1.5 py-0 text-xs"
                  >
                    {project.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <Badge variant="outline" className="flex items-center text-xs">
                    <CreditCard className="mr-1 h-3 w-3" />
                    {project.currency === 'PEN' ? 'Soles (S/)' : 'Dólares ($)'}
                  </Badge>
                </motion.div>
                <motion.div
                  className="mt-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Lotes activos:{' '}
                      <span className="text-primary font-medium">
                        {activeLots}/{totalLots}
                      </span>
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {Math.round(progressPercentage)}% completado
                    </span>
                  </div>
                  <div className="bg-secondary/50 relative h-1.5 w-full overflow-hidden rounded-full">
                    <motion.div
                      className="bg-primary absolute top-0 left-0 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{
                        duration: 0.7,
                        delay: 0.4,
                        ease: 'easeOut'
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
            <div className="border-border/60 mt-3 flex items-center justify-between border-t pt-3">
              <motion.div
                className="text-muted-foreground flex items-center text-xs"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.5 }}
              >
                <Building2 className="text-primary/70 mr-1 h-3.5 w-3.5" />
                <span>
                  <span className="font-medium">{project.stages.length}</span> Etapas
                </span>
              </motion.div>
              <motion.div
                className="text-muted-foreground flex items-center text-xs"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.6 }}
              >
                <Layers className="text-primary/70 mr-1 h-3.5 w-3.5" />
                <span>
                  <span className="font-medium">{totalBlocks}</span> Manzanas
                </span>
              </motion.div>
              <motion.div
                className="text-muted-foreground flex items-center text-xs"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.7 }}
              >
                <MapPin className="text-primary/70 mr-1 h-3.5 w-3.5" />
                <span>
                  <span className="font-medium">{totalLots}</span> Lotes
                </span>
              </motion.div>
              <motion.div
                className="text-muted-foreground flex items-center text-xs"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.8 }}
              >
                <Calendar className="text-primary/70 mr-1 h-3.5 w-3.5" />
                <span>Act: {formatDate(project.updatedAt)}</span>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
