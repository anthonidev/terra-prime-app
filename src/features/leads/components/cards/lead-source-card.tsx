'use client';

import { CheckCircle2, Edit, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import type { LeadSource } from '../../types';

interface LeadSourceCardProps {
  leadSource: LeadSource;
  onEdit: (leadSource: LeadSource) => void;
}

export function LeadSourceCard({ leadSource, onEdit }: LeadSourceCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with name and status */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">{leadSource.name}</h3>
            </div>
            <Badge
              variant={leadSource.isActive ? 'default' : 'secondary'}
              className="text-xs shrink-0"
            >
              {leadSource.isActive ? (
                <>
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Activo
                </>
              ) : (
                <>
                  <XCircle className="mr-1 h-3 w-3" />
                  Inactivo
                </>
              )}
            </Badge>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Creado:</span>
              <br />
              {format(new Date(leadSource.createdAt), 'dd/MM/yyyy', { locale: es })}
            </div>
            <div>
              <span className="font-medium">Actualizado:</span>
              <br />
              {format(new Date(leadSource.updatedAt), 'dd/MM/yyyy', { locale: es })}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Actions */}
          <Button
            size="sm"
            variant="outline"
            className="w-full h-8"
            onClick={() => onEdit(leadSource)}
          >
            <Edit className="mr-2 h-3.5 w-3.5" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
