import * as z from 'zod';

export const createSaleSchema = z.object({
  lotId: z.string(),
  saleType: z.string(),
  clientId: z.number(),
  guarantorId: z.number(),
  paymentDate: z.string(),
  saleDate: z.string(),
  contractDate: z.string(),
  methodPayment: z.enum(['DIRECT_PAYMENT', 'FINANCED']),
  totalAmount: z.number(),
  totalAmountUrbanDevelopment: z.number().min(1, 'Debe tener al menos 1 cuota')
});

export const createSaleFinanceSchema = z.object({
  lotId: z.string(),
  saleType: z.string(),
  clientId: z.number(),
  reservationId: z.string(),
  guarantorId: z.number(),
  paymentDate: z.string(),
  saleDate: z.string(),
  contractDate: z.string(),
  methodPayment: z.enum(['DIRECT_PAYMENT', 'FINANCED']),
  totalAmount: z.number(),
  totalAmountUrbanDevelopment: z.number().min(1, 'Debe tener al menos 1 cuota'),
  quantityHuCuotes: z.number(),
  initialAmountUrbanDevelopment: z.number(),
  firstPaymentDateHu: z
    .string()
    .min(1, 'La fecha es requerida')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  initialAmount: z.number(),
  interestRate: z.number(),
  quantitySaleCoutes: z.number().min(1).max(74),
  financingInstallments: z.array(
    z.object({
      couteAmount: z.number(),
      expectedPaymentDate: z.string()
    })
  )
});

export type SaleFormData = z.infer<typeof createSaleFinanceSchema>;
