export interface AssignClientsCollectorDTO {
  clientsId: number[];
  collectorId: string;
}

interface Payment {
  bankName: string;
  transactionReference: string;
  transactionDate: string;
  amount: number;
  fileIndex?: number;
}

export interface PaidInstallmentsDTO {
  payments: Payment[];
  files: File[];
  amountPaid: number;
}
