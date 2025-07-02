import { AmortizationRepository } from '@domain/repositories/amortization.repository';
import { GetAmortizationDTO } from '@application/dtos/get-amortization.dto';
import {
  ClientGuarantorRepository,
  ClientRepository
} from '@domain/repositories/client.repository';
import { Amortization } from '@domain/entities/sales/amortization.entity';
import { Meta } from '@infrastructure/types/pagination.types';
import { Client } from '@domain/entities/sales/client.entity';
import { httpClient } from '@/lib/api/http-client';

import {
  AssignLeadsVendorRepository,
  LeadsOfDayRepository,
  LeadsVendorRepository,
  VendorsActivesRepository
} from '@domain/repositories/leadsvendors.repository';

import {
  AmortizationResponse,
  LeadsOfDayResponse,
  LeadsVendorResponse,
  VendorsActivesResponse,
  ClientResponse,
  ClientGuarantorResponse,
  PaymentResponse,
  SalesListVendorResponse,
  PaymentListResponse,
  PaymentApproveRejectResponse,
  PaymentCompletedResponse,
  SalesListResponse,
  SaleReportResponse
} from '@infrastructure/types/sales/api-response.types';

import {
  LeadsOfDay,
  LeadsVendor,
  VendorsActives
} from '@domain/entities/sales/leadsvendors.entity';
import { CreateClientGuarantorDTO } from '@application/dtos/create-clientguarantor.dto';
import {
  GenerateAcordPaymentRepository,
  GenerateRadicationPaymentRepository,
  PaymentApproveRepository,
  PaymentCompleteRepository,
  PaymentDetailRepository,
  PaymentListRepository,
  PaymentRejectRepository,
  PaymentRepository,
  RegenerateAcordPaymentRepository,
  RegenerateRadicationPaymentRepository
} from '@domain/repositories/payments.repository';
import { ProcessPaymentDto } from '@application/dtos/create-payment.dto';
import {
  SaleDetailRepository,
  SaleListRepository,
  SaleVendorRepository
} from '@domain/repositories/salevendor.repository';
import { SaleList } from '@domain/entities/sales/salevendor.entity';
import { PaymentDetailItem } from '@domain/entities/sales/payment.entity';
import { ApprovePaymentDTO } from '@application/dtos/approve-payment.dto';
import { RejectPaymentDTO } from '@application/dtos/reject-payment.dto';
import { PaymentCompleteDTO } from '@/lib/application/dtos/complete-payment.dto';
import { AssignLeadsToVendorDTO } from '@/lib/application/dtos/bienvenidos.dto';

/**
 * Calcular amortization
 *
 * @params data
 * @returns AmortizationResponse
 */
export class HttpAmortizationRepository implements AmortizationRepository {
  async calculate(data: GetAmortizationDTO): Promise<Amortization[]> {
    try {
      const response = await httpClient<AmortizationResponse>(
        '/api/sales/financing/calculate-amortization',
        {
          method: 'POST',
          body: data,
          cache: 'no-store'
        }
      );

      return response.installments.map((item) => ({
        couteAmount: item.couteAmount,
        expectedPaymentDate: item.expectedPaymentDate
      }));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

/**
 * Obtiene los bienvenidos asignados al vendedor
 *
 * @returns LeadsVendorResponse[]
 */
export class HttpLeadsVendorRepository implements LeadsVendorRepository {
  async getLeadsVendor(): Promise<LeadsVendor[]> {
    try {
      const response = await httpClient<LeadsVendorResponse[]>('/api/sales/leads/vendor');

      return response.map(
        (item) =>
          new LeadsVendor(
            item.id,
            item.firstName,
            item.lastName,
            item.document,
            item.documentType,
            item.phone,
            item.phone2,
            item.age,
            item.createdAt,
            item.source,
            item.ubigeo
          )
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

/**
 * Obtiene todos los vendedores activos
 *
 * @returns VendorsActivesResponse[]
 */
export class HttpVendorsActivesRepository implements VendorsActivesRepository {
  async getData(): Promise<VendorsActives[]> {
    try {
      const response = await httpClient<VendorsActivesResponse[]>('/api/sales/vendors/actives');

      return response.map(
        (item) =>
          new VendorsActives(
            item.id,
            item.firstName,
            item.lastName,
            item.email,
            item.document,
            item.photo,
            item.createdAt
          )
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpLeadsOfDayRepository implements LeadsOfDayRepository {
  async getData(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ items: LeadsOfDay[]; meta: Meta }> {
    try {
      const response = await httpClient<LeadsOfDayResponse>('/api/sales/leads/day', {
        params: params
      });

      const items = response.items.map((item) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        document: item.document,
        documentType: item.documentType,
        phone: item.phone,
        phone2: item.phone2,
        age: item.age,
        createdAt: item.createdAt,
        source: {
          id: item.source.id,
          name: item.source.name
        },
        ubigeo: {
          id: item.ubigeo.id,
          name: item.ubigeo.name,
          code: item.ubigeo.code,
          parentId: item.ubigeo.parentId
        },
        vendor: item.vendor
          ? {
              id: item.vendor.id,
              firstName: item.vendor.firstName,
              lastName: item.vendor.lastName,
              email: item.vendor.email,
              document: item.vendor.document
            }
          : null
      }));

      return {
        items: items,
        meta: response.meta
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpAssignLeadsToVendorRepository implements AssignLeadsVendorRepository {
  async onAssign(dto: AssignLeadsToVendorDTO): Promise<LeadsOfDay[]> {
    try {
      const response = await httpClient<LeadsOfDay[]>('/api/sales/leads/assign/vendor', {
        method: 'POST',
        body: dto
      });

      return response.map((item) => ({
        id: item.id,
        firstName: item.firstName,
        lastName: item.lastName,
        document: item.document,
        documentType: item.documentType,
        phone: item.phone,
        phone2: item.phone2,
        age: item.age,
        createdAt: item.createdAt,
        source: item.source,
        ubigeo: item.ubigeo,
        vendor: item.vendor
      }));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpClientRepository implements ClientRepository {
  async getClientByDocument(document: number): Promise<Client> {
    try {
      const response = await httpClient<ClientResponse>(`/api/sales/clients/document/${document}`);

      return {
        id: response.id,
        address: response.address
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpClientGuarantorRepository implements ClientGuarantorRepository {
  async createClientGuarantor(data: CreateClientGuarantorDTO): Promise<ClientGuarantorResponse> {
    try {
      const response = await httpClient<ClientGuarantorResponse>(
        '/api/sales/clients/guarantors/create',
        {
          method: 'POST',
          body: data
        }
      );

      return {
        clientId: response.clientId,
        guarantorId: response.guarantorId,
        secondaryClientIds: response.secondaryClientIds
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpPaymentRepository implements PaymentRepository {
  async createPayment(id: string, data: ProcessPaymentDto): Promise<PaymentResponse> {
    try {
      const formData = new FormData();
      formData.append('payments', JSON.stringify(data.payments));
      data.files.forEach((file) => {
        formData.append('files', file);
      });
      const response = await httpClient<PaymentResponse>(`/api/sales/payments/sale/${id}`, {
        method: 'POST',
        body: formData
      });
      return {
        id: response.id,
        relatedEntityType: response.relatedEntityType,
        relatedEntityId: response.relatedEntityId,
        amount: response.amount,
        methodPayment: response.methodPayment,
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

export class HttpSaleVendorRepository implements SaleVendorRepository {
  async getData(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: SaleList[]; meta: Meta }> {
    try {
      const response = await httpClient<SalesListVendorResponse>('/api/sales/all/list/vendor', {
        params,
        next: {
          tags: ['sales_vendor'],
          revalidate: 0
        }
      });

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

export class HttpSaleListRepository implements SaleListRepository {
  async getData(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: SaleList[]; meta: Meta }> {
    try {
      const response = await httpClient<SalesListResponse>('/api/sales/all/list', {
        params,
        next: {
          tags: ['sales_general'],
          revalidate: 0
        }
      });

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

export class HttpSaleDetailRepository implements SaleDetailRepository {
  async getData(id: string): Promise<SaleList> {
    try {
      return await httpClient<SaleList>(`/api/sales/${id}`);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpPaymentListRepository implements PaymentListRepository {
  async listPayments(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<PaymentListResponse> {
    try {
      const response = await httpClient<PaymentListResponse>('/api/payments/list', {
        params
      });

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

export class HttpPaymentDetailRepository implements PaymentDetailRepository {
  async getPaymentDetail(id: number): Promise<PaymentDetailItem> {
    try {
      const response = await httpClient<PaymentDetailItem>(`/api/payments/details/${id}`);
      return {
        id: response.id,
        amount: response.amount,
        status: response.status,
        createdAt: response.createdAt,
        reviewedAt: response.reviewedAt,
        reviewBy: response.reviewBy,
        codeOperation: response.codeOperation,
        banckName: response.banckName,
        dateOperation: response.dateOperation,
        numberTicket: response.numberTicket,
        paymentConfig: response.paymentConfig,
        user: {
          id: response.user.id,
          email: response.user.email,
          document: response.user.document,
          firstName: response.user.firstName,
          lastName: response.user.lastName
        },
        currency: response.currency,
        reason: response.reason,
        client: {
          address: response.client.address,
          lead: {
            firstName: response.client.lead.firstName,
            lastName: response.client.lead.lastName,
            document: response.client.lead.document
          }
        },
        lot: {
          name: response.lot.name,
          lotPrice: response.lot.lotPrice,
          block: response.lot.block,
          stage: response.lot.stage,
          project: response.lot.project
        },
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

export class HttpApprovePaymentRepository implements PaymentApproveRepository {
  async aprovePaymentDetail(
    id: number,
    dto: ApprovePaymentDTO
  ): Promise<PaymentApproveRejectResponse> {
    try {
      const response = await httpClient<PaymentApproveRejectResponse>(
        `/api/payments/approve/${id}`,
        {
          method: 'POST',
          body: dto
        }
      );
      return {
        id: response.id,
        relatedEntityType: response.relatedEntityId,
        relatedEntityId: response.relatedEntityId,
        amount: response.amount,
        methodPayment: response.methodPayment,
        numberTicker: response.numberTicker,
        codeOperation: response.codeOperation,
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

export class HttpRejectPaymentRepository implements PaymentRejectRepository {
  async rejectPaymentDetail(
    id: number,
    dto: RejectPaymentDTO
  ): Promise<PaymentApproveRejectResponse> {
    try {
      const response = await httpClient<PaymentApproveRejectResponse>(
        `/api/payments/reject/${id}`,
        {
          method: 'POST',
          body: dto
        }
      );
      return {
        id: response.id,
        relatedEntityType: response.relatedEntityId,
        relatedEntityId: response.relatedEntityId,
        amount: response.amount,
        methodPayment: response.methodPayment,
        numberTicker: response.numberTicker,
        codeOperation: response.codeOperation,
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

export class HttpCompletePaymentRepository implements PaymentCompleteRepository {
  async completePaymentDetail(
    id: number,
    dto: PaymentCompleteDTO
  ): Promise<PaymentCompletedResponse> {
    try {
      const response = await httpClient<PaymentCompletedResponse>(
        `/api/payments/complete-payment/${id}`,
        {
          method: 'PATCH',
          body: dto
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
        status: response.status,
        createdAt: response.createdAt
      };
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpGenerateAcordPayment implements GenerateAcordPaymentRepository {
  async generateAcordPayment(saleId: string): Promise<SaleReportResponse> {
    try {
      const response = await httpClient<SaleReportResponse>(
        `/api/reports-payment-acord/generate/${saleId}`,
        {
          method: 'POST'
        }
      );

      return response;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpRegenerateAcordPayment implements RegenerateAcordPaymentRepository {
  async regenerateAcordPayment(saleId: string): Promise<SaleReportResponse> {
    try {
      const response = await httpClient<SaleReportResponse>(
        `/api/reports-payment-acord/regenerate/${saleId}`,
        {
          method: 'POST'
        }
      );

      return response;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpGenerateRadicationPayment implements GenerateRadicationPaymentRepository {
  async generateRadicationPayment(saleId: string): Promise<SaleReportResponse> {
    try {
      const response = await httpClient<SaleReportResponse>(`/api/radication/generate/${saleId}`, {
        method: 'POST'
      });

      return response;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}

export class HttpRegenerateRadicationPayment implements RegenerateRadicationPaymentRepository {
  async regenerateRadicationPayment(saleId: string): Promise<SaleReportResponse> {
    try {
      const response = await httpClient<SaleReportResponse>(
        `/api/radication/regenerate/${saleId}`,
        {
          method: 'POST'
        }
      );

      return response;
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
      throw error;
    }
  }
}
