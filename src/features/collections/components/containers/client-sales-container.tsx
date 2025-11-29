'use client';

import { useParams } from 'next/navigation';
import { useClientSales } from '../../hooks/use-client-sales';
import { ClientSalesHeader } from '../client-sales-header';
import { ClientSalesList } from '../client-sales-list';

export function ClientSalesContainer() {
  const params = useParams();
  const clientId = params.id as string;
  const { data, isLoading, isError } = useClientSales(clientId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Cargando información del cliente...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-destructive">Error al cargar la información</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ClientSalesHeader client={data.client} />
      <ClientSalesList sales={data.items} clientId={clientId} />
    </div>
  );
}
