// ============================================================
// HOOK: useSaleDetail - Ver detalle de una venta
// ============================================================
// Obtiene el detalle completo de una venta por su ID.
// Incluye validacion de datos y cache inteligente.
// ============================================================

'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSaleDetail } from '../lib/queries';
import { useEffect } from 'react';
import type { SaleDetail } from '../types';

export function useSaleDetail(id: string) {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ['sale-detail', id],
    queryFn: async () => {
      const data = await getSaleDetail(id);

      // Validar que los datos esenciales esten completos
      if (!data || !data.lot || !data.client) {
        throw new Error('Datos incompletos recibidos de la API');
      }

      return data;
    },
    staleTime: 2 * 60 * 1000, // Datos frescos por 2 minutos
    gcTime: 10 * 60 * 1000, // Mantener en cache 10 minutos
    enabled: !!id, // Solo fetch si existe el ID
    placeholderData: (previousData) => {
      if (previousData && previousData.lot && previousData.client) {
        return previousData as SaleDetail;
      }
      return undefined;
    },
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  });

  // Auto-refrescar si se detectan datos corruptos en cache
  useEffect(() => {
    if (result.data && (!result.data.lot || !result.data.client) && !result.isFetching) {
      queryClient.invalidateQueries({ queryKey: ['sale-detail', id] });
    }
  }, [result.data, result.isFetching, id, queryClient]);

  return result;
}

// ---- EJEMPLO DE USO ----
//
// function SaleDetailPage({ params }: { params: { id: string } }) {
//   const { data: sale, isLoading, error } = useSaleDetail(params.id);
//
//   if (isLoading) return <div>Cargando detalle...</div>;
//   if (error) return <div>Error: {error.message}</div>;
//   if (!sale) return <div>Venta no encontrada</div>;
//
//   return (
//     <div>
//       <h1>Venta #{sale.id}</h1>
//       <p>Estado: {sale.status}</p>
//       <p>Cliente: {sale.client.firstName} {sale.client.lastName}</p>
//       <p>Lote: {sale.lot.name} - {sale.lot.project}</p>
//       <p>Monto total: {sale.totalAmount} {sale.currency}</p>
//       <p>Pagado: {sale.totalAmountPaid}</p>
//
//       <h2>Historial de pagos</h2>
//       {sale.paymentsSummary.map(payment => (
//         <div key={payment.id}>
//           Monto: {payment.amount} - Estado: {payment.status}
//         </div>
//       ))}
//
//       {sale.financing && (
//         <div>
//           <h2>Financiamiento</h2>
//           <p>Cuotas: {sale.financing.lot.quantityCoutes}</p>
//           <p>Tasa: {sale.financing.lot.interestRate}%</p>
//         </div>
//       )}
//     </div>
//   );
// }
