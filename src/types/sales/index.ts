export interface CreateSalePayload {
  lotId: string;
  saleType: 'DIRECT_PAYMENT' | 'FINANCED';
  clientId: number;
  isReservation?: boolean;
  reservationAmount?: number;
  maximumHoldPeriod?: number;
  secondaryClientsIds: number[];
  guarantorId: number;
  totalAmount: number;

  totalAmountUrbanDevelopment: number;
  quantityHuCuotes?: number;
  initialAmountUrbanDevelopment?: number;
  firstPaymentDateHu?: string;

  initialAmount?: number;
  interestRate?: number;
  quantitySaleCoutes?: number;
  financingInstallments?: Array<{
    couteAmount: number;
    expectedPaymentDate: string;
  }>;
  
  notes?: string;
}
