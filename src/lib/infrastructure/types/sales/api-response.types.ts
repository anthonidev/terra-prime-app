import { LeadsOfDay, Source, Ubigeo } from '@domain/entities/sales/leadsvendors.entity';
import { Amortization } from '@domain/entities/sales/amortization.entity';
import { Meta } from '@infrastructure/types/pagination.types';
import { PaymentListItem, Voucher, StatusPayment } from '@domain/entities/sales/payment.entity';
import { SaleList, StatusSale } from '@domain/entities/sales/salevendor.entity';

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

export interface LeadsOfDayResponse {
  items: LeadsOfDay[];
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
