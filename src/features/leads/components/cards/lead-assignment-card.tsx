'use client';

import Link from 'next/link';
import { Building2, Eye, Mail, Phone, UserPlus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

import type { Lead } from '../../types';

interface LeadAssignmentCardProps {
  lead: Lead;
  onAssign: (lead: Lead) => void;
  isSelected: boolean;
  onSelect: (leadId: string, isSelected: boolean) => void;
}

export function LeadAssignmentCard({
  lead,
  onAssign,
  isSelected,
  onSelect,
}: LeadAssignmentCardProps) {
  const hasVendor = !!lead.vendor;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header: Checkbox + Nombre + Estado */}
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelect(lead.id, checked === true)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold truncate">
                {lead.firstName} {lead.lastName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="outline" className="text-xs font-mono">
                  {lead.documentType}
                </Badge>
                <span className="text-xs text-muted-foreground">{lead.document}</span>
              </div>
            </div>
            {lead.isInOffice && (
              <Badge className="text-xs bg-success text-success-foreground shrink-0">
                <Building2 className="mr-1 h-3 w-3" />
                En Oficina
              </Badge>
            )}
          </div>

          {/* Contacto */}
          {(lead.email || lead.phone) && (
            <div className="space-y-1 text-xs">
              {lead.email && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{lead.email}</span>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{lead.phone}</span>
                </div>
              )}
            </div>
          )}

          {/* Proyectos de interés */}
          {lead.interestProjects && lead.interestProjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {lead.interestProjects.slice(0, 2).map((project, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {project}
                </Badge>
              ))}
              {lead.interestProjects.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{lead.interestProjects.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Vendedor Asignado */}
          {hasVendor ? (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Vendedor Asignado:</p>
              <div className="text-xs font-medium">
                {lead.vendor!.firstName} {lead.vendor!.lastName}
              </div>
              <div className="text-xs text-muted-foreground">{lead.vendor!.document}</div>
            </div>
          ) : (
            <Badge variant="secondary" className="text-xs w-fit">
              Sin vendedor asignado
            </Badge>
          )}

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8"
              onClick={() => onAssign(lead)}
            >
              <UserPlus className="mr-2 h-3.5 w-3.5" />
              {hasVendor ? 'Reasignar' : 'Asignar'}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <Link href={`/leads/detalle/${lead.id}`}>
                <Eye className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
