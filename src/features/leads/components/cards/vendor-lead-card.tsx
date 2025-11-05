'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Phone, Calendar, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

import type { VendorLead } from '../../types';

interface VendorLeadCardProps {
  lead: VendorLead;
}

export function VendorLeadCard({ lead }: VendorLeadCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header: Nombre + Edad */}
          <div className="flex items-start justify-between gap-2">
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
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <User className="h-3 w-3" />
              <span>{lead.age} años</span>
            </div>
          </div>

          {/* Teléfonos */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{lead.phone}</span>
            </div>
            {lead.phone2 && (
              <div className="flex items-center gap-1.5 text-muted-foreground pl-5">
                <span>{lead.phone2}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Fuente + Fecha */}
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className="text-xs">
              {lead.source.name}
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {format(new Date(lead.createdAt), 'dd MMM yyyy', { locale: es })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
