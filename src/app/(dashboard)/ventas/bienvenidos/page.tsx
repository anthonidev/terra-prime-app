'use client';

import { PageHeader } from '@/components/common/PageHeader';
import { ShoppingBag } from 'lucide-react';
import BienvenidosTable from './components/BienvenidosTable';
import { useBienvenidos } from './hooks/useBienvenidos';

export default function BienvenidosPage() {
  const {
    data,
    dataLoading,
    dataError,
    dataMeta,

    currentPage,
    dataPerPage,
    handlePageChange,
    handleDataPerPageChange,
    refreshData,
    handleAssignVendor
  } = useBienvenidos();

  return (
    <div className="container pt-8">
      <PageHeader
        icon={ShoppingBag}
        title="Bienvenidos del día"
        subtitle="Información de los leads en oficina"
        variant="default"
      />

      <BienvenidosTable
        data={data}
        isLoading={dataLoading}
        error={dataError}
        meta={dataMeta}
        currentPage={currentPage}
        itemsPerPage={dataPerPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handleDataPerPageChange}
        onRefresh={refreshData}
        onAssign={handleAssignVendor}
      />
    </div>
  );
}
