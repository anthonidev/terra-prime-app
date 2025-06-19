'use server';
import { httpClient } from '@/lib/api/http-client';
import { SaleList } from '@domain/entities/sales/salevendor.entity';

export async function detailSale(saleId: string) {
  try {
    console.log('Viendo detalle de la venta:', saleId);

    const result = await httpClient<SaleList>(`/api/sales/${saleId}`);

    return { success: true, data: result };
  } catch (error) {
    console.error(`Error al obtener detalle de la venta (ID: ${saleId}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener detalle de la venta'
    };
  }
}
