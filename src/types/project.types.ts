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

// Interfaces para los proyectos una vez creados
export interface Project {
    id: string;
    name: string;
    description?: string;
    currency: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    totalLots: number;
    totalArea: number;
    totalValue: number;
}

export interface ProjectList {
    id: string;
    name: string;
    currency: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    totalLots: number;
    totalArea: number;
    totalValue: number;
}

export interface PaginatedProjects {
    items: ProjectList[];
    meta: PaginatedMeta;
}

export interface PaginatedMeta {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

// Interfaces para las operaciones CRUD
export interface CreateProjectDto {
    name: string;
    description?: string;
    currency: string;
    isActive?: boolean;
}

export interface UpdateProjectDto {
    name?: string;
    description?: string;
    currency?: string;
    isActive?: boolean;
}

// Interfaces para operaciones con lotes
export interface ProjectLot {
    id: string;
    stage: string;
    block: string;
    lot: string;
    area: number;
    lotPrice: number;
    urbanizationPrice: number;
    totalPrice: number;
    status: string;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetProjectsParams {
    search?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    order?: "ASC" | "DESC";
}