'use client';

import { Suspense } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import CreateSaleWizard from '@sales/crear-venta/components/CreateSaleWizard';
import SaleSkeleton from '@sales/crear-venta/components/SaleSkeleton';
import { Box } from 'lucide-react';

export default function CreateSalePage() {
  return (
    <div className="container py-8">
      <PageHeader
        icon={Box}
        title="Crear Venta"
        subtitle="Registra una nueva venta siguiendo el proceso paso a paso"
        variant="gradient"
        className="mb-6"
      />
      <Suspense fallback={<SaleSkeleton />}>
        <CreateSaleWizard />
      </Suspense>
    </div>
  );
}
