// ============================================================
// VALIDACION - Esquemas Zod para formularios de venta
// ============================================================
// Estos esquemas validan los datos del formulario multi-paso
// antes de enviarlos al backend.
// Se puede reutilizar la misma validacion en otro sistema.
// ============================================================

import { z } from 'zod';

// Enums replicados para validacion (no depender de tipos externos)
const SaleTypeEnum = z.enum(['DIRECT_PAYMENT', 'FINANCED']);
const DocumentTypeEnum = z.enum(['DNI', 'RUC', 'CE', 'Pasaporte']);

// ---- PASO 2: Tipo de venta y reserva ----

export const step2Schema = z
  .object({
    saleType: SaleTypeEnum,
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
      message: 'El periodo maximo de separacion es requerido',
      path: ['maximumHoldPeriod'],
    }
  );

// ---- PASO 3: Configuracion de pago directo ----

export const step3DirectPaymentSchema = z.object({
  totalAmount: z.number().min(0, 'El monto total debe ser mayor o igual a 0'),
  totalAmountUrbanDevelopment: z.number().min(0, 'El monto debe ser mayor o igual a 0'),
  initialAmountUrbanDevelopment: z.number().optional(),
  quantityHuCuotes: z.number().min(1, 'Debe ser al menos 1 cuota').optional(),
  firstPaymentDateHu: z.string().optional(),
});

// ---- PASO 3: Configuracion de pago financiado ----

export const step3FinancedSchema = z.object({
  totalAmount: z.number().min(0, 'El monto total debe ser mayor o igual a 0'),
  initialAmount: z.number().min(0.01, 'La cuota inicial debe ser mayor a 0'),
  quantitySaleCoutes: z.number().min(1, 'Debe ser al menos 1 cuota'),
  firstPaymentDate: z.string().min(1, 'La fecha de primera cuota es requerida'),
  totalAmountUrbanDevelopment: z.number().min(0, 'El monto debe ser mayor o igual a 0'),
  initialAmountUrbanDevelopment: z.number().optional(),
  quantityHuCuotes: z.number().min(1, 'Debe ser al menos 1 cuota').optional(),
  firstPaymentDateHu: z.string().optional(),
});

// ---- PASO 4: Garante ----

export const guarantorSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email invalido'),
  document: z.string().min(8, 'El documento debe tener al menos 8 caracteres'),
  documentType: DocumentTypeEnum,
  phone: z.string().min(9, 'El telefono debe tener al menos 9 digitos'),
  address: z.string().min(5, 'La direccion debe tener al menos 5 caracteres'),
});

// ---- PASO 4: Cliente secundario ----

export const secondaryClientSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email invalido'),
  document: z.string().min(8, 'El documento debe tener al menos 8 caracteres'),
  documentType: DocumentTypeEnum,
  phone: z.string().min(9, 'El telefono debe tener al menos 9 digitos'),
  address: z.string().min(5, 'La direccion debe tener al menos 5 caracteres'),
});

// ---- PASO 4: Cliente principal y garante ----

export const step4Schema = z.object({
  leadId: z.string().min(1, 'El cliente es requerido'),
  clientAddress: z.string().min(5, 'La direccion debe tener al menos 5 caracteres'),
  guarantor: guarantorSchema.optional(),
  secondaryClients: z.array(secondaryClientSchema).optional(),
});

// ---- REGISTRAR PAGO (voucher) ----

export const voucherSchema = z.object({
  bankName: z.string().optional(),
  transactionReference: z.string().min(1, 'La referencia de transaccion es requerida'),
  transactionDate: z.string().min(1, 'La fecha de transaccion es requerida'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  file: z.instanceof(File, { message: 'El comprobante es requerido' }),
});

// ---- Tipos inferidos ----

export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3DirectPaymentFormData = z.infer<typeof step3DirectPaymentSchema>;
export type Step3FinancedFormData = z.infer<typeof step3FinancedSchema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type GuarantorFormData = z.infer<typeof guarantorSchema>;
export type SecondaryClientFormData = z.infer<typeof secondaryClientSchema>;
export type VoucherFormData = z.infer<typeof voucherSchema>;
