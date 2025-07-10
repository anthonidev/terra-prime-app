import { Meta } from '@infrastructure/types/pagination.types';
import { SaleList } from '@domain/entities/sales/salevendor.entity';
import { ReservationResponse } from '@infrastructure/types/sales/api-response.types';

export interface SaleVendorRepository {
  getData(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: SaleList[]; meta: Meta }>;
}

export interface SaleListRepository {
  getData(params?: {
    order?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: SaleList[]; meta: Meta }>;
}

export interface SaleDetailRepository {
  getData(id: string): Promise<SaleList>;
}

export interface SaleReservationPeriodRepository {
  additionalDays(id: string, days: number): Promise<ReservationResponse>;
}
