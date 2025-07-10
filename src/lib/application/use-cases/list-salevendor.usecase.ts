import {
  SaleDetailRepository,
  SaleListRepository,
  SaleReservationPeriodRepository,
  SaleVendorRepository
} from '@domain/repositories/salevendor.repository';
import { SaleList } from '@domain/entities/sales/salevendor.entity';
import { Meta } from '@infrastructure/types/pagination.types';
import { ReservationResponse } from '@infrastructure/types/sales/api-response.types';

export class SaleVendorUseCase {
  constructor(private readonly repository: SaleVendorRepository) {}

  async execute(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: SaleList[]; meta: Meta }> {
    const result = await this.repository.getData(params);
    return {
      items: result.items,
      meta: result.meta
    };
  }
}

export class SaleListUseCase {
  constructor(private readonly repository: SaleListRepository) {}

  async execute(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: SaleList[]; meta: Meta }> {
    const result = await this.repository.getData(params);
    return {
      items: result.items,
      meta: result.meta
    };
  }
}

export class SaleDetailUseCase {
  constructor(private readonly repository: SaleDetailRepository) {}

  async execute(id: string): Promise<SaleList> {
    return this.repository.getData(id);
  }
}

export class SaleReservationPeriodUseCase {
  constructor(private readonly repository: SaleReservationPeriodRepository) {}

  async execute(id: string, days: number): Promise<ReservationResponse> {
    return this.repository.additionalDays(id, days);
  }
}
