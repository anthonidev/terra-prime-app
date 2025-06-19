export interface GetAmortizationDTO {
  totalAmount: number;
  initialAmount: number;
  reservationAmount: number;
  interestRate: number;
  numberOfPayments: number;
  firstPaymentDate: string;
  includeDecimals: boolean;
}
