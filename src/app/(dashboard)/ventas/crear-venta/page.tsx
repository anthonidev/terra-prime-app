import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import CreateSaleWizard from './components/CreateSaleWizard';
import CreateSaleLoading from './loading';

export default function CreateSalePage() {
  return (
    <div className="container py-8">
      <PageHeader
        title="Crear Venta"
        subtitle="Registra una nueva venta siguiendo el proceso paso a paso"
        variant="gradient"
        className="mb-6"
      />

      <Suspense fallback={<CreateSaleLoading />}>
        <CreateSaleWizard />
      </Suspense>
    </div>
  );
}
