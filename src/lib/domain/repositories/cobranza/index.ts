import {
  CollectionsClientResponse,
  CollectorsListResponse,
  PaidInstallmentsResponse,
  PaymentsByCollectorResponse,
  SalesCollectorResponse
} from '@infrastructure/types/cobranza';
import { ClientByUser, CollectionsClient, ListByClient } from '@domain/entities/cobranza';
import { AssignClientsCollectorDTO, PaidInstallmentsDTO } from '@application/dtos/cobranza';
import { PaymentDetailItem } from '@domain/entities/sales/payment.entity';
import { PaymentWithCollectorResponse } from '@infrastructure/types/sales/api-response.types';

export interface CollectorsListRepository {
  getData(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<CollectorsListResponse>;
}

export interface CollectionsClientRepository {
  getData(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<CollectionsClientResponse>;
}

export interface AssignClientsCollectorRepository {
  onAssign(dto: AssignClientsCollectorDTO): Promise<CollectionsClient[]>;
}

export interface ClientsByUserRepository {
  getData(): Promise<ClientByUser[]>;
}

export interface ListByClientRepository {
  getDataByClient(id: number): Promise<ListByClient[]>;
}

export interface SaleCollectorRepository {
  getData(id: string): Promise<SalesCollectorResponse>;
}

export interface PaidInstallmentsRepository {
  paid(id: string, dto: PaidInstallmentsDTO): Promise<PaidInstallmentsResponse>;
}

export interface PaymentsByCollectorRepository {
  getData(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<PaymentsByCollectorResponse>;
}

export interface PaymentByCollectorRepository {
  getData(id: number): Promise<PaymentDetailItem>;
}

export interface PaymentsWithSupervisorRepository {
  getData(params?: {
    order?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    collectorId?: string;
  }): Promise<PaymentWithCollectorResponse>;
}
