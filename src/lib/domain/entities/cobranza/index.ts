import { Source, Ubigeo } from '@domain/entities/sales/leadsvendors.entity';
import {
  Client,
  Financing,
  Guarantor,
  SecondaryClient,
  Vendor,
  CurrencyType,
  PaymentSummary
} from '@domain/entities/sales/salevendor.entity';
import { PaymentUser, ReviewByBasic, StatusPayment } from '../sales/payment.entity';

class Lead {
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
    public readonly vendor: null
  ) {}
}

export class Collector {
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

export class CollectionsClient {
  constructor(
    public readonly id: number,
    public readonly address: string,
    public readonly lead: Lead,
    public readonly collector: Collector | null,
    public readonly createdAt: string
  ) {}
}

export class ClientByUser {
  constructor(
    public readonly id: number,
    public readonly address: string,
    public readonly lead: Lead,
    public readonly createdAt: string
  ) {}
}

class LotProyect {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly lotPrice: string,
    public readonly block: string,
    public readonly stage: string,
    public readonly project: string
  ) {}
}

export enum StatusFinancingInstallments {
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  PAID = 'PAID'
}

export class FinancingInstallmentCollector {
  constructor(
    public readonly id: string,
    public readonly couteAmount: string,
    public readonly coutePending: string,
    public readonly coutePaid: string,
    public readonly expectedPaymentDate: string,
    public readonly lateFeeAmountPending: string,
    public readonly lateFeeAmountPaid: string,
    public readonly status: StatusFinancingInstallments
  ) {}
}

export class FinancingCollector {
  constructor(
    public readonly id: string,
    public readonly initialAmount: string,
    public readonly interestRate: string,
    public readonly quantityCoutes: string,
    public readonly financingInstallments: FinancingInstallmentCollector[]
  ) {}
}

export class ListByClient {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly totalAmount: string,
    public readonly status: string,
    public readonly client: Client,
    public readonly currency: string,
    public readonly secondaryClients: SecondaryClient[],
    public readonly lot: LotProyect,
    public readonly financing: Financing,
    public readonly guarantor: Guarantor,
    public readonly vendor: Vendor
  ) {}
}

export class SalesCollector {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly totalAmount: string,
    public readonly status: string,
    public readonly currency: CurrencyType,
    public readonly client: Client,
    public readonly secondaryClients: SecondaryClient[],
    public readonly lot: LotProyect,
    public readonly financing: FinancingCollector,
    public readonly guarantor: Guarantor,
    public readonly vendor: Vendor
  ) {}
}

export class UrbanFinancing {
  constructor(public readonly financing: FinancingCollector) {}
}

export class PaymentWithCollector implements PaymentSummary {
  constructor(
    public readonly id: number,
    public readonly amount: number,
    public readonly status: StatusPayment,
    public readonly createdAt: string,
    public readonly reviewedAt: string,
    public readonly reviewBy: ReviewByBasic,
    public readonly codeOperation: string,
    public readonly banckName: string,
    public readonly dateOperation: string,
    public readonly numberTicket: string,
    public readonly paymentConfig: string,
    public readonly reason: string,
    public readonly user: PaymentUser,
    public readonly currency: CurrencyType,
    public readonly client: {
      address: string;
      lead: {
        firstName: string;
        lastName: string;
        document: string;
      };
    },
    public readonly lot: {
      name: number;
      lotPrice: string;
      block: string;
      stage: string;
      project: string;
    }
  ) {}
}
