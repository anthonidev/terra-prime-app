// ============================================================
// HOOKS: Crear Venta - Mutations para el flujo de creacion
// ============================================================
// Hooks de React Query para las mutaciones del flujo de
// creacion de venta (calcular amortizacion, crear cliente,
// crear venta).
// ============================================================

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSale, calculateAmortization, createGuarantorClient } from '../lib/mutations';
import { toast } from 'sonner'; // Reemplazar con tu sistema de notificaciones

// ---- Hook para crear la venta (Paso 5) ----

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      // Invalidar queries de ventas para refrescar listados
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['my-sales'] });
      toast.success('Venta creada exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear la venta');
      console.error('Error creating sale:', error);
    },
  });
}

// ---- Hook para calcular amortizacion (Paso 3 - Financiado) ----

export function useCalculateAmortization() {
  return useMutation({
    mutationFn: calculateAmortization,
    onError: (error) => {
      toast.error('Error al calcular la tabla de amortizacion');
      console.error('Error calculating amortization:', error);
    },
  });
}

// ---- Hook para crear cliente/garante (Paso 4) ----

export function useCreateGuarantorClient() {
  return useMutation({
    mutationFn: createGuarantorClient,
    onSuccess: () => {
      toast.success('Cliente y garante creados exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear cliente y garante');
      console.error('Error creating guarantor client:', error);
    },
  });
}

// ---- EJEMPLO DE USO COMPLETO DEL FLUJO DE CREACION ----
//
// function CreateSaleForm() {
//   const { mutateAsync: createClientMutation } = useCreateGuarantorClient();
//   const { mutateAsync: createSaleMutation, isPending } = useCreateSale();
//   const { mutateAsync: calcAmortization } = useCalculateAmortization();
//
//   // Paso 3: Calcular amortizacion (solo para FINANCED)
//   async function handleCalculateAmortization() {
//     const result = await calcAmortization({
//       totalAmount: 100000,
//       initialAmount: 20000,
//       interestRateSections: [{ startInstallment: 1, endInstallment: 36, interestRate: 12 }],
//       firstPaymentDate: '2024-03-01',
//     });
//     // result.installments = tabla de cuotas
//     // result.meta = resumen (totales, conteos)
//   }
//
//   // Paso 4 + 5: Crear cliente y luego crear venta
//   async function handleSubmit(formData) {
//     // 1. Crear cliente (y opcionalmente garante/secundarios)
//     const clientResult = await createClientMutation({
//       createClient: {
//         leadId: formData.leadId,
//         address: formData.clientAddress,
//       },
//       createGuarantor: formData.guarantor, // opcional
//       createSecondaryClient: formData.secondaryClients, // opcional
//     });
//
//     // 2. Crear la venta con los IDs obtenidos
//     const sale = await createSaleMutation({
//       lotId: formData.selectedLot.id,
//       saleType: formData.saleType, // 'DIRECT_PAYMENT' o 'FINANCED'
//       clientId: clientResult.clientId,
//       totalAmount: formData.totalAmount,
//       totalAmountUrbanDevelopment: formData.totalAmountUrbanDevelopment,
//       guarantorId: clientResult.guarantorId,
//       secondaryClientsIds: clientResult.secondaryClientIds,
//       // Campos para FINANCED:
//       initialAmount: formData.initialAmount,
//       interestRateSections: formData.interestRateSections,
//       quantitySaleCoutes: formData.quantitySaleCoutes,
//       combinedInstallments: formData.combinedInstallments,
//       // Campos para reserva (opcional):
//       isReservation: formData.isReservation,
//       reservationAmount: formData.reservationAmount,
//       maximumHoldPeriod: formData.maximumHoldPeriod,
//     });
//
//     // sale.id = ID de la venta creada
//     // Redirigir a detalle: /ventas/detalle/{sale.id}
//   }
// }
