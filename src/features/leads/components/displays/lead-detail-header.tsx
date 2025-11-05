'use client';

import { Building2, CheckCircle, CreditCard, Edit, User, XCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { Lead } from '../../types';

interface LeadDetailHeaderProps {
  lead: Lead;
  onEdit: () => void;
}

export function LeadDetailHeader({ lead, onEdit }: LeadDetailHeaderProps) {
  const fullName = `${lead.firstName} ${lead.lastName}`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight truncate">{fullName}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className="text-xs font-mono">
              {lead.documentType}
            </Badge>
            <span className="text-xs text-muted-foreground">{lead.document}</span>
            <Badge
              variant={lead.isActive ? 'default' : 'secondary'}
              className="text-xs flex items-center gap-1"
            >
              {lead.isActive ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Activo
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  Inactivo
                </>
              )}
            </Badge>
            {lead.isInOffice && (
              <Badge className="text-xs bg-success text-success-foreground">
                <Building2 className="mr-1 h-3 w-3" />
                En Oficina
              </Badge>
            )}
          </div>
        </div>
      </div>
      <Button onClick={onEdit} variant="outline" size="sm" className="shrink-0">
        <Edit className="mr-2 h-3.5 w-3.5" />
        Editar
      </Button>
    </div>
  );
}
