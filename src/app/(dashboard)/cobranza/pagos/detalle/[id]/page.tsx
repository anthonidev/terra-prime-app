'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { FileText } from 'lucide-react';
import { useParams } from 'next/navigation';
import * as React from 'react';
import PaymentInfoSection from './components/PaymentInfoSection';
import PaymentDetailSection from './components/PaymentDetailSection';
import PaymentImagesSection from './components/PaymentImagesSection';
import { PaymentDetailSkeleton } from './components/PaymentDetailSkeleton';
import NotFound from './not-found';
import { usePagoDetail } from '../../hooks/usePagoDetail';
import { PaymentImageViewer } from './components/PaymentImageViewer';

export default function Page() {
  const params = useParams<{ id: string }>();
  const paymentId = Number(params.id);
  const [selectedImageUrl, setSelectedImageUrl] = React.useState<string | null>(null);

  const { payment, isLoading } = usePagoDetail(paymentId);

  const handleImageClick = (url: string) => setSelectedImageUrl(url);
  const handleCloseImageViewer = () => setSelectedImageUrl(null);

  if (isLoading) return <PaymentDetailSkeleton />;
  if (!payment) return <NotFound />;

  return (
    <div className="container py-8">
      <PageHeader
        title={`Detalle de Pago #${payment.id}`}
        subtitle="Información detallada del pago administrativo"
        variant="gradient"
        icon={FileText}
        backUrl="/cobranza/pagos"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PaymentInfoSection payment={payment} />
          <PaymentDetailSection payment={payment} />
        </div>

        <PaymentImagesSection
          images={payment.vouchers}
          onImageClick={handleImageClick}
          currencyType={payment.currency}
        />

        {selectedImageUrl && (
          <PaymentImageViewer imageUrl={selectedImageUrl} onClose={handleCloseImageViewer} />
        )}
      </div>
    </div>
  );
}
