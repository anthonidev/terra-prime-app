'use server';

import {
  HttpAmortizationRepository,
  HttpApprovePaymentRepository,
  HttpAssignLeadsToVendorRepository,
  HttpClientGuarantorRepository,
  HttpClientRepository,
  HttpCompletePaymentRepository,
  HttpGenerateAcordPayment,
  HttpGenerateRadicationPayment,
  HttpLeadsOfDayRepository,
  HttpLeadsVendorRepository,
  HttpPaymentDetailRepository,
  HttpPaymentListRepository,
  HttpPaymentRepository,
  HttpRegenerateAcordPayment,
  HttpRegenerateRadicationPayment,
  HttpRejectPaymentRepository,
  HttpReservationPeriod,
  HttpSaleDetailRepository,
  HttpSaleListRepository,
  HttpSaleVendorRepository,
  HttpVendorsActivesRepository
} from '@infrastructure/api/http-sales.repository';

import {
  AmortizationResponse,
  ClientGuarantorResponse,
  ClientResponse,
  LeadsOfDayResponse,
  LeadsVendorResponse,
  PaymentApproveRejectResponse,
  PaymentCompletedResponse,
  PaymentListResponse,
  PaymentResponse,
  ReservationResponse,
  SaleReportResponse,
  SalesListResponse,
  SalesListVendorResponse,
  VendorsActivesResponse
} from '@infrastructure/types/sales/api-response.types';

import {
  GetLeadsOfDayUseCase,
  GetLeadsVendorUseCase,
  GetVendorsActivesUseCase
} from '@application/use-cases/get-leadsvendors.usecase';

import {
  CreateClientGuarantorUseCase,
  GetClientsUseCase
} from '@application/use-cases/get-clients.usecase';

import { CreateClientGuarantorDTO } from '@application/dtos/create-clientguarantor.dto';
import { CalculateAmortizationUseCase } from '@application/use-cases/calculate-amortization.usecase';
import { GetAmortizationDTO } from '@application/dtos/get-amortization.dto';
import { ProcessPaymentDto } from '@application/dtos/create-payment.dto';
import {
  ApprovePaymentUseCase,
  CreatePaymentUseCase,
  GenerateAcordPaymentUseCase,
  GenerateRadicationPaymentUseCase,
  GetPaymentDetailUseCase,
  ListPaymentsUseCase,
  PaymentCompleteUseCase,
  RegenerateAcordPaymentUseCase,
  RegenerateRadicationPaymentUseCase,
  RejectPaymentUseCase
} from '@application/use-cases/payment.usecase';
import {
  SaleDetailUseCase,
  SaleListUseCase,
  SaleReservationPeriodUseCase,
  SaleVendorUseCase
} from '@application/use-cases/list-salevendor.usecase';
import { PaymentDetailItem } from '@domain/entities/sales/payment.entity';
import { ApprovePaymentDTO } from '@application/dtos/approve-payment.dto';
import { RejectPaymentDTO } from '@application/dtos/reject-payment.dto';
import { PaymentCompleteDTO } from '@application/dtos/complete-payment.dto';
import { AssignLeadsToVendorDTO } from '@application/dtos/bienvenidos.dto';
import { AssignLeadsVendorUseCase } from '@application/use-cases/assign-salevendor.usecase';
import { LeadsOfDay } from '@domain/entities/sales/leadsvendors.entity';
import { SaleList } from '@domain/entities/sales/salevendor.entity';
import { revalidateTag } from 'next/cache';
import { httpClient } from '@/lib/api/http-client';

/**
 * Calcula el cronograma de pagos
 * @param data
 * @returns Promise<AmortizationResponse>
 */
export async function calculateAmortization(
  data: GetAmortizationDTO
): Promise<AmortizationResponse> {
  const repository = new HttpAmortizationRepository();
  const useCase = new CalculateAmortizationUseCase(repository);

  const amortizations = await useCase.execute(data);

  return {
    installments: amortizations
  };
}

/**
 * Captura los bienvenidos asignados al vendedor
 *
 * @returns Promise<LeadsVendorResponse[]>
 */
export async function getLeadsVendor(): Promise<LeadsVendorResponse[]> {
  const repository = new HttpLeadsVendorRepository();
  const useCase = new GetLeadsVendorUseCase(repository);

  const leadsVendor = await useCase.execute();

  return leadsVendor.map((item) => ({
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
    ubigeo: item.ubigeo
  }));
}

/**
 *
 * @returns Promise<VendorsActivesResponse[]>
 */
export async function getVendorsActives(): Promise<VendorsActivesResponse[]> {
  const repository = new HttpVendorsActivesRepository();
  const useCase = new GetVendorsActivesUseCase(repository);

  const vendorsActives = await useCase.execute();

  return vendorsActives.map((item) => ({
    id: item.id,
    firstName: item.firstName,
    lastName: item.lastName,
    email: item.email,
    document: item.document,
    photo: item.photo,
    createdAt: item.createdAt
  }));
}

export async function getLeadsOfDay(params?: {
  order?: string;
  page?: number;
  limit?: number;
}): Promise<LeadsOfDayResponse> {
  const repository = new HttpLeadsOfDayRepository();
  const useCase = new GetLeadsOfDayUseCase(repository);

  const leadsOfDay = await useCase.execute(params);

  return {
    items: leadsOfDay.items.map((item) => ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      document: item.document,
      documentType: item.documentType,
      phone: item.phone,
      phone2: item.phone2,
      age: item.age,
      isActive: item.isActive,
      createdAt: item.createdAt,
      isInOffice: item.isInOffice,
      interestProjects: item.interestProjects,
      companionFullName: item.companionFullName,
      companionDni: item.companionDni,
      companionRelationship: item.companionRelationship,
      metadata: item.metadata,
      reportPdfUrl: item.reportPdfUrl,
      visits: item.visits,
      source: item.source,
      ubigeo: item.ubigeo,
      vendor: item.vendor,
      liner: item.liner,
      telemarketingSupervisor: item.telemarketingSupervisor,
      telemarketingConfirmer: item.telemarketingConfirmer,
      telemarketer: item.telemarketer,
      fieldManager: item.fieldManager,
      fieldSupervisor: item.fieldSupervisor,
      fieldSeller: item.fieldSeller
    })),
    meta: leadsOfDay.meta
  };
}

export async function assignLeadsToVendor(dto: AssignLeadsToVendorDTO): Promise<LeadsOfDay[]> {
  const repository = new HttpAssignLeadsToVendorRepository();
  const useCase = new AssignLeadsVendorUseCase(repository);

  return await useCase.execute(dto);
}

export async function getClientsByDocument(document: number): Promise<ClientResponse> {
  const repository = new HttpClientRepository();
  const useCase = new GetClientsUseCase(repository);

  const client = await useCase.execute(document);

  return {
    id: client.id,
    address: client.address
  };
}

export async function createClientGuarantor(
  data: CreateClientGuarantorDTO
): Promise<ClientGuarantorResponse> {
  const repository = new HttpClientGuarantorRepository();
  const useCase = new CreateClientGuarantorUseCase(repository);

  const clientGuarantor = await useCase.execute(data);

  return {
    clientId: clientGuarantor.clientId,
    guarantorId: clientGuarantor.guarantorId,
    secondaryClientIds: clientGuarantor.secondaryClientIds
  };
}

export async function createPayment(id: string, dto: ProcessPaymentDto): Promise<PaymentResponse> {
  const repository = new HttpPaymentRepository();
  const useCase = new CreatePaymentUseCase(repository);

  const payment = await useCase.execute(id, dto);

  revalidateTag('sales_vendor');

  return {
    id: payment.id,
    relatedEntityType: payment.relatedEntityType,
    relatedEntityId: payment.relatedEntityId,
    amount: payment.amount,
    methodPayment: payment.methodPayment,
    status: payment.status,
    createdAt: payment.createdAt,
    vouchers: payment.vouchers.map((item) => ({
      id: item.id,
      url: item.url,
      amount: item.amount,
      bankName: item.bankName,
      transactionReference: item.transactionReference,
      transactionDate: item.transactionDate
    }))
  };
}

export async function getSaleListVendor(params?: {
  order?: string;
  page?: number;
  limit?: number;
}): Promise<SalesListVendorResponse> {
  const repository = new HttpSaleVendorRepository();
  const useCase = new SaleVendorUseCase(repository);

  const saleListVendor = await useCase.execute(params);

  return {
    items: saleListVendor.items,
    meta: saleListVendor.meta
  };
}

export async function getSaleList(params?: {
  order?: string;
  page?: number;
  limit?: number;
}): Promise<SalesListResponse> {
  const repository = new HttpSaleListRepository();
  const useCase = new SaleListUseCase(repository);

  const saleList = await useCase.execute(params);

  return {
    items: saleList.items,
    meta: saleList.meta
  };
}

export async function getSaleDetail(id: string): Promise<SaleList> {
  const repository = new HttpSaleDetailRepository();
  const useCase = new SaleDetailUseCase(repository);

  return await useCase.execute(id);
}

export async function getPaymentList(params?: {
  order?: string;
  page?: number;
  limit?: number;
}): Promise<PaymentListResponse> {
  const repository = new HttpPaymentListRepository();
  const useCase = new ListPaymentsUseCase(repository);

  const paymentList = await useCase.execute(params);

  return {
    items: paymentList.items,
    meta: paymentList.meta
  };
}

export async function generateAcordPayment(saleId: string): Promise<SaleReportResponse> {
  const repository = new HttpGenerateAcordPayment();
  const useCase = new GenerateAcordPaymentUseCase(repository);

  const response = await useCase.execute(saleId);

  revalidateTag('sales_general');

  return response;
}

export async function regenerateAcordPayment(saleId: string): Promise<SaleReportResponse> {
  const repository = new HttpRegenerateAcordPayment();
  const useCase = new RegenerateAcordPaymentUseCase(repository);

  const response = await useCase.execute(saleId);

  revalidateTag('sales_general');

  return response;
}

export async function generateRadicationPayment(saleId: string): Promise<SaleReportResponse> {
  const repository = new HttpGenerateRadicationPayment();
  const useCase = new GenerateRadicationPaymentUseCase(repository);

  const response = await useCase.execute(saleId);

  revalidateTag('sales_general');

  return response;
}

export async function regenerateRadicationPayment(saleId: string): Promise<SaleReportResponse> {
  const repository = new HttpRegenerateRadicationPayment();
  const useCase = new RegenerateRadicationPaymentUseCase(repository);

  const response = await useCase.execute(saleId);

  revalidateTag('sales_general');

  return response;
}

export async function getPaymentDetail(id: number): Promise<PaymentDetailItem> {
  const repository = new HttpPaymentDetailRepository();
  const useCase = new GetPaymentDetailUseCase(repository);

  const paymentDetail = await useCase.execute(id);

  return {
    id: paymentDetail.id,
    amount: paymentDetail.amount,
    status: paymentDetail.status,
    createdAt: paymentDetail.createdAt,
    reviewedAt: paymentDetail.reviewedAt,
    reviewBy: paymentDetail.reviewBy,
    codeOperation: paymentDetail.codeOperation,
    banckName: paymentDetail.banckName,
    dateOperation: paymentDetail.dateOperation,
    numberTicket: paymentDetail.numberTicket,
    paymentConfig: paymentDetail.paymentConfig,
    user: {
      id: paymentDetail.user.id,
      email: paymentDetail.user.email,
      document: paymentDetail.user.document,
      firstName: paymentDetail.user.firstName,
      lastName: paymentDetail.user.lastName
    },
    currency: paymentDetail.currency,
    reason: paymentDetail.reason,
    client: {
      address: paymentDetail.client.address,
      lead: {
        firstName: paymentDetail.client.lead.firstName,
        lastName: paymentDetail.client.lead.lastName,
        document: paymentDetail.client.lead.document
      }
    },
    lot: {
      name: paymentDetail.lot.name,
      lotPrice: paymentDetail.lot.lotPrice,
      block: paymentDetail.lot.block,
      stage: paymentDetail.lot.stage,
      project: paymentDetail.lot.project
    },
    vouchers: paymentDetail.vouchers.map((item) => ({
      id: item.id,
      url: item.url,
      amount: item.amount,
      bankName: item.bankName,
      transactionReference: item.transactionReference,
      transactionDate: item.transactionDate
    }))
  };
}

export async function approvePaymentDetail(
  id: number,
  dto: ApprovePaymentDTO
): Promise<PaymentApproveRejectResponse> {
  const repository = new HttpApprovePaymentRepository();
  const useCase = new ApprovePaymentUseCase(repository);

  const approvePayment = await useCase.execute(id, dto);

  return {
    id: approvePayment.id,
    relatedEntityType: approvePayment.relatedEntityId,
    relatedEntityId: approvePayment.relatedEntityId,
    amount: approvePayment.amount,
    methodPayment: approvePayment.methodPayment,
    numberTicker: approvePayment.numberTicker,
    codeOperation: approvePayment.codeOperation,
    status: approvePayment.status,
    createdAt: approvePayment.createdAt,
    vouchers: approvePayment.vouchers.map((item) => ({
      id: item.id,
      url: item.url,
      amount: item.amount,
      bankName: item.bankName,
      transactionReference: item.transactionReference,
      transactionDate: item.transactionDate
    }))
  };
}

export async function rejectPaymentDetail(
  id: number,
  dto: RejectPaymentDTO
): Promise<PaymentApproveRejectResponse> {
  const repository = new HttpRejectPaymentRepository();
  const useCase = new RejectPaymentUseCase(repository);

  const rejectPayment = await useCase.execute(id, dto);

  return {
    id: rejectPayment.id,
    relatedEntityType: rejectPayment.relatedEntityId,
    relatedEntityId: rejectPayment.relatedEntityId,
    amount: rejectPayment.amount,
    methodPayment: rejectPayment.methodPayment,
    numberTicker: rejectPayment.numberTicker,
    codeOperation: rejectPayment.codeOperation,
    status: rejectPayment.status,
    createdAt: rejectPayment.createdAt,
    vouchers: rejectPayment.vouchers.map((item) => ({
      id: item.id,
      url: item.url,
      amount: item.amount,
      bankName: item.bankName,
      transactionReference: item.transactionReference,
      transactionDate: item.transactionDate
    }))
  };
}

export async function completePaymentDetail(
  id: number,
  dto: PaymentCompleteDTO
): Promise<PaymentCompletedResponse> {
  const repository = new HttpCompletePaymentRepository();
  const useCase = new PaymentCompleteUseCase(repository);

  const response = await useCase.execute(id, dto);

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
}

export async function extendReservationPeriod(
  id: string,
  days: number
): Promise<ReservationResponse> {
  const repository = new HttpReservationPeriod();
  const useCase = new SaleReservationPeriodUseCase(repository);

  const response = await useCase.execute(id, days);

  revalidateTag('sales_vendor');

  return response;
}

export async function generateLeadReport(leadId: string) {
  try {
    const result = await httpClient<{
      success: string;
      message: string;
      data: {
        leadId: string;
        documentUrl: string;
        generatedAt: string;
        clientName: string;
        documentNumber: string;
        leadInfo: {
          documentType: string;
          phone: string;
          source: string;
        };
        isNewDocument: boolean;
      };
    }>(`/api/reports-leads/generate/${leadId}`, {
      method: 'POST',
      cache: 'no-store'
    });

    revalidateTag('leads-of-day');

    return result;
  } catch (error) {
    console.error('Error generating lead report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al generar el reporte'
    };
  }
}

export async function regenerateLeadReport(leadId: string) {
  try {
    const result = await httpClient<{
      success: string;
      message: string;
      data: {
        leadId: string;
        documentUrl: string;
        generatedAt: string;
        clientName: string;
        documentNumber: string;
        leadInfo: {
          documentType: string;
          phone: string;
          source: string;
        };
        isNewDocument: boolean;
      };
    }>(`/api/reports-leads/regenerate/${leadId}`, {
      method: 'POST',
      cache: 'no-store'
    });

    revalidateTag('leads-of-day');

    return result;
  } catch (error) {
    console.error('Error regenerating lead report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al regenerar el reporte'
    };
  }
}
