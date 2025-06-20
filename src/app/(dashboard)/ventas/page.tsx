import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import VentasData from './components/VentasData';
import VentasTableSkeleton from './components/VentasTableSkeleton';
import Link from 'next/link';

export default async function VentasPage({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = await searchParams;

  return (
    <div className="container py-8">
      <PageHeader
        title="Ventas"
        subtitle="Administra todas las ventas realizadas por vendedores"
        className="mb-6"
        variant="gradient"
        actions={
          <Link
            className="rounded-md bg-green-500 p-2 text-sm font-medium text-white hover:bg-green-400"
            href="/ventas/crear-venta"
          >
            Crear Venta
          </Link>
        }
      />

      <Suspense fallback={<VentasTableSkeleton />}>
        <VentasData searchParams={filters} />
      </Suspense>
    </div>
  );
}
