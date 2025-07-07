'use server';

import {
  AssignClientsCollectorUseCase,
  ClientsByUserUseCase,
  CollectionsClientUseCase,
  CollectorsListUseCase,
  ListByClientUseCase,
  PaidInstallmentsUseCase,
  PaymentByCollectorUseCase,
  PaymentsByCollectorUseCase,
  SaleCollectorUseCase
} from '@application/use-cases/cobranza';
import {
  HttpAssignClientsCollectorRepository,
  HttpClientsByUserRepository,
  HttpCollectionsClientRepository,
  HttpCollectorsListRepository,
  HttpListByClientRepository,
  HttpPaidInstallmentsRepository,
  HttpPaymentByCollectorRepository,
  HttpPaymentsByColletorRepository,
  HttpSaleCollectorRepository
} from '@infrastructure/api/http-cobranza.repository';

import {
  CollectionsClientResponse,
  CollectorsListResponse,
  PaidInstallmentsResponse,
  PaymentsByCollectorResponse,
  SalesCollectorResponse
} from '@infrastructure/types/cobranza';
import { AssignClientsCollectorDTO, PaidInstallmentsDTO } from '@application/dtos/cobranza';
import { ClientByUser, CollectionsClient, ListByClient } from '@domain/entities/cobranza';
import { PaymentDetailItem } from '@/lib/domain/entities/sales/payment.entity';

export async function getCollectors(params?: {
  order?: string;
  page?: number;
  limit?: number;
}): Promise<CollectorsListResponse> {
  const repository = new HttpCollectorsListRepository();
  const useCase = new CollectorsListUseCase(repository);

  const response = await useCase.execute(params);

  return {
    items: response.items,
    meta: response.meta
  };
}

export async function getCollectionsClient(params?: {
  order?: string;
  page?: number;
  limit?: number;
}): Promise<CollectionsClientResponse> {
  const repository = new HttpCollectionsClientRepository();
  const useCase = new CollectionsClientUseCase(repository);

  const response = await useCase.execute(params);

  return {
    items: response.items,
    meta: response.meta
  };
}

export async function onAssignClientsCollector(
  dto: AssignClientsCollectorDTO
): Promise<CollectionsClient[]> {
  const repository = new HttpAssignClientsCollectorRepository();
  const useCase = new AssignClientsCollectorUseCase(repository);

  const response = await useCase.execute(dto);

  return response.map((item) => ({
    id: item.id,
    address: item.address,
    lead: item.lead,
    collector: item.collector,
    createdAt: item.createdAt
  }));
}

export async function getClientsByUser(): Promise<ClientByUser[]> {
  try {
    const repository = new HttpClientsByUserRepository();
    const useCase = new ClientsByUserUseCase(repository);

    const response = await useCase.execute();

    return response.map((item) => ({
      id: item.id,
      address: item.address,
      lead: item.lead,
      createdAt: item.createdAt
    }));
  } catch (error) {
    console.error('Error fetching:', error);
    throw new Error('Failed to fetch');
  }
}

export async function listByClient(id: number): Promise<ListByClient[]> {
  const repository = new HttpListByClientRepository();
  const useCase = new ListByClientUseCase(repository);

  const response = await useCase.execute(id);

  return response.map((item) => ({
    id: item.id,
    type: item.type,
    totalAmount: item.totalAmount,
    status: item.status,
    client: item.client,
    currency: item.currency,
    secondaryClients: item.secondaryClients,
    lot: item.lot,
    financing: item.financing,
    guarantor: item.guarantor,
    vendor: item.vendor
  }));
}

export async function saleCollectorInfo(id: string): Promise<SalesCollectorResponse> {
  const repository = new HttpSaleCollectorRepository();
  const useCase = new SaleCollectorUseCase(repository);

  const response = await useCase.execute(id);

  return {
    sale: response.sale,
    urbanDevelopment: response.urbanDevelopment
  };
}

export async function paidInstallments(
  id: string,
  dto: PaidInstallmentsDTO
): Promise<PaidInstallmentsResponse> {
  const repository = new HttpPaidInstallmentsRepository();
  const useCase = new PaidInstallmentsUseCase(repository);

  const response = await useCase.execute(id, dto);

  return {
    id: response.id,
    relatedEntityType: response.relatedEntityType,
    relatedEntityId: response.relatedEntityId,
    amount: response.amount,
    methodPayment: response.methodPayment,
    numberTicker: response.numberTicker,
    codeOperation: response.codeOperation,
    rejectionReason: response.rejectionReason,
    status: response.status,
    createdAt: response.createdAt,
    vouchers: response.vouchers.map((item) => ({
      id: item.id,
      url: item.url,
      amount: item.amount,
      bankName: item.bankName,
      transactionReference: item.transactionReference,
      transactionDate: item.transactionDate
    }))
  };
}

export async function getPaymentsByCollector(params?: {
  order?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaymentsByCollectorResponse> {
  try {
    const repository = new HttpPaymentsByColletorRepository();
    const useCase = new PaymentsByCollectorUseCase(repository);

    const response = await useCase.execute(params);

    return {
      items: response.items,
      meta: response.meta
    };
  } catch (error) {
    console.error('Error fetching payments by collector:', error);
    throw new Error('Failed to fetch payments');
  }
}

export async function getPaymentByCollector(id: number): Promise<PaymentDetailItem> {
  try {
    const repository = new HttpPaymentByCollectorRepository();
    const useCase = new PaymentByCollectorUseCase(repository);

    return await useCase.execute(id);
  } catch (error) {
    console.error('Error fetching payment detail:', error);
    throw new Error('Failed to fetch payment detail');
  }
}
