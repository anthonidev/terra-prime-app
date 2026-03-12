// ============================================================
// MUTATIONS - Funciones de escritura (POST/PATCH) para la API
// ============================================================
// Operaciones que modifican datos en el servidor.
// Todas requieren autenticacion Bearer token (rol VEN).
// ============================================================

import { apiClient } from './api-client';
import type {
  CalculateAmortizationInput,
  AmortizationResponse,
  CreateGuarantorClientInput,
  CreateGuarantorClientResponse,
  CreateSaleInput,
  CreatedSaleResponse,
  RegisterPaymentInput,
  PaymentResponse,
} from '../types';

// =============================================
// FLUJO 1: CREAR VENTA
// =============================================

/**
 * Calcula la tabla de amortizacion para una venta financiada.
 * Se usa en el Paso 3 para generar el cronograma de cuotas.
 *
 * POST /api/sales/financing/calculate-amortization
 *
 * @param input - Datos para el calculo (montos, tasa, fechas)
 * @returns Tabla de cuotas con meta-informacion
 */
export async function calculateAmortization(
  input: CalculateAmortizationInput
): Promise<AmortizationResponse> {
  const response = await apiClient.post<AmortizationResponse>(
    '/api/sales/financing/calculate-amortization',
    input
  );
  return response.data;
}

/**
 * Crea el cliente, garante y clientes secundarios.
 * Se ejecuta en el Paso 4 antes de crear la venta.
 *
 * POST /api/sales/clients/guarantors/create
 *
 * @param input - Datos del cliente principal, garante opcional y secundarios
 * @returns IDs del cliente, garante y secundarios creados
 */
export async function createGuarantorClient(
  input: CreateGuarantorClientInput
): Promise<CreateGuarantorClientResponse> {
  const response = await apiClient.post<CreateGuarantorClientResponse>(
    '/api/sales/clients/guarantors/create',
    input
  );
  return response.data;
}

/**
 * Crea una nueva venta.
 * Se ejecuta en el Paso 5 (confirmacion) con todos los datos recopilados.
 *
 * POST /api/sales
 *
 * @param input - Datos completos de la venta
 * @returns Venta creada con datos del cliente y lote
 */
export async function createSale(input: CreateSaleInput): Promise<CreatedSaleResponse> {
  const response = await apiClient.post<CreatedSaleResponse>('/api/sales', input);
  return response.data;
}

// =============================================
// FLUJOS 2 y 3: REGISTRAR PAGO
// =============================================

/**
 * Registra un pago para una venta.
 * Soporta multiples vouchers con archivos adjuntos.
 *
 * POST /api/sales/payments/sale/:id
 * Content-Type: multipart/form-data
 *
 * El body es un FormData con:
 * - payments: JSON stringified array de VoucherInput
 * - files: archivos de comprobante (uno por voucher, referenciado por fileIndex)
 *
 * @param id - ID de la venta
 * @param data - Pagos y archivos de comprobante
 * @returns Pago registrado con vouchers
 */
export async function registerPayment(
  id: string,
  data: RegisterPaymentInput
): Promise<PaymentResponse> {
  const formData = new FormData();
  formData.append('payments', JSON.stringify(data.payments));
  data.files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await apiClient.post<PaymentResponse>(
    `/api/sales/payments/sale/${id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}
