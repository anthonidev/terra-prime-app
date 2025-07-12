export enum StatusPayment {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum CurrencyType {
  USD = 'USD',
  PEN = 'PEN'
}

export class ReviewByBasic {
  constructor(
    public readonly id: string,
    public readonly email: string
  ) {}
}

export class PaymentLot {
  constructor(
    public readonly name: string,
    public readonly lotPrice: string,
    public readonly block: string,
    public readonly stage: string,
    public readonly project: string
  ) {}
}

export class PaymentLead {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly document: string
  ) {}
}

export class PaymentClient {
  constructor(
    public readonly address: string,
    public readonly lead: PaymentLead
  ) {}
}

export class Voucher {
  constructor(
    public readonly id: number,
    public readonly url: string,
    public readonly amount: number,
    public readonly bankName: string,
    public readonly transactionReference: string,
    public readonly transactionDate: string
  ) {}
}

export class PaymentItem {
  constructor(
    public readonly bankName: string,
    public readonly transactionReference: string,
    public readonly transactionDate: Date,
    public readonly amount: number,
    public readonly fileIndex?: number
  ) {}
}

export class Payment {
  constructor(
    public readonly items: PaymentItem[],
    public readonly files: File[]
  ) {}
}

export class PaymentUser {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly document: string,
    public readonly firstName: string,
    public readonly lastName: string
  ) {}
}

export class PaymentListItem {
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
    public readonly user: PaymentUser,
    public readonly currency: CurrencyType,
    public readonly reason: string | null,
    public readonly client: PaymentClient,
    public readonly lot: PaymentLot
  ) {}
}

export class PaymentDetailItem {
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
    public readonly user: PaymentUser,
    public readonly currency: CurrencyType,
    public readonly reason: string | null,
    public readonly client: PaymentClient,
    public readonly lot: PaymentLot,
    public readonly vouchers: Voucher[]
  ) {}
}
