// ── Enums ──

export enum TemplateStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum VariableType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  CURRENCY = 'CURRENCY',
  BOOLEAN = 'BOOLEAN',
  SELECT = 'SELECT',
  TABLE = 'TABLE',
  LIST = 'LIST',
}

export enum VariableCategory {
  SYSTEM = 'SYSTEM',
  SALE = 'SALE',
  FINANCING = 'FINANCING',
  CLIENT = 'CLIENT',
  PROJECT = 'PROJECT',
  PAYMENT = 'PAYMENT',
  CUSTOM = 'CUSTOM',
}

// ── Interfaces ──

export interface CustomVariable {
  key: string;
  label: string;
  type: VariableType;
  defaultValue?: string;
  options?: string[];
}

export interface PredefinedVariable {
  key: string;
  label: string;
  type: VariableType;
  category: VariableCategory;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  status: TemplateStatus;
  isActive: boolean;
  projectId: string;
  project?: {
    id: string;
    name: string;
  };
  customVariables: CustomVariable[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractTemplateListItem {
  id: string;
  name: string;
  description: string;
  contentPreview: Record<string, unknown>;
  status: TemplateStatus;
  isActive: boolean;
  project: {
    id: string;
    name: string;
  };
  customVariables: CustomVariable[];
  createdAt: string;
  updatedAt: string;
}

// ── Query Params ──

export interface TemplatesQueryParams {
  projectId?: string;
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  status?: TemplateStatus;
  term?: string;
}

// ── Inputs ──

export interface CreateTemplateInput {
  name: string;
  description: string;
  projectId: string;
  content: Record<string, unknown>;
  customVariables: CustomVariable[];
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string;
  content?: Record<string, unknown>;
  customVariables?: CustomVariable[];
}
