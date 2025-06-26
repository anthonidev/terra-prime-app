'use client';

import { Button } from '@/components/ui/button';
import { Block } from '@domain/entities/lotes/block.entity';
import {
  ArrowLeft,
  Calendar,
  Search,
  Square,
  AlertTriangle,
  RefreshCw,
  Grid3X3,
  Home,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectsSkeleton from '@/components/project/list/ProjectsSkeleton';
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBlocks } from '@sales/lotes/hooks/useBlocks';

interface Props {
  stageId: string;
  onPushClick: (stage: Block) => void;
  onBack: () => void;
}

export default function BlocksLayer({ stageId, onPushClick, onBack }: Props) {
  const [searchData, setSearchData] = React.useState<string>('');
  const { blocks, loading, error, fetchBlocks } = useBlocks(stageId);

  const filteredData = React.useMemo(() => {
    return blocks.filter((block) => block.name.toLowerCase().includes(searchData.toLowerCase()));
  }, [blocks, searchData]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-red-200 bg-red-50 p-12 dark:border-red-800 dark:bg-red-950/20"
      >
        <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/30">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-300">
          Error al cargar manzanas
        </h3>
        <p className="mb-6 max-w-md text-center text-red-600 dark:text-red-400">{error}</p>
        <Button
          variant="outline"
          onClick={() => fetchBlocks(stageId)}
          className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </motion.div>
    );
  }

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
            Volver a Etapas
          </Button>

          <div className="hidden items-center gap-2 text-sm text-gray-600 sm:flex dark:text-gray-400">
            <Grid3X3 className="h-4 w-4" />
            <span>
              {filteredData.length} manzana{filteredData.length !== 1 ? 's' : ''} encontrada
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
            placeholder="Buscar manzanas..."
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
              <Grid3X3 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
              No se encontraron manzanas
            </h3>
            <p className="max-w-md text-center text-gray-500 dark:text-gray-400">
              {searchData
                ? `No hay manzanas que coincidan con "${searchData}"`
                : 'Esta etapa aún no tiene manzanas configuradas'}
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
            {filteredData.map((block, index) => (
              <motion.div
                key={block.id}
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
                  onClick={() => onPushClick(block)}
                  className="group relative h-full cursor-pointer overflow-hidden border-0 bg-white py-0 shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-900"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-yellow-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <CardHeader className="relative bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="mb-2 text-lg leading-tight font-bold transition-colors group-hover:text-yellow-100">
                          Manzana {block.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-white/80">
                          <Square className="h-4 w-4" />
                          <span className="text-sm font-medium">Zona residencial</span>
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
                        Manzana urbanizada con servicios básicos instalados y lotes listos para
                        construcción residencial.
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-950/20">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-orange-600" />
                            <span className="text-xs font-medium text-orange-700 dark:text-orange-400">
                              Lotes
                            </span>
                          </div>
                          <p className="mt-1 text-lg font-bold text-orange-800 dark:text-orange-300">
                            {Math.floor(Math.random() * 20) + 10}
                          </p>
                        </div>

                        <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950/20">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-yellow-600" />
                            <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                              Disponibles
                            </span>
                          </div>
                          <p className="mt-1 text-lg font-bold text-yellow-800 dark:text-yellow-300">
                            {Math.floor(Math.random() * 15) + 5}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Ocupación</span>
                          <span>{Math.floor(Math.random() * 40) + 30}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-500"
                            style={{ width: `${Math.floor(Math.random() * 40) + 30}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="px-6 pt-0 pb-6">
                    <div className="flex w-full items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          {new Date(block.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-600 transition-colors group-hover:text-yellow-600">
                        <span className="text-xs font-semibold">Ver lotes</span>
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                      </div>
                    </div>
                  </CardFooter>

                  <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-transparent transition-colors duration-300 group-hover:border-yellow-500/30" />
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
