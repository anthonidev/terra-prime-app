"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import SalesTable from "./components/SalesTable";
import { useMyMembership } from "./hooks/useSales";

export default function MyPlanPage() {
  const {
    salesItems,
    salesLoading,
    salesError,
    salesMeta,

    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    refreshSales,
  } = useMyMembership();

  return (
    <div className="container pt-8">
      <PageHeader
        title="Ventas del día"
        subtitle="Información de las ventas realizadas"
        variant="gradient"
      />

      <Card>
        <CardContent>
          <SalesTable
            salesItems={salesItems}
            isLoading={salesLoading}
            error={salesError}
            meta={salesMeta}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handleItemsPerPageChange}
            onRefresh={refreshSales}
          />
        </CardContent>
      </Card>
    </div>
  );
}
