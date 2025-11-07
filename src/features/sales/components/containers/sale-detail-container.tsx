'use client';

import { useSaleDetail } from '../../hooks/use-sale-detail';
import { SaleDetailHeader } from '../displays/sale-detail-header';
import { SaleDetailInfo } from '../displays/sale-detail-info';
import { SalePaymentsTable } from '../tables/sale-payments-table';
import { SaleDetailSkeleton } from '../skeletons/sale-detail-skeleton';
import type { StatusSale } from '../../types';

interface SaleDetailContainerProps {
  id: string;
}

export function SaleDetailContainer({ id }: SaleDetailContainerProps) {
  const { data, isLoading, isError } = useSaleDetail(id);

  if (isLoading) {
    return <SaleDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64 rounded-lg border bg-card">
          <p className="text-muted-foreground">Error al cargar el detalle de la venta</p>
        </div>
      </div>
    );
  }

  const clientName = `${data.client.firstName} ${data.client.lastName}`;

  return (
    <div className="space-y-6">
      <SaleDetailHeader
        clientName={clientName}
        status={data.status as StatusSale}
        radicationPdfUrl={data.radicationPdfUrl}
        paymentAcordPdfUrl={data.paymentAcordPdfUrl}
      />

      <SaleDetailInfo sale={data} />

      <SalePaymentsTable payments={data.paymentsSummary} currency={data.currency} />
    </div>
  );
}
