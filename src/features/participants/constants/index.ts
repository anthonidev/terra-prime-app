import { ParticipantType, DocumentType } from '../types';

export const PARTICIPANT_TYPE_LABELS: Record<ParticipantType, string> = {
  [ParticipantType.LINER]: 'Liner',
  [ParticipantType.TELEMARKETING_SUPERVISOR]: 'Supervisor de Telemarketing',
  [ParticipantType.TELEMARKETING_CONFIRMER]: 'Confirmador de Telemarketing',
  [ParticipantType.TELEMARKETER]: 'Telemarketer',
  [ParticipantType.FIELD_MANAGER]: 'Gerente de Campo',
  [ParticipantType.FIELD_SUPERVISOR]: 'Supervisor de Campo',
  [ParticipantType.FIELD_SELLER]: 'Vendedor de Campo',
  [ParticipantType.SALES_MANAGER]: 'Gerente de Ventas',
  [ParticipantType.SALES_GENERAL_MANAGER]: 'Gerente General de Ventas',
  [ParticipantType.POST_SALE]: 'Post Venta',
  [ParticipantType.CLOSER]: 'Closer',
  [ParticipantType.GENERAL_DIRECTOR]: 'Director General',
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.DNI]: 'DNI',
  [DocumentType.RUC]: 'RUC',
  [DocumentType.CE]: 'Carnet de Extranjería',
  [DocumentType.PASSPORT]: 'Pasaporte',
};
