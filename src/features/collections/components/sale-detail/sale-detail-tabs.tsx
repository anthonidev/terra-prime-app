'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/shared/lib/utils';
import { InstallmentsTable } from './installments-table';
import type { GetSaleDetailResponse } from '../../types';

interface SaleDetailTabsProps {
  data: GetSaleDetailResponse;
}

export function SaleDetailTabs({ data }: SaleDetailTabsProps) {
  const { sale } = data;
  if (!sale) return null;
  const hasUrbanDevelopment = !!sale.urbanDevelopment;

  return (
    <Tabs defaultValue="lot" className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
        <TabsTrigger value="lot">Pago de Lote</TabsTrigger>
        {hasUrbanDevelopment && <TabsTrigger value="urban">Habilitación Urbana</TabsTrigger>}
      </TabsList>

      <TabsContent value="lot" className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financiamiento del Lote</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
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

            <InstallmentsTable
              installments={sale.financing.financingInstallments}
              financingId={sale.financing.id}
              currency={sale.currency}
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
            <CardContent>
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
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
                  <p className="font-medium">{sale.urbanDevelopment.financing.quantityCoutes}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Interés</p>
                  <p className="font-medium">{sale.urbanDevelopment.financing.interestRate}%</p>
                </div>
              </div>

              <InstallmentsTable
                installments={sale.urbanDevelopment.financing.financingInstallments}
                financingId={sale.urbanDevelopment.financing.id}
                currency={sale.currency}
              />
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
}
