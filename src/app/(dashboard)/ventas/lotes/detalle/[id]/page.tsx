import { PageHeader } from '@/components/common/PageHeader';
import { Suspense } from 'react';
import Link from 'next/link';
import LotData from './components/LotData';
import TableSkeleton from './components/TableSkeleton';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LotPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="container py-8">
      <PageHeader
        title="Lotes"
        subtitle="Lista de lotes asociados a un proyecto"
        className="mb-6"
        variant="gradient"
        actions={
          <Link
            className="rounded-md bg-green-500 p-2 text-sm font-medium text-white transition-colors hover:bg-green-400"
            href="/ventas/lotes"
          >
            Regresar
          </Link>
        }
      />

      <Suspense fallback={<TableSkeleton />}>
        <LotData id={id} />
      </Suspense>
    </div>
  );
}
