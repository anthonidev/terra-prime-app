'use server';

import { httpClient } from '@/lib/api/http-client';
import { CreateSaleDirectDTO, CreateSaleFinancedDTO } from '@/types/sales';

export async function createSaleFinanced(data: CreateSaleFinancedDTO) {
  try {
    const response = await httpClient('/api/sales', {
      method: 'POST',
      body: data
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error al crear la venta:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear liner'
    };
  }
}

export async function createSaleDirect(data: CreateSaleDirectDTO) {
  try {
    const response = await httpClient('/api/sales', {
      method: 'POST',
      body: data
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error al crear la venta:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al crear liner'
    };
  }
}
