'use client';

import { AlertCircle } from 'lucide-react';
import SaleDetailHeader from './SaleDetailHeader';
import SaleFinancingInfo from './SaleFinancingInfo';
import SaleGeneralInfo from './SaleGeneralInfo';
import { SaleList } from '@domain/entities/sales/salevendor.entity';

export default function SaleDetailView({ sale }: { sale: SaleList }) {
  if (!sale) {
    return (
      <div className="bg-destructive/10 border-destructive/30 mx-auto mb-6 flex max-w-lg flex-col items-center justify-center rounded-md border p-6 text-center">
        <AlertCircle className="text-destructive mb-4 h-12 w-12" />
        <h3 className="text-destructive mb-2 text-lg font-semibold">Venta no encontrada</h3>
        <p className="text-destructive/80">
          No se pudo encontrar la información de la venta solicitada.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SaleDetailHeader sale={sale} />
      {sale.financing && <SaleFinancingInfo sale={sale} />}
      <SaleGeneralInfo sale={sale} />
    </div>
  );
}
