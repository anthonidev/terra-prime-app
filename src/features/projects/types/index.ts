import type { PaginationMeta, PaginatedResponse } from '@/shared/types/pagination';

export type { PaginationMeta, PaginatedResponse };

// Project Types
export interface ProjectSummary {
  id: string;
  name: string;
  currency: 'PEN' | 'USD';
  isActive: boolean;
  logo: string | null;
  stageCount: number;
  blockCount: number;
  lotCount: number;
  activeLotCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  projects: ProjectSummary[];
  total: number;
}

// Block Types
export interface Block {
  id: string;
  name: string;
  isActive: boolean;
  lotCount: number;
  stageId: string;
  activeLots: number;
  reservedLots: number;
  soldLots: number;
  inactiveLots: number;
}

// Stage Types
export interface Stage {
  id: string;
  name: string;
  isActive: boolean;
  blocks: Block[];
}

// Project Detail Types
export interface ProjectDetail {
  id: string;
  name: string;
  currency: 'PEN' | 'USD';
  isActive: boolean;
  logo: string | null;
  logoKey: string | null;
  stages: Stage[];
  createdAt: string;
  updatedAt: string;
}

// Lot Types
export type LotStatus = 'Activo' | 'Inactivo' | 'Vendido' | 'Separado';

export interface Lot {
  id: string;
  name: string;
  area: string;
  lotPrice: string;
  urbanizationPrice: string;
  totalPrice: number;
  status: LotStatus;
  blockId: string;
  blockName: string;
  stageId: string;
  stageName: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface LotsQueryParams {
  page?: number;
  limit?: number;
  stageId?: string;
  blockId?: string;
  status?: LotStatus;
  search?: string;
}

// Input Types for Mutations
export interface UpdateProjectInput {
  name?: string;
  isActive?: boolean;
  logo?: File;
}

export interface CreateStageInput {
  name: string;
  isActive?: boolean;
  projectId: string;
}

export interface UpdateStageInput {
  name?: string;
  isActive?: boolean;
}

export interface CreateBlockInput {
  name: string;
  isActive?: boolean;
  stageId: string;
}

export interface UpdateBlockInput {
  name?: string;
  isActive?: boolean;
}

export interface CreateLotInput {
  name: string;
  area: number;
  lotPrice: number;
  urbanizationPrice: number;
  blockId: string;
}

export interface UpdateLotInput {
  name?: string;
  area?: number;
  lotPrice?: number;
  urbanizationPrice?: number;
  status?: LotStatus;
}

// Bulk Creation Types
export interface ExcelLotData {
  stage: string;
  block: string;
  lot: string;
  area: number;
  lotPrice: number;
  urbanizationPrice: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'RESERVED';
}

export interface ValidatedExcelData {
  name: string;
  currency: string;
  lots: ExcelLotData[];
}

export interface ValidationError {
  row: number;
  column: string;
  message: string;
}

export interface ValidateExcelResponse {
  isValid: boolean;
  data?: ValidatedExcelData;
  errors?: ValidationError[];
}

export interface BulkCreateResponse {
  message: string;
  project: {
    id: string;
    name: string;
    currency: string;
    stages: {
      id: string;
      name: string;
      blocks: {
        id: string;
        name: string;
        lots: number;
      }[];
    }[];
    totalLots: number;
  };
}
