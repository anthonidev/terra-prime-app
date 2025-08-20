'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BasicVendor, LeadsOfDay } from '@domain/entities/sales/leadsvendors.entity';
import {
  User,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Users,
  Heart,
  File,
  CheckCircle,
  XCircle,
  Building
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadsOfDay;
}

export default function LeadDetailModal({ isOpen, onClose, lead }: LeadDetailModalProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const getParticipantInfo = (participant: BasicVendor | null) => {
    if (!participant) return null;
    return `${participant.firstName} ${participant.lastName}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalles del Lead
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre completo</p>
                  <p className="text-sm">
                    {lead.firstName} {lead.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{lead.email || 'No registrado'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Documento</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">
                      {lead.documentType}: {lead.document}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Edad</p>
                  <p className="text-sm">{lead.age} años</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Teléfonos</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-sm">{lead.phone}</p>
                    </div>
                    {lead.phone2 && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{lead.phone2}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <div className="flex items-center gap-2">
                    {lead.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <Badge variant={lead.isActive ? 'default' : 'secondary'}>
                      {lead.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">En oficina</p>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <Badge variant={lead.isInOffice ? 'default' : 'outline'}>
                      {lead.isInOffice ? 'Sí' : 'No'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proyectos de Interés */}
          {lead.interestProjects && lead.interestProjects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5" />
                  Proyectos de Interés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lead.interestProjects.map((project, index) => (
                    <Badge key={index} variant="outline">
                      {project}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información del Acompañante */}
          {(lead.companionFullName || lead.companionDni || lead.companionRelationship) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Información del Acompañante
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre completo</p>
                  <p className="text-sm">{lead.companionFullName || 'No registrado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">DNI</p>
                  <p className="text-sm">{lead.companionDni || 'No registrado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Relación</p>
                  <p className="text-sm">{lead.companionRelationship || 'No registrada'}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          {lead.metadata && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="h-5 w-5" />
                  Información Adicional
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado civil</p>
                  <p className="text-sm">{lead.metadata.estadoCivil || 'No registrado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Cantidad de hijos</p>
                  <p className="text-sm">{lead.metadata.cantidadHijos ?? 'No registrado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tarjetas de crédito</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={lead.metadata.tieneTarjetasCredito ? 'default' : 'outline'}>
                      {lead.metadata.tieneTarjetasCredito ? 'Sí' : 'No'}
                    </Badge>
                    {lead.metadata.tieneTarjetasCredito && (
                      <span className="text-sm text-gray-500">
                        ({lead.metadata.cantidadTarjetasCredito || 0})
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tarjetas de débito</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={lead.metadata.tieneTarjetasDebito ? 'default' : 'outline'}>
                      {lead.metadata.tieneTarjetasDebito ? 'Sí' : 'No'}
                    </Badge>
                    {lead.metadata.tieneTarjetasDebito && (
                      <span className="text-sm text-gray-500">
                        ({lead.metadata.cantidadTarjetasDebito || 0})
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Visitas */}
          {lead.visits && lead.visits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  Historial de Visitas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lead.visits.map((visit) => (
                    <div
                      key={visit.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <p className="text-sm font-medium">
                            Llegada: {formatDate(visit.arrivalTime)}
                          </p>
                        </div>
                        {visit.departureTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <p className="text-sm">Salida: {formatDate(visit.departureTime)}</p>
                          </div>
                        )}
                        {visit.observations && (
                          <p className="text-sm text-gray-600">{visit.observations}</p>
                        )}
                      </div>
                      <Badge variant={visit.departureTime ? 'secondary' : 'default'}>
                        {visit.departureTime ? 'Finalizada' : 'En curso'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Participantes Asignados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Participantes Asignados
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Vendedor</p>
                <p className="text-sm">{getParticipantInfo(lead.vendor) || 'No asignado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Liner</p>
                <p className="text-sm">{getParticipantInfo(lead.liner) || 'No asignado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Supervisor Telemarketing</p>
                <p className="text-sm">
                  {getParticipantInfo(lead.telemarketingSupervisor) || 'No asignado'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Confirmador</p>
                <p className="text-sm">
                  {getParticipantInfo(lead.telemarketingConfirmer) || 'No asignado'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Telemarketer</p>
                <p className="text-sm">{getParticipantInfo(lead.telemarketer) || 'No asignado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Jefe de Campo</p>
                <p className="text-sm">{getParticipantInfo(lead.fieldManager) || 'No asignado'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Supervisor de Campo</p>
                <p className="text-sm">
                  {getParticipantInfo(lead.fieldSupervisor) || 'No asignado'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Vendedor de Campo</p>
                <p className="text-sm">{getParticipantInfo(lead.fieldSeller) || 'No asignado'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Ubicación y Fuente */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{lead.ubigeo?.name || 'No registrada'}</p>
                {lead.ubigeo?.code && (
                  <p className="text-xs text-gray-500">Código: {lead.ubigeo.code}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5" />
                  Fuente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{lead.source?.name || 'No especificada'}</p>
              </CardContent>
            </Card>
          </div>

          {/* Reporte PDF */}
          {lead.reportPdfUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <File className="h-5 w-5" />
                  Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={lead.reportPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <File className="h-4 w-4" />
                  Ver reporte de bienvenida
                </a>
              </CardContent>
            </Card>
          )}

          {/* Información de Registro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Información de Registro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                <span className="font-medium">Fecha de registro:</span> {formatDate(lead.createdAt)}
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
