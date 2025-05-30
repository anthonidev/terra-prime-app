import * as z from 'zod';

// Función helper para transformar valores a números
const numberTransform = z.union([z.string(), z.number()]).transform((val) => {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  return isNaN(num) ? 0 : num;
});

// Paso 1: Selección de proyecto y tipo de venta
export const step1Schema = z.object({
  lotId: z.string().min(1, 'Debe seleccionar un lote'),
  saleType: z.enum(['DIRECT_PAYMENT', 'FINANCED'], {
    errorMap: () => ({ message: 'Debe seleccionar un tipo de venta' })
  })
});

// Paso 2: Configuración financiera
export const step2BaseSchema = z.object({
  totalAmount: numberTransform.refine((val) => val > 0, 'El monto total debe ser mayor a 0'),
  totalAmountUrbanDevelopment: numberTransform.refine(
    (val) => val >= 0,
    'El monto de habilitación urbana debe ser mayor o igual a 0'
  ),
  firstPaymentDateHu: z.string().optional(),
  initialAmountUrbanDevelopment: numberTransform
    .refine((val) => val >= 0, 'El monto inicial de HU debe ser mayor o igual a 0')
    .optional(),
  quantityHuCuotes: numberTransform
    .refine((val) => val >= 0, 'La cantidad de cuotas de HU debe ser mayor o igual a 0')
    .optional()
});

// Esquema para calcular amortización (separado del esquema de venta)
export const amortizationCalculationSchema = z.object({
  totalAmount: numberTransform.refine((val) => val > 0, 'El monto total debe ser mayor a 0'),
  initialAmount: numberTransform.refine(
    (val) => val >= 0,
    'El monto inicial debe ser mayor o igual a 0'
  ),
  interestRate: numberTransform.refine(
    (val) => val >= 0 && val <= 100,
    'La tasa de interés debe estar entre 0 y 100'
  ),
  quantitySaleCoutes: numberTransform.refine(
    (val) => val >= 1 && val <= 74,
    'La cantidad de cuotas debe estar entre 1 y 74'
  ),
  firstPaymentDate: z.string().min(1, 'La fecha del primer pago es requerida')
});

export const step2FinancedSchema = step2BaseSchema.extend({
  initialAmount: numberTransform.refine(
    (val) => val >= 0,
    'El monto inicial debe ser mayor o igual a 0'
  ),
  interestRate: numberTransform.refine(
    (val) => val >= 0 && val <= 100,
    'La tasa de interés debe estar entre 0 y 100'
  ),
  quantitySaleCoutes: numberTransform.refine(
    (val) => val >= 1 && val <= 74,
    'La cantidad de cuotas debe estar entre 1 y 74'
  ),
  financingInstallments: z
    .array(
      z.object({
        couteAmount: z.number(),
        expectedPaymentDate: z.string()
      })
    )
    .min(1, 'Debe tener al menos una cuota de financiamiento')
});

export const step2Schema = z.discriminatedUnion('saleType', [
  z.object({
    saleType: z.literal('DIRECT_PAYMENT'),
    ...step2BaseSchema.shape
  }),
  z.object({
    saleType: z.literal('FINANCED'),
    ...step2FinancedSchema.shape
  })
]);

// Paso 3: Cliente y garante
export const step3Schema = z.object({
  clientId: z.number().min(1, 'Debe seleccionar o crear un cliente'),
  guarantorId: z.number().min(1, 'Debe agregar un garante'),
  leadId: z.string().min(1, 'Debe seleccionar un lead'),
  clientAddress: z.string().min(1, 'La dirección del cliente es requerida')
});

// Garante
export const guarantorSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  document: z.string().min(8, 'El documento debe tener al menos 8 caracteres'),
  documentType: z.enum(['DNI', 'CE', 'RUC'], {
    errorMap: () => ({ message: 'Tipo de documento inválido' })
  }),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos'),
  address: z.string().min(1, 'La dirección es requerida')
});

// Paso 4: Finalización
export const step4Schema = z.object({
  saleDate: z.string().min(1, 'La fecha de venta es requerida'),
  contractDate: z.string().min(1, 'La fecha de contrato es requerida'),
  paymentDate: z.string().min(1, 'La fecha de pago es requerida')
});

// Schema completo para la venta final
export const createSaleSchema = z.object({
  // Paso 1
  lotId: z.string().min(1, 'Debe seleccionar un lote'),
  saleType: z.enum(['DIRECT_PAYMENT', 'FINANCED']),

  // Paso 2
  totalAmount: numberTransform.refine((val) => val > 0, 'El monto total debe ser mayor a 0'),
  totalAmountUrbanDevelopment: numberTransform.refine(
    (val) => val >= 0,
    'El monto de habilitación urbana debe ser mayor o igual a 0'
  ),
  firstPaymentDateHu: z.string().optional(),
  initialAmountUrbanDevelopment: numberTransform.refine((val) => val >= 0).optional(),
  quantityHuCuotes: numberTransform.refine((val) => val >= 0).optional(),

  // Campos de financiamiento (solo si saleType es FINANCED)
  initialAmount: numberTransform.refine((val) => val >= 0).optional(),
  interestRate: numberTransform.refine((val) => val >= 0 && val <= 100).optional(),
  quantitySaleCoutes: numberTransform.refine((val) => val >= 1 && val <= 74).optional(),
  financingInstallments: z
    .array(
      z.object({
        couteAmount: z.number(),
        expectedPaymentDate: z.string()
      })
    )
    .optional(),

  // Paso 3
  clientId: z.number().min(1, 'Debe seleccionar o crear un cliente'),
  guarantorId: z.number().min(1, 'Debe agregar un garante'),

  // Paso 4
  paymentDate: z.string().min(1, 'La fecha de pago es requerida'),
  saleDate: z.string().min(1, 'La fecha de venta es requerida'),
  contractDate: z.string().min(1, 'La fecha de contrato es requerida')
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type GuarantorFormData = z.infer<typeof guarantorSchema>;
export type CreateSaleFormData = z.infer<typeof createSaleSchema>;
export type AmortizationCalculationData = z.infer<typeof amortizationCalculationSchema>;
