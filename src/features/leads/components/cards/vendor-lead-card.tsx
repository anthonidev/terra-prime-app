'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Phone, Calendar, User, Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import type { VendorLead } from '../../types';

interface VendorLeadCardProps {
  lead: VendorLead;
  onViewDetail: (lead: VendorLead) => void;
}

export function VendorLeadCard({ lead, onViewDetail }: VendorLeadCardProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header: Nombre + Edad */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold">
                {lead.firstName} {lead.lastName}
              </h3>
              <div className="mt-1 flex items-center gap-1.5">
                <Badge variant="outline" className="font-mono text-xs font-normal">
                  {lead.documentType}
                </Badge>
                <span className="text-muted-foreground text-xs">{lead.document}</span>
              </div>
            </div>
            <div className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-xs">
              <User className="h-3 w-3" />
              <span>{lead.age} años</span>
            </div>
          </div>

          {/* Teléfonos */}
          <div className="space-y-1 text-xs">
            <div className="text-muted-foreground flex items-center gap-1.5">
              <Phone className="h-3 w-3" />
              <span>{lead.phone}</span>
            </div>
            {lead.email && (
              <div className="text-muted-foreground flex items-center gap-1.5 pl-5">
                <span className="truncate">{lead.email}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="bg-border h-px" />

          {/* Fuente + Fecha */}
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className="bg-background text-xs font-normal">
              {lead.source.name}
            </Badge>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(lead.createdAt), 'dd MMM yyyy', { locale: es })}</span>
            </div>
          </div>

          <Button onClick={() => onViewDetail(lead)} variant="outline" size="sm" className="w-full">
            <Eye className="mr-2 h-3.5 w-3.5" />
            Ver Detalle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
