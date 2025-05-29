'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lead } from '@/types/leads.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Building2,
  Calendar,
  Clock,
  CreditCard,
  Edit,
  FileText,
  LogOut,
  Mail,
  MapPin,
  Phone,
  User
} from 'lucide-react';

interface LeadDetailHeaderProps {
  lead: Lead | null;
  onEditClick: () => void;
  onRegisterDeparture: () => Promise<boolean>;
  isUpdating: boolean;
}

export default function LeadDetailHeader({
  lead,
  onEditClick,
  onRegisterDeparture,
  isUpdating
}: LeadDetailHeaderProps) {
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

  const getLatestVisit = () => {
    if (!lead.visits || lead.visits.length === 0) return null;
    return lead.visits[0];
  };

  const latestVisit = getLatestVisit();

  return (
    <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <CardContent className="p-6">
        {/* Main Header */}
        <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Lead Information */}
          <div className="flex-1">
            {/* Primary Info */}
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {lead.firstName} {lead.lastName}
                  </h1>
                  {/* Status Badge */}
                  {lead.isInOffice ? (
                    <Badge className="border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-300">
                      <MapPin className="mr-1 h-3 w-3" />
                      En oficina
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      No en oficina
                    </Badge>
                  )}
                </div>
                {/* Document & Age Info */}
                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">{lead.documentType}:</span>
                    <span>{lead.document}</span>
                  </div>
                  {lead.age && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{lead.age} años</span>
                      </div>
                    </>
                  )}
                </div>
                {/* Visit Info */}
                {lead.isInOffice && latestVisit && (
                  <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">
                        En oficina desde: {formatTime(latestVisit.arrivalTime)}
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        ({formatDate(latestVisit.arrivalTime)})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 lg:min-w-[200px]">
            <Button
              onClick={onEditClick}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar información
            </Button>
            {lead.isInOffice && latestVisit && (
              <Button
                variant="outline"
                onClick={onRegisterDeparture}
                disabled={isUpdating}
                className="w-full border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-900/40"
              >
                {isUpdating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Registrar salida
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Información de contacto
              </h3>
            </div>
            <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono principal</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{lead.phone}</p>
                  </div>
                </div>
              )}
              {lead.phone2 && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono alternativo</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{lead.phone2}</p>
                  </div>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Correo electrónico</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{lead.email}</p>
                  </div>
                </div>
              )}
              {!lead.phone && !lead.phone2 && !lead.email && (
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">No hay información de contacto registrada</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Información adicional
              </h3>
            </div>
            <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              {lead.source && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fuente de lead</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {lead.source.name}
                    </p>
                  </div>
                </div>
              )}
              {lead.ubigeo && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ubicación</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {lead.ubigeo.name}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de registro</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="cursor-help font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(lead.createdAt)}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{formatDateTime(lead.createdAt)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
