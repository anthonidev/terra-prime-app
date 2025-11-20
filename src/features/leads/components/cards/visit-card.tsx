'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  LogOut,
  RefreshCw,
  Users,
  XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import type { LeadVisit } from '../../types';

interface VisitCardProps {
  visit: LeadVisit;
  onRegisterDeparture: (visitId: string) => void;
  onGenerateReport: (visitId: string) => void;
  onRegenerateReport: (visitId: string) => void;
  onAssignParticipants: (visit: LeadVisit) => void;
  isRegisteringDeparture?: boolean;
  isGeneratingReport?: boolean;
  isRegeneratingReport?: boolean;
}

export function VisitCard({
  visit,
  onRegisterDeparture,
  onGenerateReport,
  onRegenerateReport,
  onAssignParticipants,
  isRegisteringDeparture,
  isGeneratingReport,
  isRegeneratingReport,
}: VisitCardProps) {
  const formatDateTime = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const hasParticipants = !!(
    visit.linerParticipant ||
    visit.telemarketer ||
    visit.telemarketingSupervisor ||
    visit.telemarketingConfirmer ||
    visit.fieldManager ||
    visit.fieldSupervisor ||
    visit.fieldSeller ||
    visit.salesManager ||
    visit.salesGeneralManager ||
    visit.postSale ||
    visit.closer
  );

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with status */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {visit.departureTime ? (
                <Badge variant="secondary" className="text-xs">
                  <XCircle className="mr-1 h-3 w-3" />
                  Finalizada
                </Badge>
              ) : (
                <Badge variant="default" className="bg-success text-xs">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Activa
                </Badge>
              )}
            </div>
            <Badge variant={hasParticipants ? 'default' : 'outline'} className="text-xs">
              {hasParticipants ? 'Asignados' : 'Sin asignar'}
            </Badge>
          </div>

          {/* Visit times */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-muted-foreground mb-1 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium">Llegada</span>
              </div>
              <p className="text-foreground">{formatDateTime(visit.arrivalTime)}</p>
            </div>
            <div>
              <div className="text-muted-foreground mb-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span className="font-medium">Salida</span>
              </div>
              {visit.departureTime ? (
                <p className="text-foreground">{formatDateTime(visit.departureTime)}</p>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-warning/10 text-warning border-warning/20 text-xs"
                >
                  En curso
                </Badge>
              )}
            </div>
          </div>

          {/* Report status */}
          {visit.reportPdfUrl && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex-1"
                onClick={() => window.open(visit.reportPdfUrl!, '_blank')}
              >
                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                Ver PDF
              </Button>
            </div>
          )}

          {/* Divider */}
          <div className="bg-border h-px" />

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            {!visit.departureTime && (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => onRegisterDeparture(visit.id)}
                disabled={isRegisteringDeparture}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Salida
              </Button>
            )}

            {!visit.reportPdfUrl ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => onGenerateReport(visit.id)}
                disabled={isGeneratingReport}
              >
                <FileText className="mr-2 h-3.5 w-3.5" />
                Generar
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => onRegenerateReport(visit.id)}
                disabled={isRegeneratingReport}
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Regenerar
              </Button>
            )}

            <Button
              variant="default"
              size="sm"
              className={`h-8 ${!visit.departureTime ? 'col-span-1' : 'col-span-2'}`}
              onClick={() => onAssignParticipants(visit)}
            >
              <Users className="mr-2 h-3.5 w-3.5" />
              Participantes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
