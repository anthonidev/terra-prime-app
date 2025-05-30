'use server';

import { httpClient } from '@/lib/api/http-client';
import { revalidatePath, revalidateTag } from 'next/cache';
import { SalesListVendorResponse } from '@/types/sales';

const SALES_CACHE_TAG = 'sales';

export async function getSales(params?: Record<string, unknown>): Promise<SalesListVendorResponse> {
  try {
    return await httpClient<SalesListVendorResponse>('/api/sales/all/list/vendor', {
      params,
      next: {
        tags: [SALES_CACHE_TAG],
        revalidate: 300
      }
    });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    throw error;
  }
}

export async function registrarPago(saleId: string) {
  try {
    console.log('Registrando pago para la venta:', saleId);

    // Simulando una llamada al API
    // const result = await httpClient(`/api/sales/${saleId}/payments`, {
    //   method: 'POST',
    //   cache: 'no-store'
    // });

    revalidateTag(SALES_CACHE_TAG);
    revalidatePath('/ventas');

    return { success: true, message: 'Pago registrado correctamente' };
  } catch (error) {
    console.error(`Error al registrar pago para la venta (ID: ${saleId}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al registrar pago'
    };
  }
}
