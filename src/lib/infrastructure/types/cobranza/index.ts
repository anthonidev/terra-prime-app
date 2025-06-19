import { Voucher } from '@domain/entities/sales/payment.entity';
import {
  CollectionsClient,
  Collector,
  SalesCollector,
  UrbanFinancing
} from '@domain/entities/cobranza';
import { Meta } from '@infrastructure/types/pagination.types';

export interface CollectorsListResponse {
  items: Collector[];
  meta: Meta;
}

export interface CollectionsClientResponse {
  items: CollectionsClient[];
  meta: Meta;
}

export interface SalesCollectorResponse {
  sale: SalesCollector;
  urbanDevelopment: UrbanFinancing;
}

export interface PaidInstallmentsResponse {
  id: number;
  relatedEntityType: string;
  relatedEntityId: string;
  amount: number;
  methodPayment: string;
  numberTicker: string;
  codeOperation: string;
  rejectionReason: string;
  status: string;
  createdAt: string;
  vouchers: Voucher[];
}
