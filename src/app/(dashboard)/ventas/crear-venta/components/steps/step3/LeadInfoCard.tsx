'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeadsVendor } from '@domain/entities/sales/leadsvendors.entity';

interface LeadInfoCardProps {
  lead: LeadsVendor;
}

export default function LeadInfoCard({ lead }: LeadInfoCardProps) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-xs text-blue-500">Información del Lead</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Nombre:</span>
          <span className="font-medium">
            {lead.firstName} {lead.lastName}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Documento:</span>
          <span className="font-medium">
            {lead.documentType}: {lead.document}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Edad:</span>
          <span className="font-medium">{lead.age} años</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Teléfono:</span>
          <span className="font-medium">{lead.phone}</span>
        </div>
        {lead.source && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Fuente:</span>
            <span className="font-medium">{lead.source.name}</span>
          </div>
        )}
        {lead.ubigeo && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Ubicación:</span>
            <span className="font-medium">{lead.ubigeo.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
