export class Source {
  constructor(
    public readonly id: number,
    public readonly name: string
  ) {}
}

export class Ubigeo {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly code: string,
    public readonly parentId?: number
  ) {}
}

export class BasicVendor {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly document: string
  ) {}
}

export class LeadsVendor {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly document: string,
    public readonly documentType: string,
    public readonly phone: string,
    public readonly phone2: string | undefined,
    public readonly age: number,
    public readonly createdAt: string,
    public readonly source: Source,
    public readonly ubigeo: Ubigeo
  ) {}
}

export class VendorsActives {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly document: string,
    public readonly photo: string,
    public readonly createdAt: string
  ) {}
}

export interface LeadMetadata {
  estadoCivil?: string;
  tieneTarjetasCredito?: boolean;
  cantidadTarjetasCredito?: number;
  tieneTarjetasDebito?: boolean;
  cantidadTarjetasDebito?: number;
  cantidadHijos?: number;
}

export interface LeadVisit {
  id: string;
  arrivalTime: string;
  departureTime: string | null;
  observations: string | null;
}

export class LeadsOfDay {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly document: string,
    public readonly documentType: string,
    public readonly phone: string,
    public readonly phone2: string | undefined,
    public readonly age: number,
    public readonly isActive: boolean,
    public readonly createdAt: string,
    public readonly isInOffice: boolean,
    public readonly interestProjects: string[],
    public readonly companionFullName: string | null,
    public readonly companionDni: string | null,
    public readonly companionRelationship: string | null,
    public readonly metadata: LeadMetadata | null,
    public readonly reportPdfUrl: string | null,
    public readonly visits: LeadVisit[],
    public readonly source: Source,
    public readonly ubigeo: Ubigeo,
    public readonly vendor: BasicVendor | null,
    public readonly liner: BasicVendor | null,
    public readonly telemarketingSupervisor: BasicVendor | null,
    public readonly telemarketingConfirmer: BasicVendor | null,
    public readonly telemarketer: BasicVendor | null,
    public readonly fieldManager: BasicVendor | null,
    public readonly fieldSupervisor: BasicVendor | null,
    public readonly fieldSeller: BasicVendor | null
  ) {}
}
