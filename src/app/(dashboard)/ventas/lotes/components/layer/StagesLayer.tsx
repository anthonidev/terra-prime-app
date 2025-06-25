'use client';

import { Button } from '@/components/ui/button';
import { Stage } from '@domain/entities/lotes/stage.entity';
import { ArrowLeft, Calendar, Search, Building2, BarChart3, MapPin } from 'lucide-react';
import { useStages } from '../../hooks/useStages';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectsSkeleton from '@/components/project/list/ProjectsSkeleton';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Props {
  projectId: string;
  onPushClick: (stage: Stage) => void;
  onBack: () => void;
}

export default function StagesLayer({ projectId, onPushClick, onBack }: Props) {
  const [searchData, setSearchData] = React.useState<string>('');
  const { stages, loading } = useStages(projectId);

  const filteredData = React.useMemo(() => {
    return stages.filter((stage) => stage.name.toLowerCase().includes(searchData.toLowerCase()));
  }, [stages, searchData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-gray-200 bg-white shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Proyectos
          </Button>

          <div className="hidden items-center gap-2 text-sm text-gray-600 sm:flex dark:text-gray-400">
            <Building2 className="h-4 w-4" />
            <span>
              {filteredData.length} etapa{filteredData.length !== 1 ? 's' : ''} encontrada
              {filteredData.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="relative max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Buscar etapas..."
            className="rounded-lg border-gray-200 bg-white py-2 pr-4 pl-10 shadow-sm focus:border-[#025864] focus:ring-[#025864]/20 dark:border-gray-700 dark:bg-gray-900"
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
          />
          {searchData && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => setSearchData('')}
              >
                ×
              </Button>
            </div>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {loading ? (
          <ProjectsSkeleton header={false} padding={false} />
        ) : filteredData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 dark:border-gray-600 dark:bg-gray-800/50"
          >
            <div className="mb-4 rounded-full bg-gray-200 p-4 dark:bg-gray-700">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
              No se encontraron etapas
            </h3>
            <p className="max-w-md text-center text-gray-500 dark:text-gray-400">
              {searchData
                ? `No hay etapas que coincidan con "${searchData}"`
                : 'Este proyecto aún no tiene etapas configuradas'}
            </p>
            {searchData && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setSearchData('')}
              >
                Limpiar búsqueda
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredData.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.4,
                  ease: 'easeOut'
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 }
                }}
              >
                <Card
                  onClick={() => onPushClick(stage)}
                  className="group relative h-full cursor-pointer overflow-hidden border-0 bg-white py-0 shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-900"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#025864]/5 via-transparent to-[#00CA7C]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <CardHeader className="relative bg-gradient-to-r from-[#025864] to-[#00CA7C] p-6 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="mb-2 text-lg leading-tight font-bold transition-colors group-hover:text-yellow-100">
                          {stage.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-white/80">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm font-medium">Etapa del proyecto</span>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="border-white/30 bg-white/20 px-2 py-1 text-white backdrop-blur-sm"
                      >
                        Activa
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow p-6">
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        Etapa de desarrollo urbano con infraestructura moderna y espacios
                        planificados para el crecimiento sostenible.
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                              Manzanas
                            </span>
                          </div>
                          <p className="mt-1 text-lg font-bold text-blue-800 dark:text-blue-300">
                            {Math.floor(Math.random() * 10) + 5}
                          </p>
                        </div>

                        <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-700 dark:text-green-400">
                              Lotes
                            </span>
                          </div>
                          <p className="mt-1 text-lg font-bold text-green-800 dark:text-green-300">
                            {Math.floor(Math.random() * 100) + 50}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="px-6 pt-0 pb-6">
                    <div className="flex w-full items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          {new Date(stage.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#025864] transition-colors group-hover:text-[#00CA7C]">
                        <span className="text-xs font-semibold">Explorar</span>
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                      </div>
                    </div>
                  </CardFooter>

                  <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-transparent transition-colors duration-300 group-hover:border-[#00CA7C]/30" />
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
