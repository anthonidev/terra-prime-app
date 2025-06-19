import {
  LeadsOfDayRepository,
  LeadsVendorRepository,
  VendorsActivesRepository
} from '@domain/repositories/leadsvendors.repository';

import {
  LeadsOfDay,
  LeadsVendor,
  VendorsActives
} from '@domain/entities/sales/leadsvendors.entity';

import { Meta } from '@infrastructure/types/pagination.types';

export class GetLeadsVendorUseCase {
  constructor(private readonly repository: LeadsVendorRepository) {}

  async execute(): Promise<LeadsVendor[]> {
    return this.repository.getLeadsVendor();
  }
}

export class GetVendorsActivesUseCase {
  constructor(private readonly repository: VendorsActivesRepository) {}

  async execute(): Promise<VendorsActives[]> {
    return this.repository.getData();
  }
}

export class GetLeadsOfDayUseCase {
  constructor(private readonly repository: LeadsOfDayRepository) {}

  async execute(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: LeadsOfDay[]; meta: Meta }> {
    const result = await this.repository.getData(params);
    return {
      items: result.items,
      meta: result.meta
    };
  }
}
