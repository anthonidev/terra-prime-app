'use client';

import { useSaleDetail } from '@/features/collections/hooks/use-sale-detail';
import { SaleDetailTabs } from '@/features/collections/components/sale-detail/sale-detail-tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface FinancingInstallmentsViewProps {
  saleId: string;
}

export function FinancingInstallmentsView({ saleId }: FinancingInstallmentsViewProps) {
  const { data, isLoading, isError } = useSaleDetail(saleId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data || !data.sale) {
    // If we can't load the collections data, we just don't show this section
    // or show an error message if it's critical.
    // Given this is an enhancement for COB role, maybe show nothing if it fails?
    // Or show error.
    return null;
  }

  return (
    <div className="space-y-6">
      <SaleDetailTabs data={data} />
    </div>
  );
}
