import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import { ProjectListItemDto } from '@infrastructure/types/projects/project.types';
import { motion } from 'framer-motion';
import { Building, Building2, Calendar, ChevronRight, Layers } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  project: ProjectListItemDto;
  index: number;
  formatDate: (date: Date) => string;
};

const ProjectCard = ({ project, formatDate, index }: Props) => {
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/proyectos/detalle/${project.id}`} className="block h-full">
        <Card className="hover:border-primary/50 group flex h-full flex-col overflow-hidden transition-all duration-200 hover:shadow-md">
          <div
            className={`h-2 w-full ${project.isActive ? 'bg-primary' : 'bg-muted-foreground'}`}
          />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="group-hover:text-primary line-clamp-1 text-lg transition-colors">
                {project.name}
              </CardTitle>

              <Badge variant={project.isActive ? 'default' : 'secondary'} className="text-xs">
                {project.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {project.currency === 'PEN' ? 'Soles (S/)' : 'Dólares ($)'}
            </p>
          </CardHeader>
          <CardContent className="flex-grow pb-4">
            <div className="mb-3 flex items-center gap-3">
              {project.logo ? (
                <div className="bg-secondary/50 flex h-14 w-14 items-center justify-center rounded-md p-1">
                  <Image
                    width={48}
                    height={48}
                    src={project.logo}
                    alt={`Logo de ${project.name}`}
                    className="max-h-12 max-w-12 object-contain"
                  />
                </div>
              ) : (
                <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-md">
                  <Building2 className="text-primary/80 h-8 w-8" />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="text-muted-foreground flex items-center text-sm">
                  <Building className="text-primary/70 mr-1.5 h-4 w-4" />
                  <span>
                    <span className="font-medium">{project.stageCount}</span> Etapas
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center text-sm">
                  <Layers className="text-primary/70 mr-1.5 h-4 w-4" />
                  <span>
                    <span className="font-medium">{project.blockCount}</span> Manzanas
                  </span>
                </div>
                {}
                {project.lotCount > 0 && (
                  <div className="mt-1">
                    <div className="text-muted-foreground mb-1.5 flex justify-between text-xs">
                      <span>Lotes activos</span>
                      <span className="font-medium">
                        {project.activeLotCount}/{project.lotCount}
                      </span>
                    </div>
                    <div className="bg-secondary/50 h-1.5 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{
                          width: `${(project.activeLotCount / project.lotCount) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="mt-auto flex items-center justify-between border-t pt-2">
            <div className="text-muted-foreground flex items-center text-xs">
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              <span>{formatDate(project.updatedAt)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-primary group-hover:bg-primary/10 gap-1 text-sm transition-colors"
            >
              Ver detalles
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};
export default ProjectCard;
