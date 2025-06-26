export interface CreateParticipantDTO {
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  documentType: string;
  phone: string;
  address: string;
  participantType: string;
}

export interface UpdateParticipantDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  document?: string;
  documentType?: string;
  phone?: string;
  address?: string;
  participantType?: string;
}
