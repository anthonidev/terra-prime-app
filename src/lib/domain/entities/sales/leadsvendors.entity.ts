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

export class LeadsOfDay {
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
    public readonly ubigeo: Ubigeo,
    public readonly vendor: BasicVendor | null
  ) {}
}
