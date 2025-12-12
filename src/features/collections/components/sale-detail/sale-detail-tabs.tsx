'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/shared/lib/utils';
import { InstallmentsTable } from './installments-table';
import { PaymentsSummaryTable } from './payments-summary-table';
import { PaymentsFilters } from './payments-filters';
import { InstallmentsFilter } from './installments-filter';
import { getUniqueConceptsFromPayments } from './payment-concept-config';
import type {
  GetSaleDetailResponse,
  StatusPayment,
  StatusFinancingInstallments,
} from '../../types';

interface SaleDetailTabsProps {
  data: GetSaleDetailResponse;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onPaymentSuccess?: () => void;
}

export function SaleDetailTabs({
  data,
  activeTab = 'lot',
  onTabChange,
  onPaymentSuccess,
}: SaleDetailTabsProps) {
  const { sale, paymentsSummary } = data;
  if (!sale) return null;
  const hasUrbanDevelopment = !!sale.urbanDevelopment;

  const tabsCount = hasUrbanDevelopment ? 3 : 2;

  // Check if there's any pending payment
  const hasPendingPayment = useMemo(() => {
    return paymentsSummary.some((payment) => payment.status === 'PENDING');
  }, [paymentsSummary]);

  // Payment filters state
  const [paymentStatus, setPaymentStatus] = useState<StatusPayment | 'ALL'>('ALL');
  const [paymentConcept, setPaymentConcept] = useState<string>('ALL');

  // Installments filters state
  const [lotInstallmentStatus, setLotInstallmentStatus] = useState<
    StatusFinancingInstallments | 'ALL'
  >('ALL');
  const [urbanInstallmentStatus, setUrbanInstallmentStatus] = useState<
    StatusFinancingInstallments | 'ALL'
  >('ALL');

  // Get unique concepts from payments
  const availableConcepts = useMemo(
    () => getUniqueConceptsFromPayments(paymentsSummary),
    [paymentsSummary]
  );

  // Filter payments
  const filteredPayments = useMemo(() => {
    return paymentsSummary.filter((payment) => {
      const matchesStatus = paymentStatus === 'ALL' || payment.status === paymentStatus;
      const matchesConcept = paymentConcept === 'ALL' || payment.paymentConfig === paymentConcept;
      return matchesStatus && matchesConcept;
    });
  }, [paymentsSummary, paymentStatus, paymentConcept]);

  // Filter lot installments
  const filteredLotInstallments = useMemo(() => {
    if (lotInstallmentStatus === 'ALL') return sale.financing.financingInstallments;
    return sale.financing.financingInstallments.filter(
      (installment) => installment.status === lotInstallmentStatus
    );
  }, [sale.financing.financingInstallments, lotInstallmentStatus]);

  // Filter urban development installments
  const filteredUrbanInstallments = useMemo(() => {
    if (!sale.urbanDevelopment) return [];
    if (urbanInstallmentStatus === 'ALL') return sale.urbanDevelopment.financingInstallments;
    return sale.urbanDevelopment.financingInstallments.filter(
      (installment) => installment.status === urbanInstallmentStatus
    );
  }, [sale.urbanDevelopment, urbanInstallmentStatus]);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className={`grid w-full grid-cols-${tabsCount} lg:w-auto`}>
        <TabsTrigger value="lot">Pago de Lote</TabsTrigger>
        {hasUrbanDevelopment && <TabsTrigger value="urban">Habilitación Urbana</TabsTrigger>}
        <TabsTrigger value="payments">Pagos</TabsTrigger>
      </TabsList>

      <TabsContent value="lot" className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financiamiento del Lote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-muted-foreground text-sm">Monto Total</p>
                <p className="font-medium">{formatCurrency(Number(sale.totalAmount))}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Inicial</p>
                <p className="font-medium">
                  {formatCurrency(Number(sale.financing.initialAmount))}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Cuotas</p>
                <p className="font-medium">{sale.financing.quantityCoutes}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Interés</p>
                <p className="font-medium">{sale.financing.interestRate}%</p>
              </div>
            </div>

            <InstallmentsFilter
              status={lotInstallmentStatus}
              onStatusChange={setLotInstallmentStatus}
            />

            <InstallmentsTable
              installments={filteredLotInstallments}
              financingId={sale.financing.id}
              currency={sale.currency}
              hasPendingPayment={hasPendingPayment}
              onSuccess={onPaymentSuccess}
            />
          </CardContent>
        </Card>
      </TabsContent>

      {hasUrbanDevelopment && sale.urbanDevelopment && (
        <TabsContent value="urban" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Financiamiento de Habilitación Urbana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-muted-foreground text-sm">Monto Total</p>
                  <p className="font-medium">
                    {formatCurrency(Number(sale.urbanDevelopment.amount))}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Inicial</p>
                  <p className="font-medium">
                    {formatCurrency(Number(sale.urbanDevelopment.initialAmount))}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Cuotas</p>
                  <p className="font-medium">{sale.urbanDevelopment.quantityCoutes}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Interés</p>
                  <p className="font-medium">{sale.urbanDevelopment.interestRate}%</p>
                </div>
              </div>

              <InstallmentsFilter
                status={urbanInstallmentStatus}
                onStatusChange={setUrbanInstallmentStatus}
              />

              <InstallmentsTable
                installments={filteredUrbanInstallments}
                currency={sale.currency}
                hasPendingPayment={hasPendingPayment}
                onSuccess={onPaymentSuccess}
              />
            </CardContent>
          </Card>
        </TabsContent>
      )}

      <TabsContent value="payments" className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historial de Pagos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PaymentsFilters
              status={paymentStatus}
              onStatusChange={setPaymentStatus}
              concept={paymentConcept}
              onConceptChange={setPaymentConcept}
              availableConcepts={availableConcepts}
            />
            <PaymentsSummaryTable payments={filteredPayments} currency={sale.currency} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
