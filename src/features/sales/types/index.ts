// Project types
export interface Project {
  id: string;
  name: string;
  currency: string;
  logo: string;
  logoPublicId: string;
  projectCode: string;
  createdAt: string;
}

// Stage types
export interface ProjectStage {
  id: string;
  name: string;
  createdAt: string;
}

// Block types
export interface ProjectBlock {
  id: string;
  name: string;
  createdAt: string;
}

// Lot types
export interface Lot {
  id: string;
  name: string;
  area: string;
  lotPrice: string;
  urbanizationPrice: string;
  totalPrice: number;
  status: string;
  blockId: string;
  blockName: string;
  stageId: string;
  stageName: string;
  projectId: string;
  projectName: string;
  projectCurrency: 'USD' | 'PEN';
  createdAt: string;
  updatedAt: string;
}

// Query params
export interface LotsQueryParams {
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  stageId?: string;
  blockId?: string;
  term?: string;
}
