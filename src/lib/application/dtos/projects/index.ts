export interface CreateProjectDTO {
  name: string;
  currency: string;
  isActive?: boolean;
  logo?: string;
  logoPublicId?: string;
}

export interface UpdateProjectDTO {
  name?: string;
  currency?: string;
  isActive?: boolean;
  logo?: string;
  logoPublicId?: string;
}

export interface ValidateProjectExcelDTO {
  file: FormData;
}

export interface CreateBulkProjectDTO {
  formData: FormData;
}

export interface GetProjectDetailDTO {
  id: string;
}

export interface GetProjectLotsDTO {
  projectId: string;
  params?: Record<string, unknown>;
}

export interface UpdateProjectWithImageDTO {
  id: string;
  formData: FormData;
}

export interface CreateStageDTO {
  name: string;
  isActive?: boolean;
  projectId: string;
}

export interface UpdateStageDTO {
  name?: string;
  isActive?: boolean;
}

export interface CreateBlockDTO {
  name: string;
  isActive?: boolean;
  stageId: string;
}

export interface UpdateBlockDTO {
  name?: string;
  isActive?: boolean;
}

export interface CreateLotDTO {
  name: string;
  area: number;
  lotPrice: number;
  urbanizationPrice?: number;
  status?: string;
  blockId: string;
}

export interface UpdateLotDTO {
  name?: string;
  area?: number;
  lotPrice?: number;
  urbanizationPrice?: number;
  status?: string;
}
