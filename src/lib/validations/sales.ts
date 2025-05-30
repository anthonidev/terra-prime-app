import * as z from 'zod';

export const createSaleSchema = z.object({
  lotId: z.string(),
  saleType: z.enum(['DIRECT_PAYMENT', 'FINANCED']),
  clientId: z.number(),
  guarantorId: z.number(),
  paymentDate: z.string(),
  saleDate: z.string(),
  contractDate: z.string(),
  methodPayment: z.enum(['VOUCHER']),
  totalAmount: z.number(),
  totalAmountUrbanDevelopment: z.number().min(0)
});

export const createSaleFinanceSchema = z.object({
  lotId: z.string(),
  saleType: z.enum(['DIRECT_PAYMENT', 'FINANCED']),
  clientId: z.number(),
  guarantorId: z.number(),
  paymentDate: z.string(),
  saleDate: z.string(),
  contractDate: z.string(),
  totalAmount: z
    .union([z.number(), z.string().transform((val) => Number(val))])
    .pipe(z.number().min(0).default(0)),
  totalAmountUrbanDevelopment: z.number().min(0),
  quantityHuCuotes: z.number().min(0).optional(),
  initialAmountUrbanDevelopment: z.number().min(0).optional(),
  firstPaymentDateHu: z.string().optional(),
  initialAmount: z
    .union([z.number(), z.string().transform((val) => Number(val))])
    .pipe(z.number().min(0)),
  interestRate: z
    .union([z.number(), z.string().transform((val) => Number(val))])
    .pipe(z.number().min(0).default(13)),
  quantitySaleCoutes: z
    .union([z.number(), z.string().transform((val) => Number(val))])
    .pipe(z.number().min(1)),
  financingInstallments: z.array(
    z.object({
      couteAmount: z.number(),
      expectedPaymentDate: z.string()
    })
  )
});

export type SaleFormData = z.infer<typeof createSaleFinanceSchema>;
