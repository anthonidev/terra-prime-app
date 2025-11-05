'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, LogOut, FileText, RefreshCw, Users, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useConfirmation } from '@/shared/hooks/use-confirmation';
import { useRegisterDeparture } from '../../hooks/use-register-departure';
import { useGenerateReport } from '../../hooks/use-generate-report';
import { useRegenerateReport } from '../../hooks/use-regenerate-report';
import type { LeadVisit } from '../../types';

interface VisitsTableProps {
  visits: LeadVisit[];
  leadId: string;
  onAssignParticipants: (visit: LeadVisit) => void;
}

export function VisitsTable({ visits, leadId, onAssignParticipants }: VisitsTableProps) {
  const { confirm, ConfirmationDialog } = useConfirmation();
  const registerDeparture = useRegisterDeparture(leadId);
  const generateReport = useGenerateReport(leadId);
  const regenerateReport = useRegenerateReport(leadId);

  const formatDateTime = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Historial de Visitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              No se han registrado visitas para este lead
            </p>
          </CardContent>
        </Card>
        <ConfirmationDialog />
      </>
    );
  }

  return (
    <>
      <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Historial de Visitas ({visits.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-table-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-table-header hover:bg-table-header">
                <TableHead className="text-table-header-foreground">Fecha de Llegada</TableHead>
                <TableHead className="text-table-header-foreground">Fecha de Salida</TableHead>
                <TableHead className="text-table-header-foreground">Estado</TableHead>
                <TableHead className="text-table-header-foreground">Reporte</TableHead>
                <TableHead className="text-table-header-foreground">Participantes</TableHead>
                <TableHead className="text-table-header-foreground text-right">Acciones</TableHead>
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
                  <TableRow key={visit.id} className="bg-table-row hover:bg-table-row-hover">
                    <TableCell className="text-table-row-foreground">
                      {formatDateTime(visit.arrivalTime)}
                    </TableCell>
                    <TableCell className="text-table-row-foreground">
                      {visit.departureTime ? (
                        formatDateTime(visit.departureTime)
                      ) : (
                        <Badge variant="outline" className="bg-warning/10 text-warning">
                          En curso
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {visit.departureTime ? (
                        <Badge variant="secondary">Finalizada</Badge>
                      ) : (
                        <Badge variant="default" className="bg-success">Activa</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {visit.reportPdfUrl ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => window.open(visit.reportPdfUrl!, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Ver PDF
                        </Button>
                      ) : (
                        <Badge variant="outline">Sin reporte</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={hasParticipants ? 'default' : 'outline'}>
                        {hasParticipants ? 'Asignados' : 'Sin asignar'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {!visit.departureTime && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRegisterDeparture(visit.id)}
                            disabled={registerDeparture.isPending}
                            title="Registrar hora de salida"
                          >
                            <LogOut className="h-4 w-4" />
                          </Button>
                        )}

                        {!visit.reportPdfUrl ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateReport(visit.id)}
                            disabled={generateReport.isPending}
                            title="Generar reporte"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRegenerateReport(visit.id)}
                            disabled={regenerateReport.isPending}
                            title="Regenerar reporte"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAssignParticipants(visit)}
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
      </CardContent>
    </Card>
    <ConfirmationDialog />
    </>
  );
}
