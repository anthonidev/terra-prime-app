'use server';
import { httpClient } from '@/lib/api/http-client';
import { SaleResponse } from '@/types/sales';

const SALES_CACHE_TAG = 'sales';
export async function detailSale(saleId: string) {
  try {
    console.log('Viendo detalle de la venta:', saleId);

    const result = await httpClient<SaleResponse>(`/api/sales/${saleId}`, {
      next: {
        tags: [`${SALES_CACHE_TAG}-${saleId}`],
        revalidate: 300
      }
    });

    return { success: true, data: result };
  } catch (error) {
    console.error(`Error al obtener detalle de la venta (ID: ${saleId}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener detalle de la venta'
    };
  }
}
