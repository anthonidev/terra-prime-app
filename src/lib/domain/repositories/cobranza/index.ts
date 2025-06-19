import {
  CollectionsClientResponse,
  CollectorsListResponse,
  PaidInstallmentsResponse,
  SalesCollectorResponse
} from '@infrastructure/types/cobranza';
import { ClientByUser, CollectionsClient, ListByClient } from '@domain/entities/cobranza';
import { AssignClientsCollectorDTO, PaidInstallmentsDTO } from '@application/dtos/cobranza';

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
