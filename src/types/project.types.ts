import { PaginatedMeta } from "./user.types";

// Interfaces relacionadas con la validación de Excel
export interface ExcelValidationResponse {
    isValid: boolean;
    data?: ProjectData;
    errors?: ValidationError[];
}

export interface ValidationError {
    row: number;
    column: string;
    message: string;
}

// Interfaces relacionadas con los datos del proyecto
export interface ProjectData {
    name: string;
    currency: string;
    lots: Lot[];
}

export interface Lot {
    stage: string;
    block: string;
    lot: string;
    area: number;
    lotPrice: number;
    urbanizationPrice: number;
    status: string;
}

export interface ProjectListItemDto {
    id: string;
    name: string;
    currency: string;
    isActive: boolean;
    logo: string | null;
    stageCount: number;
    blockCount: number;
    lotCount: number;
    activeLotCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectListResponseDto {
    projects: ProjectListItemDto[];
    total: number;
}

export interface BlockDetailDto {
    id: string;
    name: string;
    isActive: boolean;
    lotCount: number;
    activeLots: number;
    reservedLots: number;
    soldLots: number;
    inactiveLots: number;
}

export interface StageDetailDto {
    id: string;
    name: string;
    isActive: boolean;
    blocks: BlockDetailDto[];
}

export interface ProjectDetailDto {
    id: string;
    name: string;
    currency: string;
    isActive: boolean;
    logo: string | null;
    logoPublicId: string | null;
    stages: StageDetailDto[];
    createdAt: Date;
    updatedAt: Date;
}

export interface LotResponseDto {
    id: string;
    name: string;
    area: number;
    lotPrice: number;
    urbanizationPrice: number;
    totalPrice: number;
    status: string;
    blockId: string;
    blockName: string;
    stageId: string;
    stageName: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface PaginatedLotsResponseDto {
    items: LotResponseDto[];
    meta: PaginatedMeta;
}
export enum LotStatus {
    ACTIVE = 'Activo',
    INACTIVE = 'Inactivo',
    SOLD = 'Vendido',
    RESERVED = 'Separado',
}
export interface ProjectLotsFilterParams {
    page?: number;
    limit?: number;
    order?: 'ASC' | 'DESC';
    stageId?: string;
    blockId?: string;
    status?: LotStatus;
    search?: string;
}