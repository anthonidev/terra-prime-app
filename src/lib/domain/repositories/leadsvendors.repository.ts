import { Meta } from '@infrastructure/types/pagination.types';
import {
  LeadsOfDay,
  LeadsVendor,
  VendorsActives
} from '@domain/entities/sales/leadsvendors.entity';
import { AssignLeadsToVendorDTO } from '@application/dtos/bienvenidos.dto';

export interface LeadsVendorRepository {
  getLeadsVendor(): Promise<LeadsVendor[]>;
}

export interface VendorsActivesRepository {
  getData(): Promise<VendorsActives[]>;
}

export interface LeadsOfDayRepository {
  getData(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: LeadsOfDay[]; meta: Meta }>;
}

export interface AssignLeadsVendorRepository {
  onAssign(dto: AssignLeadsToVendorDTO): Promise<LeadsOfDay[]>;
}
