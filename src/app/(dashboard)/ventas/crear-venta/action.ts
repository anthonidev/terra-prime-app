'use server';

import { httpClient } from '@/lib/api/http-client';
import { SaleList } from '@domain/entities/sales/salevendor.entity';
import { CreateSalePayload } from '@/types/sales';

import { revalidateTag } from 'next/cache';

const SALES_VENDOR_CACHE_TAG = 'sales-vendor';

export async function createSale(data: CreateSalePayload) {
  try {
    const response = await httpClient<SaleList>('/api/sales', {
      method: 'POST',
      cache: 'no-store',
      body: data
    });
    revalidateTag(SALES_VENDOR_CACHE_TAG);

    return { success: true, data: response };
  } catch (error) {
    console.error('Error al crear la venta:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear liner'
    };
  }
}
