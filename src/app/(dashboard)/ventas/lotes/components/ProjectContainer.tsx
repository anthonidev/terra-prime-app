'use client';

import { Project } from '@domain/entities/lotes/project.entity';
import { Calendar, MapPin, DollarSign, Building2, AlertCircle } from 'lucide-react';
import * as React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Alert, AlertDescription } from '@components/ui/alert';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Props {
  data: Project[];
}

export default function ProjectContainer({ data }: Props) {
  const router = useRouter();

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No se encontraron proyectos activos. Contacta al administrador si esto es inesperado.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((project) => (
        <Card
          key={project.id}
          onClick={() => router.push(`/ventas/lotes/detalle/${project.name}/${project.id}`)}
          className="group relative cursor-pointer overflow-hidden border-0 bg-white py-0 shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-900"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#025864]/5 via-transparent to-[#00CA7C]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <CardHeader className="relative bg-gradient-to-r from-[#025864] to-[#00CA7C] p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <CardTitle className="mb-2 text-lg leading-tight font-semibold transition-colors group-hover:text-yellow-100">
                  {project.name}
                </CardTitle>
                {project.projectCode && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 opacity-75" />
                    <span className="text-sm font-medium opacity-90">{project.projectCode}</span>
                  </div>
                )}
              </div>
              <Badge
                variant="secondary"
                className="border-white/30 bg-white/20 text-white backdrop-blur-sm"
              >
                {project.currency}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            {project.logo ? (
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 p-3 shadow-inner dark:from-gray-800 dark:to-gray-700">
                  <Image
                    width={48}
                    height={48}
                    src={project.logo}
                    alt={`Logo de ${project.name}`}
                    className="h-12 w-12 object-contain"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4" />
                    <span>Moneda: {project.currency}</span>
                  </div>
                  <div className="text-sm leading-relaxed text-gray-500 dark:text-gray-500">
                    Proyecto inmobiliario con múltiples etapas y opciones de inversión disponibles.
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-[#025864]/10 to-[#00CA7C]/10 p-3">
                  <Building2 className="h-12 w-12 text-[#025864]" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4" />
                    <span>Moneda: {project.currency}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-500">
                    Proyecto inmobiliario con múltiples etapas y opciones de inversión disponibles.
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="px-6 pt-0 pb-6">
            <div className="flex w-full items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium">
                  {new Date(project.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#025864] transition-colors group-hover:text-[#00CA7C]">
                <span className="text-xs font-semibold">Ver detalles</span>
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
              </div>
            </div>
          </CardFooter>

          <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-transparent transition-colors duration-300 group-hover:border-[#00CA7C]/30" />
        </Card>
      ))}
    </div>
  );
}
