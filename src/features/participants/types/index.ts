import type { PaginationMeta, PaginatedResponse } from '@/shared/types/pagination';

export type { PaginationMeta, PaginatedResponse };

export enum ParticipantType {
  LINER = 'LINER',
  TELEMARKETING_SUPERVISOR = 'TELEMARKETING_SUPERVISOR',
  TELEMARKETING_CONFIRMER = 'TELEMARKETING_CONFIRMER',
  TELEMARKETER = 'TELEMARKETER',
  FIELD_MANAGER = 'FIELD_MANAGER',
  FIELD_SUPERVISOR = 'FIELD_SUPERVISOR',
  FIELD_SELLER = 'FIELD_SELLER',
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_GENERAL_MANAGER = 'SALES_GENERAL_MANAGER',
  POST_SALE = 'POST_SALE',
  CLOSER = 'CLOSER',
  GENERAL_DIRECTOR = 'GENERAL_DIRECTOR',
}

export enum DocumentType {
  DNI = 'DNI',
  RUC = 'RUC',
  CE = 'CE',
  PASSPORT = 'PASSPORT',
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  document: string;
  documentType: DocumentType;
  phone: string;
  address: string;
  participantType: ParticipantType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: ParticipantType;
}

export interface CreateParticipantInput {
  firstName: string;
  lastName: string;
  email?: string;
  document: string;
  documentType: DocumentType;
  phone: string;
  address: string;
  participantType: ParticipantType;
}

export interface UpdateParticipantInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  document?: string;
  documentType?: DocumentType;
  phone?: string;
  address?: string;
  participantType?: ParticipantType;
  isActive?: boolean;
}
