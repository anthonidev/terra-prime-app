'use client';

import { Building2, CheckCircle, Edit, User, XCircle } from 'lucide-react';

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
    <div className="flex flex-col justify-between gap-3 border-b pb-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <User className="text-primary h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold tracking-tight">{fullName}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {lead.documentType}
            </Badge>
            <span className="text-muted-foreground text-xs">{lead.document}</span>
            <Badge
              variant={lead.isActive ? 'default' : 'secondary'}
              className="flex items-center gap-1 text-xs"
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
              <Badge className="bg-success text-success-foreground text-xs">
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
