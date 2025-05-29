'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Lead } from '@/types/leads.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, History, MapPin, Timer, User, Users } from 'lucide-react';

interface LeadVisitsProps {
  lead: Lead | null;
}

export default function LeadVisits({ lead }: LeadVisitsProps) {
  if (!lead) return null;

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd MMMM yyyy', { locale: es });
  };

  const formatTime = (dateStr: string) => {
    return format(new Date(dateStr), 'HH:mm', { locale: es });
  };

  const formatDateTime = (dateStr: string) => {
    return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', { locale: es });
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

  const getVisitStatusBadge = (visit: any, index: number) => {
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

  // Empty state
  if (!lead.visits || lead.visits.length === 0) {
    return (
      <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Historial de visitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <History className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              Sin visitas registradas
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Este lead aún no tiene visitas registradas en el sistema
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Historial de visitas
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {lead.visits.length} visita{lead.visits.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-800/50">
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Hora de entrada
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Hora de salida
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Duración
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Registrado por
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                  Estado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lead.visits.map((visit, index) => (
                <TableRow
                  key={visit.id}
                  className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    index === 0 && !visit.departureTime ? 'bg-green-50/50 dark:bg-green-950/20' : ''
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(visit.arrivalTime)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(visit.arrivalTime)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatTime(visit.arrivalTime)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {visit.departureTime ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatTime(visit.departureTime)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Pendiente</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {calculateDuration(visit.arrivalTime, visit.departureTime ?? null)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {visit.liner ? (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {visit.liner.firstName} {visit.liner.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {visit.liner.documentType}: {visit.liner.document}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400">
                        <User className="h-4 w-4" />
                        <span className="text-sm">No registrado</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getVisitStatusBadge(visit, index)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards View */}
        <div className="space-y-4 p-6 md:hidden">
          {lead.visits.map((visit, index) => (
            <Card
              key={visit.id}
              className={`border transition-all ${
                index === 0 && !visit.departureTime
                  ? 'border-green-200 bg-green-50/30 dark:border-green-800 dark:bg-green-950/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(visit.arrivalTime)}
                    </span>
                  </div>
                  {getVisitStatusBadge(visit, index)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-3.5 w-3.5 text-green-500" />
                      <span>Entrada: {formatTime(visit.arrivalTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-3.5 w-3.5 text-red-500" />
                      <span>
                        Salida:{' '}
                        {visit.departureTime ? formatTime(visit.departureTime) : 'Pendiente'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Timer className="h-3.5 w-3.5 text-blue-500" />
                      <span>
                        Duración:{' '}
                        {calculateDuration(visit.arrivalTime, visit.departureTime ?? null)}
                      </span>
                    </div>
                  </div>

                  {visit.liner && (
                    <div className="mt-3 rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400">Registrado por:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {visit.liner.firstName} {visit.liner.lastName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
