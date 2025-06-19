export enum StatusSale {
  PENDING = 'PENDING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  IN_PAYMENT_PROCESS = 'IN_PAYMENT_PROCESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum CurrencyType {
  USD = 'USD',
  PEN = 'PEN'
}

export class FinancingInstallment {
  constructor(
    public readonly id: string,
    public readonly couteAmount: string,
    public readonly coutePending: string,
    public readonly coutePaid: string,
    public readonly expectedPaymentDate: string,
    public readonly status: string
  ) {}
}

export class Financing {
  constructor(
    public readonly id: string,
    public readonly initialAmount: string,
    public readonly interestRate: string,
    public readonly quantityCoutes: string,
    public readonly financingInstallments: FinancingInstallment[]
  ) {}
}

export class Client {
  constructor(
    public readonly address: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone: string
  ) {}
}

export class SecondaryClient {
  constructor(
    public readonly address: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone: string
  ) {}
}

export class Lot {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly lotPrice: string
  ) {}
}

export class Guarantor {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string
  ) {}
}

export class Reservation {
  constructor(
    public readonly id: string,
    public readonly amount: string
  ) {}
}

export class Vendor {
  constructor(
    public readonly document: string,
    public readonly firstName: string,
    public readonly lastName: string
  ) {}
}

export class SaleList {
  constructor(
    public readonly id: string,
    public readonly type: 'DIRECT_PAYMENT' | 'FINANCED',
    public readonly totalAmount: string,
    public readonly status: StatusSale,
    public readonly currency: CurrencyType,
    public readonly client: Client,
    public readonly secondaryClients: SecondaryClient[] | null,
    public readonly lot: Lot,
    public readonly financing: Financing | null,
    public readonly guarantor: Guarantor | null,
    public readonly reservation: Reservation | null,
    public readonly vendor: Vendor
  ) {}
}
