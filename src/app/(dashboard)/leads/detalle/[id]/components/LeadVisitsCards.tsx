'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LeadVisit } from '@/types/leads.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, History, MapPin, Timer, Users } from 'lucide-react';

type Props = {
  visits: LeadVisit[];
};

const LeadVisitsCards = ({ visits }: Props) => {
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd MMMM yyyy', { locale: es });
  };

  const formatTime = (dateStr: string) => {
    return format(new Date(dateStr), 'HH:mm', { locale: es });
  };

  const calculateDuration = (arrivalTime: string, departureTime: string | null) => {
    if (!departureTime) return 'En curso';
    const arrival = new Date(arrivalTime);
    const departure = new Date(departureTime);
    const durationMs = departure.getTime() - arrival.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getVisitStatusBadge = (visit: LeadVisit, index: number) => {
    if (!visit.departureTime && index === 0) {
      return (
        <Badge className="border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-300">
          <MapPin className="mr-1 h-3 w-3" />
          En oficina
        </Badge>
      );
    } else if (!visit.departureTime) {
      return (
        <Badge className="border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-900/40 dark:text-orange-300">
          <Clock className="mr-1 h-3 w-3" />
          Sin salida registrada
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="secondary"
          className="border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
        >
          <Clock className="mr-1 h-3 w-3" />
          Completada
        </Badge>
      );
    }
  };

  if (!visits.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <History className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            Sin visitas registradas
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Este lead aún no tiene visitas registradas en el sistema
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {visits.map((visit, index) => (
        <Card
          key={visit.id}
          className={`border transition-all ${
            index === 0 && !visit.departureTime
              ? 'border-green-200 bg-green-50/30 dark:border-green-800 dark:bg-green-950/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <CardContent className="p-4">
            {/* Header con fecha y estado */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(visit.arrivalTime)}
                </span>
              </div>
              {getVisitStatusBadge(visit, index)}
            </div>

            {/* Información de horarios */}
            <div className="mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-3.5 w-3.5 text-green-500" />
                  <span>Entrada: {formatTime(visit.arrivalTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-3.5 w-3.5 text-red-500" />
                  <span>
                    Salida: {visit.departureTime ? formatTime(visit.departureTime) : 'Pendiente'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Timer className="h-3.5 w-3.5 text-blue-500" />
                <span>
                  Duración: {calculateDuration(visit.arrivalTime, visit.departureTime ?? null)}
                </span>
              </div>
            </div>

            {/* Información del liner */}
            {visit.liner && (
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">Registrado por:</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-700">
                    <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {visit.liner.firstName} {visit.liner.lastName}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {visit.liner.documentType}: {visit.liner.document}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Si no hay liner registrado */}
            {!visit.liner && (
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="h-3.5 w-3.5" />
                  <span>No hay liner registrado para esta visita</span>
                </div>
              </div>
            )}

            {/* ID de la visita (pequeño y discreto) */}
            <div className="mt-3 border-t border-gray-100 pt-2 dark:border-gray-800">
              <p className="text-xs text-gray-400">ID: {visit.id.substring(0, 8)}...</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LeadVisitsCards;
