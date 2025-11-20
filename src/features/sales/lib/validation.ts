import { z } from 'zod';
import { SaleType, DocumentType } from '../types';

// Step 2 validation - Sale type and reservation
export const step2Schema = z
  .object({
    saleType: z.nativeEnum(SaleType),
    isReservation: z.boolean(),
    reservationAmount: z.number().min(0, 'El monto debe ser mayor o igual a 0').optional(),
    maximumHoldPeriod: z.number().min(1, 'El periodo debe ser mayor a 0').optional(),
  })
  .refine(
    (data) => {
      if (data.isReservation) {
        return data.reservationAmount !== undefined && data.reservationAmount > 0;
      }
      return true;
    },
    {
      message: 'El monto de reserva es requerido cuando se separa el lote',
      path: ['reservationAmount'],
    }
  )
  .refine(
    (data) => {
      if (data.isReservation) {
        return data.maximumHoldPeriod !== undefined && data.maximumHoldPeriod > 0;
      }
      return true;
    },
    {
      message: 'El periodo máximo de separación es requerido',
      path: ['maximumHoldPeriod'],
    }
  );

// Step 3 validation - Direct payment
export const step3DirectPaymentSchema = z.object({
  totalAmount: z.number().min(0, 'El monto total debe ser mayor o igual a 0'),
  totalAmountUrbanDevelopment: z.number().min(0, 'El monto debe ser mayor o igual a 0'),
  initialAmountUrbanDevelopment: z.number().optional(),
  quantityHuCuotes: z.number().min(1, 'Debe ser al menos 1 cuota').optional(),
  firstPaymentDateHu: z.string().optional(),
});

// Step 3 validation - Financed
export const step3FinancedSchema = z.object({
  totalAmount: z.number().min(0, 'El monto total debe ser mayor o igual a 0'),
  initialAmount: z.number().min(0.01, 'La cuota inicial debe ser mayor a 0'),
  interestRate: z
    .number()
    .min(0, 'La tasa de interés debe ser mayor o igual a 0')
    .max(100, 'La tasa no puede ser mayor a 100%'),
  quantitySaleCoutes: z.number().min(1, 'Debe ser al menos 1 cuota'),
  firstPaymentDate: z.string().min(1, 'La fecha de primera cuota es requerida'),
  totalAmountUrbanDevelopment: z.number().min(0, 'El monto debe ser mayor o igual a 0'),
  initialAmountUrbanDevelopment: z.number().optional(),
  quantityHuCuotes: z.number().min(1, 'Debe ser al menos 1 cuota').optional(),
  firstPaymentDateHu: z.string().optional(),
});

// Guarantor validation
export const guarantorSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  document: z.string().min(8, 'El documento debe tener al menos 8 caracteres'),
  documentType: z.nativeEnum(DocumentType),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
});

// Secondary client validation
export const secondaryClientSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  document: z.string().min(8, 'El documento debe tener al menos 8 caracteres'),
  documentType: z.nativeEnum(DocumentType),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
});

// Step 4 validation - Client and guarantor
export const step4Schema = z.object({
  leadId: z.string().min(1, 'El cliente es requerido'),
  clientAddress: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  guarantor: guarantorSchema.optional(),
  secondaryClients: z.array(secondaryClientSchema).optional(),
});

// Voucher validation for register payment
export const voucherSchema = z.object({
  bankName: z.string().optional(),
  transactionReference: z.string().min(1, 'La referencia de transacción es requerida'),
  transactionDate: z.string().min(1, 'La fecha de transacción es requerida'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  file: z.instanceof(File, { message: 'El comprobante es requerido' }),
});

// Assign participants validation
export const assignParticipantsSchema = z.object({
  linerId: z.string().optional(),
  telemarketingSupervisorId: z.string().optional(),
  telemarketingConfirmerId: z.string().optional(),
  telemarketerId: z.string().optional(),
  fieldManagerId: z.string().optional(),
  fieldSupervisorId: z.string().optional(),
  fieldSellerId: z.string().optional(),
  salesManagerId: z.string().optional(),
  salesGeneralManagerId: z.string().optional(),
  postSaleId: z.string().optional(),
  closerId: z.string().optional(),
});

// Type inference
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3DirectPaymentFormData = z.infer<typeof step3DirectPaymentSchema>;
export type Step3FinancedFormData = z.infer<typeof step3FinancedSchema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type GuarantorFormData = z.infer<typeof guarantorSchema>;
export type SecondaryClientFormData = z.infer<typeof secondaryClientSchema>;
export type VoucherFormData = z.infer<typeof voucherSchema>;
export type AssignParticipantsFormData = z.infer<typeof assignParticipantsSchema>;
