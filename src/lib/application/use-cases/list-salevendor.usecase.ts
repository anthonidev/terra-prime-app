import {
  SaleDetailRepository,
  SaleListRepository,
  SaleVendorRepository
} from '@domain/repositories/salevendor.repository';
import { SaleList } from '@domain/entities/sales/salevendor.entity';
import { Meta } from '@infrastructure/types/pagination.types';

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
