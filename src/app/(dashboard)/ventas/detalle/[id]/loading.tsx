'use client';
import { PageHeader } from '@/components/common/PageHeader';
import { DollarSign } from 'lucide-react';
import SaleDetailSkeleton from './components/SaleDetailSkeleton';

export default function Loading() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Detalle de Venta"
        subtitle="Gestiona la información de la venta y sus pagos"
        className="mb-6"
        variant="gradient"
        backUrl="/ventas"
        icon={DollarSign}
      />
      <SaleDetailSkeleton />
    </div>
  );
}
