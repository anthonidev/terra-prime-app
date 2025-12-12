'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSaleDetail } from '../../hooks/use-sale-detail';
import { SaleDetailHeader } from '../sale-detail/sale-detail-header';
import { SaleDetailInfo } from '../sale-detail/sale-detail-info';
import { SaleDetailTabs } from '../sale-detail/sale-detail-tabs';

export function SaleDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const saleId = params.saleId as string;
  const { data, isLoading, isError } = useSaleDetail(saleId);
  const [activeTab, setActiveTab] = useState('lot');

  const handlePaymentSuccess = () => {
    setActiveTab('payments');
  };

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

      <SaleDetailHeader data={data} />
      <SaleDetailInfo data={data} />
      <SaleDetailTabs
        data={data}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
