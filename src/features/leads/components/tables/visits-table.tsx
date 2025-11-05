'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, ExternalLink, FileText, LogOut, RefreshCw, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useConfirmation } from '@/shared/hooks/use-confirmation';
import { useMediaQuery } from '@/shared/hooks/use-media-query';

import { VisitCard } from '../cards/visit-card';
import { useGenerateReport } from '../../hooks/use-generate-report';
import { useRegenerateReport } from '../../hooks/use-regenerate-report';
import { useRegisterDeparture } from '../../hooks/use-register-departure';
import type { LeadVisit } from '../../types';

interface VisitsTableProps {
  visits: LeadVisit[];
  leadId: string;
  onAssignParticipants: (visit: LeadVisit) => void;
}

export function VisitsTable({ visits, leadId, onAssignParticipants }: VisitsTableProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { confirm, ConfirmationDialog } = useConfirmation();
  const registerDeparture = useRegisterDeparture(leadId);
  const generateReport = useGenerateReport(leadId);
  const regenerateReport = useRegenerateReport(leadId);

  const formatDateTime = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const handleRegisterDeparture = async (visitId: string) => {
    const confirmed = await confirm({
      title: 'Registrar Hora de Salida',
      description: '¿Está seguro de registrar la hora de salida para esta visita?',
      confirmText: 'Registrar',
      cancelText: 'Cancelar',
      variant: 'default',
    });

    if (confirmed) {
      registerDeparture.mutate();
    }
  };

  const handleGenerateReport = (visitId: string) => {
    generateReport.mutate(visitId);
  };

  const handleRegenerateReport = async (visitId: string) => {
    const confirmed = await confirm({
      title: 'Regenerar Reporte',
      description: '¿Está seguro de regenerar el reporte? Esto reemplazará el reporte existente.',
      confirmText: 'Regenerar',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (confirmed) {
      regenerateReport.mutate(visitId);
    }
  };

  if (!visits || visits.length === 0) {
    return (
      <>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base">Historial de Visitas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-3 text-center py-8">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Sin visitas registradas</p>
                <p className="text-xs text-muted-foreground">
                  No se han registrado visitas para este lead
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <ConfirmationDialog />
      </>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base">
              Historial de Visitas ({visits.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="space-y-3">
              {visits.map((visit) => (
                <VisitCard
                  key={visit.id}
                  visit={visit}
                  onRegisterDeparture={handleRegisterDeparture}
                  onGenerateReport={handleGenerateReport}
                  onRegenerateReport={handleRegenerateReport}
                  onAssignParticipants={onAssignParticipants}
                  isRegisteringDeparture={registerDeparture.isPending}
                  isGeneratingReport={generateReport.isPending}
                  isRegeneratingReport={regenerateReport.isPending}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Llegada</TableHead>
                    <TableHead className="text-xs">Salida</TableHead>
                    <TableHead className="text-xs">Estado</TableHead>
                    <TableHead className="text-xs">Reporte</TableHead>
                    <TableHead className="text-xs">Participantes</TableHead>
                    <TableHead className="text-xs text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.map((visit) => {
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
                      <TableRow key={visit.id}>
                        <TableCell className="text-xs">
                          {formatDateTime(visit.arrivalTime)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {visit.departureTime ? (
                            formatDateTime(visit.departureTime)
                          ) : (
                            <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
                              En curso
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {visit.departureTime ? (
                            <Badge variant="secondary" className="text-xs">Finalizada</Badge>
                          ) : (
                            <Badge variant="default" className="text-xs bg-success">Activa</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {visit.reportPdfUrl ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => window.open(visit.reportPdfUrl!, '_blank')}
                            >
                              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                              Ver PDF
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-xs">Sin reporte</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={hasParticipants ? 'default' : 'outline'} className="text-xs">
                            {hasParticipants ? 'Asignados' : 'Sin asignar'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            {!visit.departureTime && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRegisterDeparture(visit.id)}
                                disabled={registerDeparture.isPending}
                                className="h-8 w-8 p-0"
                                title="Registrar hora de salida"
                              >
                                <LogOut className="h-3.5 w-3.5" />
                              </Button>
                            )}

                            {!visit.reportPdfUrl ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateReport(visit.id)}
                                disabled={generateReport.isPending}
                                className="h-8 w-8 p-0"
                                title="Generar reporte"
                              >
                                <FileText className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRegenerateReport(visit.id)}
                                disabled={regenerateReport.isPending}
                                className="h-8 w-8 p-0"
                                title="Regenerar reporte"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onAssignParticipants(visit)}
                              className="h-8 w-8 p-0"
                              title="Asignar participantes"
                            >
                              <Users className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <ConfirmationDialog />
    </>
  );
}
