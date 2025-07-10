import { PageHeader } from '@/components/common/PageHeader';
import { getPaymentByCollector } from '@infrastructure/server-actions/cobranza.actions';
import { notFound } from 'next/navigation';
import PaymentDetailSection from './components/PaymentDetailSection';
import PaymentImagesSection from './components/PaymentImagesSection';
import PaymentInfoSection from './components/PaymentInfoSection';

interface PaymentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentDetailPage({ params }: PaymentDetailPageProps) {
  const { id } = await params;
  const paymentId = parseInt(id);

  if (isNaN(paymentId)) notFound();

  const payment = await getPaymentByCollector(paymentId);

  if (!payment) notFound();

  return (
    <div className="container py-8">
      <PageHeader
        title={`Detalle de Pago #${payment.id}`}
        subtitle="Información detallada del pago administrativo"
        variant="gradient"
        // icon={FileText}
        backUrl="/cobranza/pagos"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PaymentInfoSection payment={payment} />
          <PaymentDetailSection payment={payment} />
        </div>

        <PaymentImagesSection images={payment.vouchers} currencyType={payment.currency} />
      </div>
    </div>
  );
}
