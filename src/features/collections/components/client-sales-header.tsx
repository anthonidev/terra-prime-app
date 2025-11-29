'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/common/page-header';
import { UserInfo } from '@/shared/components/user-info';
import type { GetClientSalesResponse } from '../types';

interface ClientSalesHeaderProps {
  client: GetClientSalesResponse['client'];
}

export function ClientSalesHeader({ client }: ClientSalesHeaderProps) {
  const handleDownloadReport = () => {
    if (client.reportPdfUrl) {
      window.open(client.reportPdfUrl, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Ventas del Cliente" description="Historial de ventas y reservas">
        <Button variant="outline" onClick={handleDownloadReport} disabled={!client.reportPdfUrl}>
          <Download className="mr-2 h-4 w-4" />
          Descargar Reporte
        </Button>
      </PageHeader>

      <div className="bg-card rounded-lg border p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <UserInfo
            name={`${client.firstName} ${client.lastName}`}
            document={client.document}
            documentType={client.documentType}
            phone={client.phone}
            className="origin-left scale-110"
          />
          <div className="text-muted-foreground text-sm">
            <p>{client.address}</p>
            <p>
              {client.ubigeo.departamento}, {client.ubigeo.provincia}, {client.ubigeo.distrito}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
