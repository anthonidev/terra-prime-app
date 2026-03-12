// ============================================================
// HOOK: useFinancingDetail - Detalle de financiamiento
// ============================================================
// Obtiene el detalle del financiamiento de una venta,
// incluyendo cuotas, pagos de mora e historial de adendas.
// ============================================================

'use client';

import { useQuery } from '@tanstack/react-query';
import { getFinancingDetail } from '../lib/queries';

export function useFinancingDetail(saleId: string, financingId: string) {
  return useQuery({
    queryKey: ['financing-detail', saleId, financingId],
    queryFn: () => getFinancingDetail(saleId, financingId),
    staleTime: 5 * 60 * 1000,
    enabled: !!saleId && !!financingId,
  });
}

// ---- EJEMPLO DE USO ----
//
// function FinancingDetailPage({ saleId, financingId }) {
//   const { data, isLoading } = useFinancingDetail(saleId, financingId);
//
//   if (isLoading) return <div>Cargando...</div>;
//   if (!data) return <div>No encontrado</div>;
//
//   const { sale, financing } = data;
//
//   return (
//     <div>
//       <h1>Financiamiento - {sale.lot.project} / {sale.lot.name}</h1>
//       <p>Cliente: {sale.client.fullName}</p>
//       <p>Tipo: {financing.financingType}</p>
//       <p>Inicial: {financing.initialAmount} (Pagado: {financing.initialAmountPaid})</p>
//       <p>Cuotas: {financing.quantityCoutes}</p>
//       <p>Tasa: {financing.interestRate}%</p>
//       <p>Total cuotas: {financing.totalCouteAmount}</p>
//       <p>Pagado: {financing.totalPaid} / Pendiente: {financing.totalPending}</p>
//       <p>Mora total: {financing.totalLateFee}</p>
//
//       <h2>Cronograma de cuotas</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>#</th><th>Monto</th><th>Pagado</th><th>Pendiente</th>
//             <th>Fecha</th><th>Mora</th><th>Estado</th>
//           </tr>
//         </thead>
//         <tbody>
//           {financing.installments.map(inst => (
//             <tr key={inst.id}>
//               <td>{inst.numberCuote}</td>
//               <td>{inst.couteAmount}</td>
//               <td>{inst.coutePaid}</td>
//               <td>{inst.coutePending}</td>
//               <td>{inst.expectedPaymentDate}</td>
//               <td>{inst.lateFeeAmount}</td>
//               <td>{inst.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
