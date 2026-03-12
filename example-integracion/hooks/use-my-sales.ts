// ============================================================
// HOOK: useMySales - Listar mis ventas (rol VEN)
// ============================================================
// Ejemplo de como usar React Query para obtener las ventas
// del vendedor autenticado con paginacion y filtros.
// ============================================================

'use client';

import { useQuery } from '@tanstack/react-query';
import { getMySales } from '../lib/queries';
import type { MySalesQueryParams } from '../types';

export function useMySales(params: MySalesQueryParams = {}) {
  return useQuery({
    queryKey: ['my-sales', params],
    queryFn: () => getMySales(params),
    staleTime: 5 * 60 * 1000, // Datos frescos por 5 minutos
  });
}

// ---- EJEMPLO DE USO EN UN COMPONENTE ----
//
// function MySalesPage() {
//   const [page, setPage] = useState(1);
//   const [filters, setFilters] = useState<MySalesQueryParams>({});
//
//   const { data, isLoading, error } = useMySales({
//     page,
//     limit: 20,
//     order: 'DESC',
//     ...filters,
//   });
//
//   if (isLoading) return <div>Cargando...</div>;
//   if (error) return <div>Error al cargar ventas</div>;
//
//   return (
//     <div>
//       <h1>Mis Ventas ({data.meta.totalItems} total)</h1>
//       {data.items.map(sale => (
//         <div key={sale.id}>
//           {sale.client.firstName} {sale.client.lastName} -
//           Lote: {sale.lot.name} -
//           Estado: {sale.status} -
//           Total: {sale.totalAmount}
//         </div>
//       ))}
//       <Pagination
//         currentPage={data.meta.currentPage}
//         totalPages={data.meta.totalPages}
//         onPageChange={setPage}
//       />
//     </div>
//   );
// }
