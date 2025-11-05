'use client';

import { Edit, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Lead } from '../../types';

interface LeadDetailHeaderProps {
  lead: Lead;
  onEdit: () => void;
}

export function LeadDetailHeader({ lead, onEdit }: LeadDetailHeaderProps) {
  const fullName = `${lead.firstName} ${lead.lastName}`;

  return (
    <div className="flex items-center justify-between border-b border-border pb-4">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{fullName}</h1>
          <p className="text-muted-foreground mt-1">
            {lead.documentType}: {lead.document}
          </p>
        </div>
        <Badge
          variant={lead.isActive ? 'default' : 'secondary'}
          className="flex items-center gap-1"
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
          <Badge variant="outline" className="bg-success/10 text-success">
            En Oficina
          </Badge>
        )}
      </div>
      <Button onClick={onEdit} variant="outline" className="gap-2">
        <Edit className="h-4 w-4" />
        Editar Lead
      </Button>
    </div>
  );
}
