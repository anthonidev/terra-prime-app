'use client';

import { ClientSalesCard } from './client-sales-card';
import type { SaleItem } from '../types';

interface ClientSalesListProps {
  sales: SaleItem[];
  clientId: string;
}

export function ClientSalesList({ sales, clientId }: ClientSalesListProps) {
  if (sales.length === 0) {
    return (
      <div className="text-muted-foreground py-10 text-center">
        No se encontraron ventas para este cliente.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sales.map((sale) => (
        <ClientSalesCard key={sale.id} sale={sale} clientId={clientId} />
      ))}
    </div>
  );
}
