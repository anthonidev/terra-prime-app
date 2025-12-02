export interface CollectorStatistic {
  collectorId: string;
  collectorDocument: string;
  collectorName: string;
  collectorEmail: string;
  numberOfClients: number;
  collectedAmountPEN: number;
  collectedAmountUSD: number;
  pendingAmountPEN: number;
  pendingAmountUSD: number;
  photo?: string | null;
}

export interface GetCollectorStatisticsParams {
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  month?: number;
  year?: number;
}

export interface GetCollectorStatisticsResponse {
  items: CollectorStatistic[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

// Clients Admin Types

export interface Ubigeo {
  id: number;
  name: string;
}

export interface ActiveCollector {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ClientLead {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  documentType: string;
  phone?: string;
  phone2?: string;
  email?: string; // Added as it's common in UserInfo
  age?: number;
  createdAt: string;
  source?: {
    id: number;
    name: string;
  };
  ubigeo?: {
    departamento: string;
    provincia: string;
    distrito: string;
  };
}

export interface Client {
  id: number;
  address: string;
  lead: ClientLead;
  collector: ActiveCollector | null;
  createdAt: string;
  hasActiveLatePayment: boolean;
}

export interface GetClientsParams {
  page?: number;
  limit?: number;
  departamentoId?: number;
  provinciaId?: number;
  distritoId?: number;
  collectorId?: string;
  search?: string;
}

export interface GetClientsResponse {
  items: Client[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface AssignClientsPayload {
  clientsId: number[];
  collectorId: string;
}

export enum StatusSale {
  RESERVATION_PENDING = 'RESERVATION_PENDING',
  RESERVATION_PENDING_APPROVAL = 'RESERVATION_PENDING_APPROVAL',
  RESERVED = 'RESERVED',
  PENDING = 'PENDING',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  IN_PAYMENT_PROCESS = 'IN_PAYMENT_PROCESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface SaleItem {
  id: string;
  type: string;
  totalAmount: string;
  status: StatusSale;
  createdAt: string;
  currency: string;
  lot: {
    id: string;
    name: string;
    block: string;
    stage: string;
    project: string;
  };
  radicationPdfUrl: string | null;
  paymentAcordPdfUrl: string | null;
  financing?: {
    id: string;
    initialAmount: string;
    interestRate: string;
    quantityCoutes: string;
  };
  vendor: {
    document: string;
    firstName: string;
    lastName: string;
  };
}

export interface GetClientSalesResponse {
  client: {
    id: number;
    address: string;
    firstName: string;
    lastName: string;
    phone: string;
    document: string;
    documentType: string;
    age: number;
    ubigeo: {
      departamento: string;
      provincia: string;
      distrito: string;
    };
    reportPdfUrl: string | null;
  };
  items: SaleItem[];
}

export enum StatusPayment {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface Payment {
  id: number;
  amount: string;
  status: StatusPayment;
  numberTicket: string | null;
  rejectionReason: string | null;
}

export interface Installment {
  id: string;
  couteAmount: string;
  coutePaid: number;
  coutePending: string;
  expectedPaymentDate: string;
  lateFeeAmountPending: string;
  lateFeeAmountPaid: number;
  status: StatusPayment;
  payments: Payment[];
}

export interface Financing {
  id: string;
  initialAmount: string;
  interestRate: string;
  quantityCoutes: string;
  financingInstallments: Installment[];
}

export interface SaleDetail {
  id: string;
  type: string;
  totalAmount: string;
  status: StatusSale;
  createdAt: string;
  reservationAmount: string | null;
  maximumHoldPeriod: string | null;
  fromReservation: boolean;
  currency: string;
  guarantor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    documentType: string;
    document: string;
  } | null;
  secondaryClients:
    | {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        documentType: string;
        document: string;
      }[]
    | null;
  lot: {
    id: string;
    name: string;
    lotPrice: string;
    block: string;
    stage: string;
    project: string;
  };
  radicationPdfUrl: string | null;
  paymentAcordPdfUrl: string | null;
  financing: Financing;
  urbanDevelopment?: {
    id: number;
    amount: string;
    initialAmount: string;
    status: StatusSale;
    financing: Financing;
  };
  vendor: {
    document: string;
    firstName: string;
    lastName: string;
  };
}

export interface GetSaleDetailResponse {
  client: {
    id: number;
    address: string;
    firstName: string;
    lastName: string;
    phone: string;
    document: string;
    documentType: string;
    age: number;
    ubigeo: {
      departamento: string;
      provincia: string;
      distrito: string;
    };
    reportPdfUrl: string | null;
  };
  sale: SaleDetail;
}

export interface GetAssignedClientsParams {
  page?: number;
  limit?: number;
  departamentoId?: number;
  provinciaId?: number;
  distritoId?: number;
  search?: string;
}

export interface GetAssignedClientsResponse {
  items: Client[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
