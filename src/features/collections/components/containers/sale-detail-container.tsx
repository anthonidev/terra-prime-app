'use client';

import { useParams } from 'next/navigation';
import { useSaleDetail } from '../../hooks/use-sale-detail';
import { SaleDetailHeader } from '../sale-detail/sale-detail-header';
import { SaleDetailInfo } from '../sale-detail/sale-detail-info';
import { SaleDetailTabs } from '../sale-detail/sale-detail-tabs';

export function SaleDetailContainer() {
  const params = useParams();
  const saleId = params.saleId as string;
  const { data, isLoading, isError } = useSaleDetail(saleId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground">Cargando detalles de la venta...</div>
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
      <SaleDetailHeader data={data} />
      <SaleDetailInfo data={data} />
      <SaleDetailTabs data={data} />
    </div>
  );
}
