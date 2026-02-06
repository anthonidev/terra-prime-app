'use client';

import { motion } from 'framer-motion';
import { CreditCard, Landmark, Building2, FolderOpen } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { SalePaymentsTable } from '../../tables/sale-payments-table';
import { PaymentCardsView } from './payment-cards-view';
import { SaleInstallmentsTabContent } from './sale-installments-tab-content';
import { PaymentSummaryByConfig } from '../../displays/payment-summary-by-config';
import { SaleDocumentsTab } from './sale-documents-tab';
import type { PaymentSummary, SaleDetailFinancing, CurrencyType } from '../../../types';

interface SaleDetailTabsProps {
  payments: PaymentSummary[];
  financing: SaleDetailFinancing | null;
  currency: CurrencyType;
  hasPayments: boolean;
  saleId: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  canRegisterInstallmentPayment?: boolean;
}

export function SaleDetailTabs({
  payments,
  financing,
  currency,
  hasPayments,
  saleId,
  activeTab = 'payments',
  onTabChange,
  canRegisterInstallmentPayment = false,
}: SaleDetailTabsProps) {
  const hasHuInstallments = financing?.hu?.installments && financing.hu.installments.length > 0;
  const hasLotInstallments = financing?.lot?.installments && financing.lot.installments.length > 0;
  const hasFinancing = hasLotInstallments || hasHuInstallments;

  // If no financing, show payments + documents tabs
  if (!hasFinancing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Pagos</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Documentos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="mt-4 space-y-4">
            {hasPayments && payments.length > 0 ? (
              <>
                <PaymentSummaryByConfig payments={payments} currency={currency} />
                <div className="hidden md:block">
                  <SalePaymentsTable payments={payments} currency={currency} />
                </div>
                <div className="md:hidden">
                  <PaymentCardsView payments={payments} currency={currency} />
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-muted/30 flex h-32 items-center justify-center rounded-lg border">
                    <p className="text-muted-foreground">No hay pagos registrados</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <SaleDocumentsTab saleId={saleId} />
          </TabsContent>
        </Tabs>
      </motion.div>
    );
  }

  const handlePaymentSuccess = () => {
    onTabChange?.('payments');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList
          className="grid w-full"
          style={{
            gridTemplateColumns: hasHuInstallments ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
          }}
        >
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Pagos</span>
          </TabsTrigger>
          <TabsTrigger value="lot-installments" className="flex items-center gap-2">
            <Landmark className="h-4 w-4" />
            <span className="hidden sm:inline">Cuotas de Lote</span>
          </TabsTrigger>
          {hasHuInstallments && (
            <TabsTrigger value="hu-installments" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Cuotas de HU</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Documentos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="mt-4 space-y-4">
          {hasPayments && payments.length > 0 ? (
            <>
              {/* Payment Summary Cards by Config */}
              <PaymentSummaryByConfig payments={payments} currency={currency} />

              {/* Desktop Table View */}
              <div className="hidden md:block">
                <SalePaymentsTable payments={payments} currency={currency} />
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden">
                <PaymentCardsView payments={payments} currency={currency} />
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="bg-muted/30 flex h-32 items-center justify-center rounded-lg border">
                  <p className="text-muted-foreground">No hay pagos registrados</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="lot-installments" className="mt-4">
          <SaleInstallmentsTabContent
            installments={financing?.lot?.installments || []}
            currency={currency}
            title="Cuotas de Lote"
            financingId={financing?.lot?.id || null}
            saleId={saleId}
            onPaymentSuccess={handlePaymentSuccess}
            canRegisterPayment={canRegisterInstallmentPayment}
            financingItem={financing?.lot || null}
          />
        </TabsContent>

        {hasHuInstallments && (
          <TabsContent value="hu-installments" className="mt-4">
            <SaleInstallmentsTabContent
              installments={financing?.hu?.installments || []}
              currency={currency}
              title="Cuotas de Habilitación Urbana"
              financingId={financing?.hu?.id || null}
              saleId={saleId}
              onPaymentSuccess={handlePaymentSuccess}
              canRegisterPayment={canRegisterInstallmentPayment}
              financingItem={financing?.hu || null}
            />
          </TabsContent>
        )}

        <TabsContent value="documents" className="mt-4">
          <SaleDocumentsTab saleId={saleId} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
