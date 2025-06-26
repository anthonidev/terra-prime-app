import {
  FieldManager,
  FieldSeller,
  FieldSupervisor,
  Liner,
  Telemarketer,
  TelemarketingConfirmer,
  TelemarketingSupervisor
} from './participant.entity';
import { ReviewByBasic, StatusPayment } from './payment.entity';

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

export enum SaleType {
  FINANCED = 'FINANCED',
  DIRECT_PAYMENT = 'DIRECT_PAYMENT'
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
    public readonly lotPrice: string,
    public readonly block: string,
    public readonly stage: string,
    public readonly project: string
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

export class PaymentSummary {
  constructor(
    public readonly id: number,
    public readonly amount: number,
    public readonly status: StatusPayment,
    public readonly createdAt: string,
    public readonly reviewedAt: string,
    public readonly reviewBy: ReviewByBasic | null,
    public readonly codeOperation: string,
    public readonly banckName: string,
    public readonly dateOperation: string,
    public readonly numberTicket: string,
    public readonly paymentConfig: string,
    public readonly reason: string | null
  ) {}
}

export class SaleList {
  constructor(
    public readonly id: string,
    public readonly type: SaleType,
    public readonly totalAmount: string,
    public readonly status: StatusSale,
    public readonly currency: CurrencyType,
    public readonly client: Client,
    public readonly secondaryClients: SecondaryClient[] | null,
    public readonly lot: Lot,
    public readonly financing: Financing | null,
    public readonly liner: Liner | null,
    public readonly telemarketingSupervisor: TelemarketingSupervisor | null,
    public readonly telemarketingConfirmer: TelemarketingConfirmer | null,
    public readonly telemarketer: Telemarketer | null,
    public readonly fieldManager: FieldManager | null,
    public readonly fieldSupervisor: FieldSupervisor | null,
    public readonly fieldSeller: FieldSeller | null,
    public readonly guarantor: Guarantor | null,
    public readonly reservation: Reservation | null,
    public readonly vendor: Vendor,
    public readonly paymentsSummary: PaymentSummary[]
  ) {}
}
