import { LotProject } from '@/lib/domain/entities/lotes/lot.entity';
import { Meta } from '../pagination.types';

export interface ProjectsResponse {
  id: string;
  name: string;
  currency: string;
  logo: string;
  logoPublicId: string;
  projectCode: string;
  createdAt: string;
}

export interface ProjectStagesResponse {
  id: string;
  name: string;
  createdAt: string;
}

export interface ProjectBlocksResponse {
  id: string;
  name: string;
  createdAt: string;
}

export interface ProjectLotsResponse {
  id: string;
  name: string;
  area: string;
  lotPrice: string;
  urbanizationPrice: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface LotProjectResponse {
  items: LotProject[];
  meta: Meta;
}
