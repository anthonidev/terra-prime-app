import type { ProyectsActivesItems } from '@/types/sales';
import { AlertCircle, Calendar, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ProyectSkeleton from '@/components/project/list/ProjectsSkeleton';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface Props {
  data: ProyectsActivesItems[];
  isLoading: boolean;
  error: string | null;
  onPushClick: (project: ProyectsActivesItems) => void;
}

export default function ProyectsLayer({ data, isLoading, error, onPushClick }: Props) {
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const filteredProjects = React.useMemo(() => {
    return data.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.projectCode &&
          project.projectCode.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);

  if (isLoading) return <ProyectSkeleton header={false} />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800/50 dark:bg-red-900/20">
        <AlertCircle className="mb-3 h-10 w-10 text-red-500" />
        <h3 className="mb-2 text-lg font-medium text-red-800 dark:text-red-300">
          Error al cargar proyectos
        </h3>
        <p className="text-center text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
          No hay proyectos disponibles
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar proyectos por nombre o código..."
          className="bg-white pl-10 dark:bg-gray-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No se encontraron proyectos
          </h3>
          <p className="text-sm text-gray-400">Intenta con otro término de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  onClick={() => onPushClick(project)}
                  className="group flex h-full cursor-pointer flex-col overflow-hidden py-0 transition-colors duration-200 hover:border-green-200 hover:shadow-md hover:shadow-green-200 hover:transition-colors hover:duration-700 dark:hover:border-green-800 dark:hover:duration-200"
                >
                  <CardHeader className="bg-gradient-to-r from-[#025864] to-[#00CA7C] bg-[length:200%_100%] bg-left py-4 transition-all duration-200 ease-in-out group-hover:bg-right">
                    <div className="flex items-center justify-between">
                      <CardTitle className="line-clamp-1 text-lg text-slate-50 transition-colors">
                        {project.name}
                      </CardTitle>
                      <Badge variant={'secondary'} className="text-xs">
                        {project.currency}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pb-4">
                    <div className="flex items-center gap-3">
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
                        <p className="text-sm text-gray-600 dark:text-slate-300">
                          Lorem ipsum dolor amet sit undescribe lorem amet pir pa
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto border-t py-4">
                    <div className="text-muted-foreground flex items-center text-xs">
                      <Calendar className="mr-1.5 h-3.5 w-3.5" />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
