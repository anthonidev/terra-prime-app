interface PaymentItemDto {
  bankName: string;
  transactionReference: string;
  transactionDate: string;
  amount: number;
  fileIndex?: number;
}

export interface ProcessPaymentDto {
  payments: PaymentItemDto[];
  files: File[];
}
