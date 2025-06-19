import { notFound } from 'next/navigation';
import { detailSale } from '../action';
import SaleDetailView from './SaleDetailView';

export default async function SaleDetailContent({ saleId }: { saleId: string }) {
  try {
    const { success, data: sale } = await detailSale(saleId);

    if (!success || !sale) notFound();

    return <SaleDetailView sale={sale} />;
  } catch (error) {
    console.error('Error loading sale detail:', error);
    return (
      <div className="bg-destructive/10 border-destructive/30 mx-auto mb-6 flex max-w-lg flex-col items-center justify-center rounded-md border p-6 text-center">
        <h3 className="text-destructive mb-2 text-lg font-semibold">
          Error al cargar los detalles de la venta
        </h3>
        <p className="text-destructive/80 mb-4">
          No se pudieron cargar los datos de la venta. Por favor, intenta nuevamente.
        </p>
      </div>
    );
  }
}
