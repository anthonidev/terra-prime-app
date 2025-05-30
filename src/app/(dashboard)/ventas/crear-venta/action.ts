'use server';

import { httpClient } from '@/lib/api/http-client';
import {
  AmortizationDTO,
  AmortizationResponse,
  ClientGuarantorPayload,
  ClientGuarantorResponse,
  ClientResponse,
  CreateSalePayload,
  LeadsVendorResponse,
  ProyectBlocksDTO,
  ProyectBlocksResponse,
  ProyectLotsDTO,
  ProyectLotsResponse,
  ProyectsActivesResponse,
  ProyectStagesDTO,
  ProyectStagesResponse,
  SaleResponse
} from '@/types/sales';
import { revalidateTag } from 'next/cache';

const PROJECTS_ACTIVES_CACHE_TAG = 'projects-actives';
const PROYECT_STAGES_CACHE_TAG = 'proyect-stages';
const PROYECT_BLOCKS_CACHE_TAG = 'proyect-blocks';
const PROYECT_LOTS_CACHE_TAG = 'proyect-lots';
const SALES_LEADS_CACHE_TAG = 'sales-leads';
const SALES_VENDOR_CACHE_TAG = 'sales-vendor';

// paso 1
export const getProyectsActives = async (): Promise<ProyectsActivesResponse> => {
  try {
    return await httpClient<ProyectsActivesResponse>('/api/sales/projects/actives', {
      next: {
        tags: [PROJECTS_ACTIVES_CACHE_TAG],
        revalidate: 300
      }
    });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};

export const getProyectStages = async (data: ProyectStagesDTO): Promise<ProyectStagesResponse> => {
  try {
    return await httpClient<ProyectStagesResponse>(`/api/sales/stages/${data.id}`, {
      next: {
        tags: [PROYECT_STAGES_CACHE_TAG],
        revalidate: 300
      }
    });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};

export const getProyectBlocks = async (data: ProyectBlocksDTO): Promise<ProyectBlocksResponse> => {
  try {
    return await httpClient<ProyectBlocksResponse>(`/api/sales/blocks/${data.id}`, {
      next: {
        tags: [PROYECT_BLOCKS_CACHE_TAG],
        revalidate: 300
      }
    });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};

export const getProyectLots = async (data: ProyectLotsDTO): Promise<ProyectLotsResponse> => {
  try {
    return await httpClient<ProyectLotsResponse>(`/api/sales/lots/${data.id}?status=Activo`, {
      next: {
        tags: [PROYECT_LOTS_CACHE_TAG],
        revalidate: 300
      }
    });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};

//paso 2

export async function calculateAmortization(data: AmortizationDTO): Promise<AmortizationResponse> {
  try {
    return await httpClient<AmortizationResponse>('/api/sales/financing/calculate-amortization', {
      cache: 'no-store',
      method: 'POST',
      body: {
        totalAmount: data.totalAmount,
        initialAmount: data.initialAmount,
        reservationAmount: data.reservationAmount,
        interestRate: data.interestRate,
        numberOfPayments: data.numberOfPayments,
        firstPaymentDate: data.firstPaymentDate,
        includeDecimals: data.includeDecimals
      }
    });
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}

//paso 3

export async function getLeadsVendor(): Promise<LeadsVendorResponse> {
  try {
    return await httpClient<LeadsVendorResponse>('/api/sales/leads/vendor', {
      next: {
        tags: [SALES_LEADS_CACHE_TAG],
        revalidate: 300
      }
    });
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}

export async function getClients(document: number): Promise<ClientResponse> {
  try {
    return await httpClient<ClientResponse>(`/api/sales/clients/document/${document}`, {
      cache: 'no-store'
    });
  } catch (error) {
    if (error instanceof Error) console.error('Has been error, reason: %s', error.message);
    throw error;
  }
}

export async function createClientAndGuarantor(
  data: ClientGuarantorPayload
): Promise<ClientGuarantorResponse> {
  try {
    return await httpClient<ClientGuarantorResponse>('/api/sales/clients/guarantors/create', {
      method: 'POST',
      cache: 'no-store',
      body: {
        createClient: {
          leadId: data.createClient.leadId,
          address: data.createClient.address
        },
        createGuarantor: {
          firstName: data.createGuarantor.firstName,
          lastName: data.createGuarantor.lastName,
          email: data.createGuarantor.email,
          document: data.createGuarantor.document,
          documentType: data.createGuarantor.documentType,
          phone: data.createGuarantor.phone,
          address: data.createGuarantor.address
        },
        document: data.document
      }
    });
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
}

//paso 4

export async function createSale(data: CreateSalePayload) {
  try {
    const response = await httpClient<SaleResponse>('/api/sales', {
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
