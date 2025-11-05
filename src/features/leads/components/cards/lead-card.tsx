'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, Calendar, CreditCard, Download, Eye, Home, Mail, Phone } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import type { DocumentType, Lead } from '../../types';

interface LeadCardProps {
  lead: Lead;
  onDownloadReport: (url: string, leadName: string) => void;
}

const documentTypeLabels: Record<DocumentType, string> = {
  DNI: 'DNI',
  CE: 'C.E.',
  PASSPORT: 'Pasaporte',
  RUC: 'RUC',
};

export function LeadCard({ lead, onDownloadReport }: LeadCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with name and location */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium truncate">
                  {lead.firstName} {lead.lastName}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge variant="outline" className="text-xs font-mono">
                    {documentTypeLabels[lead.documentType]}
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
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 gap-2 text-xs">
            {lead.email && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{lead.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>{format(new Date(lead.createdAt), 'dd/MM/yyyy', { locale: es })}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {lead.reportPdfUrl ? (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8"
                onClick={() =>
                  onDownloadReport(lead.reportPdfUrl!, `${lead.firstName}-${lead.lastName}`)
                }
              >
                <Download className="mr-2 h-3.5 w-3.5" />
                Reporte
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="flex-1 h-8" disabled>
                <Download className="mr-2 h-3.5 w-3.5 opacity-50" />
                Sin reporte
              </Button>
            )}

            <Link href={`/leads/detalle/${lead.id}`} className="flex-1">
              <Button size="sm" variant="default" className="w-full h-8">
                <Eye className="mr-2 h-3.5 w-3.5" />
                Ver detalle
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
