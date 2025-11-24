'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, MapPin, Calendar, FileText, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { VendorLead } from '../../types';

interface VendorLeadDetailModalProps {
  lead: VendorLead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VendorLeadDetailModal({ lead, isOpen, onClose }: VendorLeadDetailModalProps) {
  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <User className="text-primary h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Detalle del Prospecto</DialogTitle>
              <DialogDescription>Información completa del lead asignado</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="grid gap-6 py-4 md:grid-cols-2">
          {/* Información Personal */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <User className="h-4 w-4" />
              Información Personal
            </h4>
            <div className="space-y-3">
              <div className="grid gap-1">
                <span className="text-muted-foreground text-xs">Nombre Completo</span>
                <span className="text-sm font-medium">
                  {lead.firstName} {lead.lastName}
                </span>
              </div>
              <div className="grid gap-1">
                <span className="text-muted-foreground text-xs">Documento</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {lead.documentType}
                  </Badge>
                  <span className="font-mono text-sm">{lead.document}</span>
                </div>
              </div>
              <div className="grid gap-1">
                <span className="text-muted-foreground text-xs">Edad</span>
                <span className="text-sm">{lead.age} años</span>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <Phone className="h-4 w-4" />
              Contacto
            </h4>
            <div className="space-y-3">
              <div className="grid gap-1">
                <span className="text-muted-foreground text-xs">Teléfono Principal</span>
                <div className="flex items-center gap-2">
                  <Phone className="text-muted-foreground h-3 w-3" />
                  <span className="text-sm">{lead.phone}</span>
                </div>
              </div>
              {lead.phone2 && (
                <div className="grid gap-1">
                  <span className="text-muted-foreground text-xs">Teléfono Secundario</span>
                  <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground h-3 w-3" />
                    <span className="text-sm">{lead.phone2}</span>
                  </div>
                </div>
              )}
              {lead.email && (
                <div className="grid gap-1">
                  <span className="text-muted-foreground text-xs">Email</span>
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-3 w-3" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ubicación y Origen */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4" />
              Ubicación y Origen
            </h4>
            <div className="space-y-3">
              <div className="grid gap-1">
                <span className="text-muted-foreground text-xs">Lugar de Residencia</span>
                <span className="text-sm">{lead.placeOfResidence}</span>
              </div>
              <div className="grid gap-1">
                <span className="text-muted-foreground text-xs">Fuente de Captación</span>
                <Badge variant="secondary" className="w-fit text-xs">
                  {lead.source.name}
                </Badge>
              </div>
              <div className="grid gap-1">
                <span className="text-muted-foreground text-xs">Fecha de Registro</span>
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-3 w-3" />
                  <span className="text-sm">
                    {format(new Date(lead.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Intereses y Notas */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <Building2 className="h-4 w-4" />
              Intereses
            </h4>
            <div className="space-y-3">
              <div className="grid gap-1">
                <span className="text-muted-foreground text-xs">Proyectos de Interés</span>
                {lead.interestProjects && lead.interestProjects.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {lead.interestProjects.map((project, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {project}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm italic">
                    No hay proyectos registrados
                  </span>
                )}
              </div>
              {lead.notes && (
                <div className="grid gap-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <FileText className="h-3 w-3" />
                    Notas
                  </span>
                  <p className="bg-muted/50 rounded-md p-2 text-sm">{lead.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
