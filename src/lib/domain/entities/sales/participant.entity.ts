export enum ParticipantType {
  LINER = 'LINER',
  TELEMARKETING_SUPERVISOR = 'TELEMARKETING_SUPERVISOR',
  TELEMARKETING_CONFIRMER = 'TELEMARKETING_CONFIRMER',
  TELEMARKETER = 'TELEMARKETER',
  FIELD_MANAGER = 'FIELD_MANAGER',
  FIELD_SUPERVISOR = 'FIELD_SUPERVISOR',
  FIELD_SELLER = 'FIELD_SELLER'
}

export enum DocumentType {
  DNI = 'DNI',
  CE = 'CE',
  RUC = 'RUC'
}

export class Participant {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly document: string,
    public readonly documentType: DocumentType,
    public readonly phone: string,
    public readonly address: string,
    public readonly participantType: ParticipantType,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}
}
