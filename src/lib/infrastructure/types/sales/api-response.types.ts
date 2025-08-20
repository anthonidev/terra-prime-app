import {
  Source,
  Ubigeo,
  BasicVendor,
  LeadMetadata,
  LeadVisit
} from '@domain/entities/sales/leadsvendors.entity';
import { Amortization } from '@domain/entities/sales/amortization.entity';
import { Meta } from '@infrastructure/types/pagination.types';
import { PaymentListItem, Voucher, StatusPayment } from '@domain/entities/sales/payment.entity';
import { SaleList, StatusSale } from '@domain/entities/sales/salevendor.entity';
import { PaymentWithCollector } from '@domain/entities/cobranza';

export interface AmortizationResponse {
  installments: Amortization[];
}

export interface LeadsVendorResponse {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: string;
  phone: string;
  phone2: string | undefined;
  age: number;
  createdAt: string;
  source: Source;
  ubigeo: Ubigeo;
}

export interface VendorsActivesResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  photo: string;
  createdAt: string;
}

export interface LeadsOfDayItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  documentType: string;
  phone: string;
  phone2: string | undefined;
  age: number;
  isActive: boolean;
  createdAt: string;
  isInOffice: boolean;
  interestProjects: string[];
  companionFullName: string | null;
  companionDni: string | null;
  companionRelationship: string | null;
  metadata: LeadMetadata | null;
  reportPdfUrl: string | null;
  visits: LeadVisit[];
  source: Source;
  ubigeo: Ubigeo;
  vendor: BasicVendor | null;
  liner: BasicVendor | null;
  telemarketingSupervisor: BasicVendor | null;
  telemarketingConfirmer: BasicVendor | null;
  telemarketer: BasicVendor | null;
  fieldManager: BasicVendor | null;
  fieldSupervisor: BasicVendor | null;
  fieldSeller: BasicVendor | null;
}

export interface LeadsOfDayResponse {
  items: LeadsOfDayItem[];
  meta: Meta;
}

export interface ClientResponse {
  id: number;
  address: string;
}

export interface ClientGuarantorResponse {
  clientId: number;
  guarantorId: number;
  secondaryClientIds: number[];
}

export interface PaymentResponse {
  id: number;
  relatedEntityType: string;
  relatedEntityId: string;
  amount: number;
  methodPayment: string;
  status: StatusPayment;
  createdAt: string;
  vouchers: Voucher[];
}

export interface SalesListVendorResponse {
  items: SaleList[];
  meta: Meta;
}

export interface SalesListResponse {
  items: SaleList[];
  meta: Meta;
}

export interface PaymentListResponse {
  items: PaymentListItem[];
  meta: Meta;
}

export interface PaymentApproveRejectResponse {
  id: number;
  relatedEntityType: string;
  relatedEntityId: string;
  amount: number;
  methodPayment: string;
  numberTicker: string;
  codeOperation: string;
  status: string;
  createdAt: string;
  vouchers: Voucher[];
}

export interface PaymentCompletedResponse {
  id: number;
  relatedEntityType: string;
  relatedEntityId: string;
  amount: number;
  methodPayment: string;
  numberTicker: string;
  codeOperation: string;
  status: StatusSale;
  createdAt: string;
}

export interface SaleReportResponse {
  success: boolean;
  message: string;
  data: {
    saleId: string;
    documentUrl: string;
    generatedAt: string;
    clientName: string;
    lotName: string;
    saleInfo: {
      type: string;
      totalAmount: string;
      projectName: string;
    };
    isNewDocument: boolean;
  };
}

export interface ReservationResponse {
  saleId: string;
  previousPeriod: number;
  newPeriod: number;
  newExpirationDate: string;
  message: string;
}

export interface PaymentWithCollectorResponse {
  items: PaymentWithCollector[];
  meta: Meta;
}
