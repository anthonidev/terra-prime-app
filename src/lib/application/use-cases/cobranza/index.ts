import {
  AssignClientsCollectorRepository,
  ClientsByUserRepository,
  CollectionsClientRepository,
  CollectorsListRepository,
  ListByClientRepository,
  PaidInstallmentsRepository,
  PaymentByCollectorRepository,
  PaymentsByCollectorRepository,
  SaleCollectorRepository
} from '@domain/repositories/cobranza';
import {
  CollectionsClientResponse,
  CollectorsListResponse,
  PaidInstallmentsResponse,
  PaymentsByCollectorResponse,
  SalesCollectorResponse
} from '@infrastructure/types/cobranza';
import { AssignClientsCollectorDTO, PaidInstallmentsDTO } from '@application/dtos/cobranza';
import { ClientByUser, CollectionsClient, ListByClient } from '@domain/entities/cobranza';
import { PaymentDetailItem } from '@domain/entities/sales/payment.entity';

export class CollectorsListUseCase {
  constructor(private readonly repository: CollectorsListRepository) {}

  async execute(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<CollectorsListResponse> {
    return this.repository.getData(params);
  }
}

export class CollectionsClientUseCase {
  constructor(private readonly repository: CollectionsClientRepository) {}

  async execute(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<CollectionsClientResponse> {
    return this.repository.getData(params);
  }
}

export class AssignClientsCollectorUseCase {
  constructor(private readonly repository: AssignClientsCollectorRepository) {}

  async execute(dto: AssignClientsCollectorDTO): Promise<CollectionsClient[]> {
    return this.repository.onAssign(dto);
  }
}

export class ClientsByUserUseCase {
  constructor(private readonly repository: ClientsByUserRepository) {}

  async execute(): Promise<ClientByUser[]> {
    return this.repository.getData();
  }
}

export class ListByClientUseCase {
  constructor(private readonly repository: ListByClientRepository) {}

  async execute(id: number): Promise<ListByClient[]> {
    return this.repository.getDataByClient(id);
  }
}

export class SaleCollectorUseCase {
  constructor(private readonly repository: SaleCollectorRepository) {}

  async execute(id: string): Promise<SalesCollectorResponse> {
    return this.repository.getData(id);
  }
}

export class PaidInstallmentsUseCase {
  constructor(private readonly repository: PaidInstallmentsRepository) {}

  async execute(id: string, dto: PaidInstallmentsDTO): Promise<PaidInstallmentsResponse> {
    return this.repository.paid(id, dto);
  }
}

export class PaymentsByCollectorUseCase {
  constructor(private readonly repository: PaymentsByCollectorRepository) {}

  async execute(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<PaymentsByCollectorResponse> {
    return this.repository.getData(params);
  }
}

export class PaymentByCollectorUseCase {
  constructor(private readonly repository: PaymentByCollectorRepository) {}

  async execute(id: number): Promise<PaymentDetailItem> {
    return this.repository.getData(id);
  }
}
