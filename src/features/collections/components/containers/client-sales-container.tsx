'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClientSales } from '../../hooks/use-client-sales';
import { ClientSalesHeader } from '../client-sales-header';
import { ClientSalesList } from '../client-sales-list';

export function ClientSalesContainer() {
  const params = useParams();
  const router = useRouter();
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
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <ClientSalesHeader client={data.client} />
      <ClientSalesList sales={data.items} clientId={clientId} />
    </div>
  );
}
