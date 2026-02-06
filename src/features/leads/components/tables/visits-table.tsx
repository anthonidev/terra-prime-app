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
    console.log('visitId', visitId);
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
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <Clock className="text-primary h-4 w-4" />
              </div>
              <CardTitle className="text-base">Historial de Visitas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <div className="bg-muted/50 flex h-12 w-12 items-center justify-center rounded-full">
                <Clock className="text-muted-foreground h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Sin visitas registradas</p>
                <p className="text-muted-foreground text-xs">
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
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <Clock className="text-primary h-4 w-4" />
            </div>
            <CardTitle className="text-base">Historial de Visitas ({visits.length})</CardTitle>
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
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-xs font-medium">Llegada</TableHead>
                    <TableHead className="text-xs font-medium">Salida</TableHead>
                    <TableHead className="text-xs font-medium">Estado</TableHead>
                    <TableHead className="text-xs font-medium">Reporte</TableHead>
                    <TableHead className="text-xs font-medium">Participantes</TableHead>
                    <TableHead className="text-right text-xs font-medium">Acciones</TableHead>
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
                      visit.closer ||
                      visit.generalDirector
                    );

                    return (
                      <TableRow key={visit.id} className="hover:bg-muted/5">
                        <TableCell className="text-xs font-medium">
                          {formatDateTime(visit.arrivalTime)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {visit.departureTime ? (
                            formatDateTime(visit.departureTime)
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-warning/10 text-warning border-warning/20 text-[10px] font-medium shadow-none"
                            >
                              En curso
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {visit.departureTime ? (
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-medium shadow-none"
                            >
                              Finalizada
                            </Badge>
                          ) : (
                            <Badge
                              variant="default"
                              className="bg-success/10 text-success hover:bg-success/20 border-success/20 text-[10px] font-medium shadow-none"
                            >
                              Activa
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {visit.reportPdfUrl ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs"
                              onClick={() => window.open(visit.reportPdfUrl!, '_blank')}
                            >
                              <ExternalLink className="mr-1.5 h-3 w-3" />
                              Ver PDF
                            </Button>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground text-[10px] font-normal shadow-none"
                            >
                              Sin reporte
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={hasParticipants ? 'default' : 'outline'}
                            className={
                              hasParticipants
                                ? 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-[10px] font-medium shadow-none'
                                : 'text-muted-foreground text-[10px] font-normal shadow-none'
                            }
                          >
                            {hasParticipants ? 'Asignados' : 'Sin asignar'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            {!visit.departureTime && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRegisterDeparture(visit.id)}
                                disabled={registerDeparture.isPending}
                                className="h-8 w-8"
                                title="Registrar hora de salida"
                              >
                                <LogOut className="h-4 w-4" />
                              </Button>
                            )}

                            {!visit.reportPdfUrl ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleGenerateReport(visit.id)}
                                disabled={generateReport.isPending}
                                className="h-8 w-8"
                                title="Generar reporte"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRegenerateReport(visit.id)}
                                disabled={regenerateReport.isPending}
                                className="h-8 w-8"
                                title="Regenerar reporte"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onAssignParticipants(visit)}
                              className="h-8 w-8"
                              title="Asignar participantes"
                            >
                              <Users className="h-4 w-4" />
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
