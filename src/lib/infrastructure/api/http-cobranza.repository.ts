import {
  AssignClientsCollectorRepository,
  ClientsByUserRepository,
  CollectionsClientRepository,
  CollectorsListRepository,
  ListByClientRepository,
  PaidInstallmentsRepository,
  PaymentByCollectorRepository,
  PaymentsByCollectorRepository,
  PaymentsWithSupervisorRepository,
  SaleCollectorRepository
} from '@domain/repositories/cobranza';
import {
  CollectionsClientResponse,
  CollectorsListResponse,
  PaidInstallmentsResponse,
  PaymentsByCollectorResponse,
  SalesCollectorResponse
} from '@infrastructure/types/cobranza';
import { httpClient } from '@/lib/api/http-client';
import { AssignClientsCollectorDTO, PaidInstallmentsDTO } from '@/lib/application/dtos/cobranza';
import { ClientByUser, CollectionsClient, ListByClient } from '@domain/entities/cobranza';
import { PaymentDetailItem } from '@/lib/domain/entities/sales/payment.entity';
import { PaymentWithCollectorResponse } from '../types/sales/api-response.types';

export class HttpCollectorsListRepository implements CollectorsListRepository {
  async getData(params?: { page?: number; limit?: number }): Promise<CollectorsListResponse> {
    try {
      const response = await httpClient<CollectorsListResponse>(
        '/api/collections/collectors/list',
        {
          params: params
        }
      );
      return {
        items: response.items,
        meta: response.meta
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpCollectionsClientRepository implements CollectionsClientRepository {
  async getData(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<CollectionsClientResponse> {
    try {
      const response = await httpClient<CollectionsClientResponse>(
        '/api/collections/clients/list',
        {
          params
        }
      );

      return {
        items: response.items,
        meta: response.meta
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpAssignClientsCollectorRepository implements AssignClientsCollectorRepository {
  async onAssign(dto: AssignClientsCollectorDTO): Promise<CollectionsClient[]> {
    try {
      const response = await httpClient<CollectionsClient[]>(
        '/api/collections/assign-clients-to-collector',
        { method: 'POST', body: dto }
      );

      return response.map((item) => ({
        id: item.id,
        address: item.address,
        lead: item.lead,
        collector: item.collector,
        createdAt: item.createdAt
      }));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpClientsByUserRepository implements ClientsByUserRepository {
  async getData(): Promise<ClientByUser[]> {
    try {
      const response = await httpClient<ClientByUser[]>('/api/collections/clients/list-by-user');

      return response.map((item) => ({
        id: item.id,
        address: item.address,
        lead: item.lead,
        createdAt: item.createdAt
      }));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpListByClientRepository implements ListByClientRepository {
  async getDataByClient(id: number): Promise<ListByClient[]> {
    try {
      const response = await httpClient<ListByClient[]>(
        `/api/collections/sales/list-by-client/${id}`
      );

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
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpSaleCollectorRepository implements SaleCollectorRepository {
  async getData(id: string): Promise<SalesCollectorResponse> {
    try {
      const response = await httpClient<SalesCollectorResponse>(
        `/api/collections/clients/sales/${id}`
      );

      return {
        sale: response.sale,
        urbanDevelopment: response.urbanDevelopment
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpPaidInstallmentsRepository implements PaidInstallmentsRepository {
  async paid(id: string, dto: PaidInstallmentsDTO): Promise<PaidInstallmentsResponse> {
    try {
      const formData = new FormData();
      formData.append('payments', JSON.stringify(dto.payments));
      dto.files.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('amountPaid', String(dto.amountPaid));

      const response = await httpClient<PaidInstallmentsResponse>(
        `/api/collections/financing/installments/paid/${id}`,
        {
          method: 'POST',
          body: formData
        }
      );

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
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpPaymentsByColletorRepository implements PaymentsByCollectorRepository {
  async getData(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<PaymentsByCollectorResponse> {
    try {
      const response = await httpClient<PaymentsByCollectorResponse>(
        '/api/collections/list/payments',
        {
          params
        }
      );

      return {
        items: response.items,
        meta: response.meta
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpPaymentByCollectorRepository implements PaymentByCollectorRepository {
  async getData(id: number): Promise<PaymentDetailItem> {
    try {
      const response = await httpClient<PaymentDetailItem>(
        `/api/collections/payments/details/${id}`
      );

      return response;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpPaymentsWithSupervisorRepository implements PaymentsWithSupervisorRepository {
  async getData(params?: {
    order?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    collectorId?: string;
  }): Promise<PaymentWithCollectorResponse> {
    try {
      const response = await httpClient<PaymentWithCollectorResponse>(
        '/api/collections/list/all/payments',
        {
          params
        }
      );

      return {
        items: response.items,
        meta: response.meta
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}
